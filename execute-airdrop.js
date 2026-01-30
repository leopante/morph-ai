// 🎁 AIRDROP SCRIPT - PRONTO ALL'USO
// 
// ISTRUZIONI:
// 1. npm install @solana/web3.js @solana/spl-token node-fetch
// 2. Sostituisci le variabili qui sotto
// 3. node execute-airdrop.js

import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { 
  getOrCreateAssociatedTokenAccount, 
  transfer,
  getAccount 
} from '@solana/spl-token';
import fs from 'fs';
import fetch from 'node-fetch';

// ==================== CONFIGURAZIONE ====================
const CONFIG = {
  // 🔑 Il TUO token address (sostituisci dopo aver creato su Pump.fun)
  TOKEN_MINT: 'IL_TUO_TOKEN_ADDRESS_QUI',
  
  // 🌐 Network (usa mainnet-beta per produzione)
  CLUSTER_URL: 'https://api.mainnet-beta.solana.com',
  // Per test: 'https://api.devnet.solana.com'
  
  // 💰 Airdrop settings
  MIN_BALANCE: 1000,        // Minimo token per essere elegibile
  TOTAL_AIRDROP: 50000,     // Totale token da distribuire
  DISTRIBUTION_TYPE: 'PROPORTIONAL', // 'PROPORTIONAL' o 'FIXED'
  FIXED_AMOUNT: 50,         // Usato solo se type = 'FIXED'
  
  // ⚙️ Technical settings
  BATCH_SIZE: 50,           // Processa N wallet alla volta
  DELAY_BETWEEN_TX: 500,    // Millisecondi tra transazioni
  MAX_RETRIES: 3,           // Retry su errore
  
  // 📁 Files
  WALLET_PATH: './airdrop-wallet.json',
  RESULTS_FILE: './airdrop-results.json'
};

// ==================== FUNCTIONS ====================

// 1️⃣ Fetch tutti gli holders del token
async function fetchAllHolders(tokenAddress) {
  console.log('📊 Fetching holders...');
  const holders = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    try {
      const response = await fetch(
        `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&offset=${offset}&limit=${limit}`
      );
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) break;
      
      holders.push(...data.data.map(h => ({
        address: h.address,
        balance: parseFloat(h.amount) / 1e9 // Converti da lamports
      })));
      
      offset += limit;
      console.log(`   Trovati ${holders.length} holders...`);
      
      // Rate limit protection
      await sleep(1000);
      
    } catch (error) {
      console.error('Errore fetch holders:', error);
      break;
    }
  }
  
  console.log(`✅ Totale holders: ${holders.length}`);
  return holders;
}

// 2️⃣ Filtra holders elegibili
function filterEligibleHolders(holders, minBalance) {
  const eligible = holders.filter(h => h.balance >= minBalance);
  console.log(`✅ Holders elegibili (>= ${minBalance} token): ${eligible.length}`);
  return eligible;
}

// 3️⃣ Calcola distribuzione
function calculateDistribution(holders, totalAirdrop, type, fixedAmount) {
  console.log(`💰 Calcolando distribuzione (${type})...`);
  
  if (type === 'FIXED') {
    return holders.map(h => ({
      address: h.address,
      currentBalance: h.balance,
      airdropAmount: fixedAmount
    }));
  }
  
  // PROPORTIONAL
  const totalBalance = holders.reduce((sum, h) => sum + h.balance, 0);
  
  return holders.map(h => ({
    address: h.address,
    currentBalance: h.balance,
    airdropAmount: (h.balance / totalBalance) * totalAirdrop,
    percentage: ((h.balance / totalBalance) * 100).toFixed(2)
  }));
}

// 4️⃣ Esegui airdrop
async function executeAirdrop(distribution, config) {
  console.log('\n🚀 INIZIO AIRDROP!\n');
  
  // Carica wallet
  const walletData = JSON.parse(fs.readFileSync(config.WALLET_PATH, 'utf8'));
  const walletKeypair = Keypair.fromSecretKey(new Uint8Array(walletData));
  
  const connection = new Connection(config.CLUSTER_URL, 'confirmed');
  const tokenMint = new PublicKey(config.TOKEN_MINT);
  
  console.log(`Wallet Address: ${walletKeypair.publicKey.toString()}`);
  
  // Verifica balance SOL
  const solBalance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`SOL Balance: ${(solBalance / 1e9).toFixed(4)} SOL`);
  
  if (solBalance < 0.01 * 1e9) {
    console.error('❌ ERRORE: Balance SOL insufficiente! Servono almeno 0.01 SOL');
    return;
  }
  
  // Token account sender
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    walletKeypair,
    tokenMint,
    walletKeypair.publicKey
  );
  
  const senderTokenBalance = await getAccount(connection, fromTokenAccount.address);
  console.log(`Token Balance: ${Number(senderTokenBalance.amount) / 1e9} tokens\n`);
  
  // Verifica balance sufficiente
  const totalRequired = distribution.reduce((sum, d) => sum + d.airdropAmount, 0);
  if (Number(senderTokenBalance.amount) / 1e9 < totalRequired) {
    console.error(`❌ ERRORE: Token insufficienti! Richiesti: ${totalRequired}, Disponibili: ${Number(senderTokenBalance.amount) / 1e9}`);
    return;
  }
  
  // Risultati
  const results = {
    timestamp: new Date().toISOString(),
    config: config,
    totalRecipients: distribution.length,
    totalAmount: totalRequired,
    transactions: [],
    summary: {
      success: 0,
      failed: 0,
      skipped: 0
    }
  };
  
  // Esegui in batch
  for (let i = 0; i < distribution.length; i += config.BATCH_SIZE) {
    const batch = distribution.slice(i, i + config.BATCH_SIZE);
    console.log(`\n📦 Batch ${Math.floor(i / config.BATCH_SIZE) + 1}/${Math.ceil(distribution.length / config.BATCH_SIZE)}`);
    
    for (const recipient of batch) {
      let retries = 0;
      let success = false;
      let signature = null;
      let error = null;
      
      while (retries < config.MAX_RETRIES && !success) {
        try {
          const recipientPubkey = new PublicKey(recipient.address);
          
          // Token account recipient
          const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            walletKeypair,
            tokenMint,
            recipientPubkey
          );
          
          // Transfer
          signature = await transfer(
            connection,
            walletKeypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            walletKeypair.publicKey,
            Math.floor(recipient.airdropAmount * 1e9) // Converti in lamports
          );
          
          success = true;
          results.summary.success++;
          
          console.log(`✅ ${recipient.address.slice(0, 8)}... | ${recipient.airdropAmount.toFixed(2)} tokens | ${signature.slice(0, 8)}...`);
          
        } catch (err) {
          retries++;
          error = err.message;
          
          if (retries >= config.MAX_RETRIES) {
            results.summary.failed++;
            console.error(`❌ ${recipient.address.slice(0, 8)}... | FAILED after ${retries} retries: ${error}`);
          } else {
            console.warn(`⚠️ Retry ${retries}/${config.MAX_RETRIES} for ${recipient.address.slice(0, 8)}...`);
            await sleep(1000);
          }
        }
      }
      
      // Salva risultato
      results.transactions.push({
        address: recipient.address,
        amount: recipient.airdropAmount,
        currentBalance: recipient.currentBalance,
        signature: signature,
        success: success,
        error: error,
        retries: retries
      });
      
      // Delay tra transazioni
      await sleep(config.DELAY_BETWEEN_TX);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 AIRDROP COMPLETATO!');
  console.log('='.repeat(60));
  console.log(`✅ Successi: ${results.summary.success}`);
  console.log(`❌ Falliti: ${results.summary.failed}`);
  console.log(`💰 Totale distribuito: ${results.summary.success * (results.totalAmount / distribution.length)} tokens`);
  console.log(`💸 Costo stimato: ${(results.summary.success * 0.000005).toFixed(6)} SOL`);
  console.log('='.repeat(60) + '\n');
  
  // Salva risultati
  fs.writeFileSync(config.RESULTS_FILE, JSON.stringify(results, null, 2));
  console.log(`📄 Risultati salvati in: ${config.RESULTS_FILE}\n`);
  
  return results;
}

// 5️⃣ Utility: sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== MAIN ====================

async function main() {
  console.clear();
  console.log('='.repeat(60));
  console.log('🦞 MORPH AI - AIRDROP SYSTEM');
  console.log('='.repeat(60) + '\n');
  
  // Verifica configurazione
  if (CONFIG.TOKEN_MINT === 'IL_TUO_TOKEN_ADDRESS_QUI') {
    console.error('❌ ERRORE: Configura TOKEN_MINT prima di eseguire!');
    process.exit(1);
  }
  
  if (!fs.existsSync(CONFIG.WALLET_PATH)) {
    console.error(`❌ ERRORE: Wallet file non trovato: ${CONFIG.WALLET_PATH}`);
    console.log('\nCrea il wallet con:');
    console.log('solana-keygen new --outfile ./airdrop-wallet.json\n');
    process.exit(1);
  }
  
  try {
    // Step 1: Fetch holders
    const allHolders = await fetchAllHolders(CONFIG.TOKEN_MINT);
    
    if (allHolders.length === 0) {
      console.error('❌ Nessun holder trovato!');
      process.exit(1);
    }
    
    // Step 2: Filter eligible
    const eligibleHolders = filterEligibleHolders(allHolders, CONFIG.MIN_BALANCE);
    
    if (eligibleHolders.length === 0) {
      console.error('❌ Nessun holder elegibile!');
      process.exit(1);
    }
    
    // Step 3: Calculate distribution
    const distribution = calculateDistribution(
      eligibleHolders,
      CONFIG.TOTAL_AIRDROP,
      CONFIG.DISTRIBUTION_TYPE,
      CONFIG.FIXED_AMOUNT
    );
    
    // Preview
    console.log('\n📋 PREVIEW DISTRIBUZIONE (primi 5):');
    console.log('-'.repeat(60));
    distribution.slice(0, 5).forEach((d, i) => {
      console.log(`${i + 1}. ${d.address.slice(0, 8)}... | Balance: ${d.currentBalance.toFixed(2)} | Airdrop: ${d.airdropAmount.toFixed(2)}`);
    });
    console.log('-'.repeat(60));
    
    const totalToDistribute = distribution.reduce((sum, d) => sum + d.airdropAmount, 0);
    console.log(`\n💰 TOTALE DA DISTRIBUIRE: ${totalToDistribute.toFixed(2)} tokens`);
    console.log(`📊 Recipients: ${distribution.length}`);
    console.log(`💸 Costo stimato: ~${(distribution.length * 0.000005).toFixed(6)} SOL\n`);
    
    // Conferma
    console.log('⚠️  ATTENZIONE: Stai per eseguire l\'airdrop su MAINNET!');
    console.log('Premi CTRL+C per annullare, o aspetta 10 secondi per continuare...\n');
    
    await sleep(10000);
    
    // Step 4: Execute!
    const results = await executeAirdrop(distribution, CONFIG);
    
    console.log('✅ Processo completato!');
    
  } catch (error) {
    console.error('\n❌ ERRORE CRITICO:', error);
    process.exit(1);
  }
}

// Run
main();
