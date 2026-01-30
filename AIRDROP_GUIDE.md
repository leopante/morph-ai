# 🎁 GUIDA COMPLETA AIRDROP SU SOLANA

## 📋 Cosa Serve

1. **Node.js** installato (versione 16+)
2. **Solana CLI** installato
3. **Wallet con SOL** per pagare le gas fees
4. **Lista wallet** degli holder elegibili
5. **Token** già creato su Solana

---

## 🛠️ STEP 1: Installare Solana CLI

### Windows
```powershell
# Apri PowerShell come Amministratore
cmd /c "curl https://release.solana.com/v1.17.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
C:\solana-install-tmp\solana-install-init.exe v1.17.0
```

### Mac/Linux
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

### Verifica Installazione
```bash
solana --version
# Output: solana-cli 1.17.0
```

---

## 🔑 STEP 2: Setup Wallet

### Crea Wallet per Airdrop
```bash
# Crea nuovo wallet
solana-keygen new --outfile ~/airdrop-wallet.json

# Salva la seed phrase in un posto SICURO!
```

### Configura Solana CLI
```bash
# Imposta network (mainnet-beta per produzione)
solana config set --url https://api.mainnet-beta.solana.com

# Imposta il wallet
solana config set --keypair ~/airdrop-wallet.json

# Verifica configurazione
solana config get
```

### Controlla Balance
```bash
solana balance
```

### Invia SOL al Wallet Airdrop
- Invia almeno 0.1 SOL per coprire le gas fees
- Calcolo: 1000 airdrop × 0.000005 SOL = ~0.005 SOL + buffer

---

## 📊 STEP 3: Ottenere Lista Holders

### Metodo 1: API Solscan (Gratis)
```javascript
// get-holders.js
async function fetchHolders(tokenAddress) {
  const holders = [];
  let offset = 0;
  const limit = 100;
  
  while (true) {
    const response = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&offset=${offset}&limit=${limit}`
    );
    
    const data = await response.json();
    
    if (!data.data || data.data.length === 0) break;
    
    holders.push(...data.data.map(h => ({
      address: h.address,
      balance: parseFloat(h.amount)
    })));
    
    offset += limit;
    
    // Rate limit: pausa 1 secondo
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return holders;
}

// Uso
const TOKEN_ADDRESS = 'IL_TUO_TOKEN_ADDRESS';
const holders = await fetchHolders(TOKEN_ADDRESS);
console.log(`Trovati ${holders.length} holders`);
```

### Metodo 2: Helius API (Migliore, richiede API key gratis)
```javascript
async function fetchHoldersHelius(tokenAddress, apiKey) {
  const response = await fetch(
    `https://api.helius.xyz/v0/token-metadata?api-key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mintAccounts: [tokenAddress] })
    }
  );
  
  return await response.json();
}
```

---

## 🎯 STEP 4: Filtrare Holders Elegibili

```javascript
// filter-holders.js
function filterEligibleHolders(holders, minBalance) {
  return holders
    .filter(h => h.balance >= minBalance)
    .sort((a, b) => b.balance - a.balance); // Ordina per balance (opzionale)
}

// Esempio
const MIN_BALANCE = 1000; // Minimo 1000 token per essere elegibile
const eligibleHolders = filterEligibleHolders(holders, MIN_BALANCE);

console.log(`${eligibleHolders.length} holders elegibili per l'airdrop`);
```

---

## 💰 STEP 5: Calcolare Distribuzione

### Distribuzione Proporzionale
```javascript
function calculateDistribution(holders, totalAirdrop) {
  const totalBalance = holders.reduce((sum, h) => sum + h.balance, 0);
  
  return holders.map(holder => ({
    address: holder.address,
    currentBalance: holder.balance,
    airdropAmount: (holder.balance / totalBalance) * totalAirdrop,
    percentage: (holder.balance / totalBalance) * 100
  }));
}

// Esempio: distribuire 100,000 token
const distribution = calculateDistribution(eligibleHolders, 100000);
```

### Distribuzione Fissa
```javascript
function calculateFixedDistribution(holders, amountPerHolder) {
  return holders.map(holder => ({
    address: holder.address,
    airdropAmount: amountPerHolder
  }));
}

// Esempio: 100 token a tutti
const distribution = calculateFixedDistribution(eligibleHolders, 100);
```

---

## 🚀 STEP 6: Eseguire l'Airdrop

### Metodo 1: SPL Token CLI (Manuale)

```bash
# Per ogni holder (devi farlo manualmente o con uno script)
spl-token transfer \
  <TOKEN_ADDRESS> \
  <AMOUNT> \
  <RECIPIENT_ADDRESS> \
  --owner ~/airdrop-wallet.json \
  --fund-recipient
```

### Metodo 2: Script Node.js Automatico (CONSIGLIATO)

```javascript
// airdrop-script.js
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import fs from 'fs';

const CLUSTER_URL = 'https://api.mainnet-beta.solana.com';
const TOKEN_MINT = new PublicKey('IL_TUO_TOKEN_ADDRESS');

async function executeAirdrop(distribution) {
  // Carica wallet
  const walletKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync('~/airdrop-wallet.json', 'utf8')))
  );
  
  const connection = new Connection(CLUSTER_URL, 'confirmed');
  
  // Token account del sender
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    walletKeypair,
    TOKEN_MINT,
    walletKeypair.publicKey
  );
  
  console.log(`🚀 Inizio airdrop a ${distribution.length} wallet...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const recipient of distribution) {
    try {
      const recipientPubkey = new PublicKey(recipient.address);
      
      // Token account del recipient (crea se non esiste)
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        walletKeypair,
        TOKEN_MINT,
        recipientPubkey
      );
      
      // Esegui transfer
      const signature = await transfer(
        connection,
        walletKeypair,
        fromTokenAccount.address,
        toTokenAccount.address,
        walletKeypair.publicKey,
        recipient.airdropAmount * 1e9 // Converti in lamports (9 decimali)
      );
      
      console.log(`✅ ${recipient.address}: ${recipient.airdropAmount} token | TX: ${signature}`);
      successCount++;
      
      // Pausa per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Errore per ${recipient.address}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\n🎉 Airdrop completato!`);
  console.log(`✅ Successi: ${successCount}`);
  console.log(`❌ Falliti: ${failCount}`);
  console.log(`💰 Totale distribuito: ${distribution.reduce((sum, r) => sum + r.airdropAmount, 0)} token`);
}

// Esegui
const distribution = JSON.parse(fs.readFileSync('./distribution.json', 'utf8'));
executeAirdrop(distribution);
```

### Installare Dependencies
```bash
npm install @solana/web3.js @solana/spl-token
```

### Eseguire lo Script
```bash
node airdrop-script.js
```

---

## 📝 STEP 7: Salvare i Risultati

```javascript
// save-results.js
function saveAirdropResults(results, filename) {
  const data = {
    timestamp: new Date().toISOString(),
    totalRecipients: results.length,
    totalAmount: results.reduce((sum, r) => sum + r.airdropAmount, 0),
    successCount: results.filter(r => r.success).length,
    failCount: results.filter(r => !r.success).length,
    transactions: results
  };
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`📄 Risultati salvati in ${filename}`);
}
```

---

## 💰 Calcolo Costi

### Gas Fees Solana
- **Costo per transazione**: ~0.000005 SOL
- **Per 1000 airdrop**: ~0.005 SOL (~$1)
- **Per 10000 airdrop**: ~0.05 SOL (~$10)

### Esempio Budget Completo
```
Creazione token: $2
Airdrop 1 (1000 wallet): $1
Airdrop 2 (1500 wallet): $1.50
Airdrop 3 (2000 wallet): $2
Airdrop 4 (3000 wallet): $3
---
TOTALE: ~$10 per tutto il sistema airdrop
```

---

## 🤖 STEP 8: Automazione con Monitoraggio Market Cap

```javascript
// auto-airdrop.js
import { fetchRealMarketCap } from './utils/solana.js';

const AIRDROP_STAGES = [
  { marketCap: 15000, amount: 50000, executed: false },
  { marketCap: 60000, amount: 100000, executed: false },
  { marketCap: 100000, amount: 150000, executed: false },
  { marketCap: 300000, amount: 500000, executed: false }
];

async function monitorAndAirdrop() {
  console.log('🤖 Sistema di airdrop automatico avviato...');
  
  setInterval(async () => {
    const data = await fetchRealMarketCap(TOKEN_ADDRESS);
    
    if (!data) return;
    
    console.log(`📊 Market Cap: $${data.marketCap.toLocaleString()}`);
    
    for (const stage of AIRDROP_STAGES) {
      if (!stage.executed && data.marketCap >= stage.marketCap) {
        console.log(`🎁 TRIGGER! Market cap raggiunto per stage ${stage.marketCap}`);
        
        // 1. Fetch holders
        const holders = await fetchHolders(TOKEN_ADDRESS);
        
        // 2. Filtra elegibili
        const eligible = filterEligibleHolders(holders, 1000);
        
        // 3. Calcola distribuzione
        const distribution = calculateDistribution(eligible, stage.amount);
        
        // 4. Esegui airdrop
        await executeAirdrop(distribution);
        
        // 5. Marca come eseguito
        stage.executed = true;
        
        // 6. Notifica (Telegram, Discord, etc.)
        await sendNotification(`Airdrop completato! ${stage.amount} token distribuiti`);
      }
    }
  }, 60000); // Controlla ogni minuto
}

monitorAndAirdrop();
```

---

## 🔔 STEP 9: Notifiche (Opzionale)

### Telegram Bot
```javascript
async function sendTelegramNotification(message) {
  const TELEGRAM_BOT_TOKEN = 'IL_TUO_BOT_TOKEN';
  const TELEGRAM_CHAT_ID = 'IL_TUO_CHAT_ID';
  
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  });
}
```

### Discord Webhook
```javascript
async function sendDiscordNotification(message) {
  const DISCORD_WEBHOOK_URL = 'IL_TUO_WEBHOOK_URL';
  
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: message,
      username: 'MORPH AI Airdrop Bot'
    })
  });
}
```

---

## ⚠️ Best Practices & Sicurezza

### ✅ DO
- **Testa sempre su devnet** prima di produzione
- **Backup del wallet** airdrop in posto sicuro
- **Rate limiting** tra transazioni (500ms-1s pause)
- **Logging dettagliato** di ogni transazione
- **Verifica balance** prima di iniziare
- **Split grandi airdrop** in batch (es: 100 alla volta)

### ❌ DON'T
- **Mai condividere** la private key
- **Mai hardcodare** seed phrase nel codice
- **Mai eseguire** su mainnet senza test
- **Mai ignorare** errori nelle transazioni
- **Mai usare** wallet personale per airdrop

---

## 🐛 Troubleshooting

**Errore: "Insufficient funds"**
→ Aggiungi più SOL al wallet airdrop

**Errore: "Account not found"**
→ Il recipient non ha un token account, usa `--fund-recipient`

**Errore: "Rate limited"**
→ Aumenta delay tra transazioni (1-2 secondi)

**Transazione fallita**
→ Salva l'address e riprova manualmente

---

## 📚 Risorse Utili

- **Solana Docs**: https://docs.solana.com
- **SPL Token Guide**: https://spl.solana.com/token
- **Helius API**: https://helius.dev
- **Solscan API**: https://public-api.solscan.io/docs

---

## 🎯 Quick Start Completo

```bash
# 1. Setup
solana-keygen new --outfile ~/airdrop-wallet.json
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair ~/airdrop-wallet.json

# 2. Invia SOL al wallet
# (usa Phantom o altro wallet)

# 3. Installa dependencies
npm install @solana/web3.js @solana/spl-token

# 4. Fetch holders
node get-holders.js > holders.json

# 5. Calcola distribuzione
node calculate-distribution.js

# 6. ESEGUI AIRDROP! 🚀
node airdrop-script.js
```

---

**FATTO! Ora hai tutto per fare airdrop professionali su Solana! 🎉**

*Remember: Test sempre su devnet prima!*
