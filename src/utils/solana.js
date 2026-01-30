// 🔌 SOLANA INTEGRATION - Per collegare il market cap reale
// 
// ISTRUZIONI:
// 1. Dopo aver creato il token su Pump.fun, ottieni l'indirizzo del contratto
// 2. Sostituisci 'YOUR_TOKEN_ADDRESS' con il vero indirizzo
// 3. Importa questa funzione in App.jsx e usala al posto della simulazione

// Fetch market cap from Jupiter API (popular Solana DEX aggregator)
export async function fetchRealMarketCap(tokenAddress) {
  try {
    const response = await fetch(
      `https://api.jup.ag/price/v2?ids=${tokenAddress}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price data');
    }
    
    const data = await response.json();
    const priceData = data.data[tokenAddress];
    
    if (!priceData) {
      throw new Error('Token not found');
    }
    
    // Calculate market cap: price * total supply
    // NOTA: Devi conoscere la total supply del tuo token
    const totalSupply = 1000000000; // Esempio: 1 miliardo di token
    const marketCap = priceData.price * totalSupply;
    
    return {
      price: priceData.price,
      marketCap: marketCap,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error fetching market cap:', error);
    return null;
  }
}

// Alternativa: Fetch da DexScreener (supporta molte chain)
export async function fetchMarketCapDexScreener(tokenAddress) {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );
    
    const data = await response.json();
    
    if (data.pairs && data.pairs.length > 0) {
      // Prendi il primo pair (solitamente quello con più liquidità)
      const mainPair = data.pairs[0];
      
      return {
        price: parseFloat(mainPair.priceUsd),
        marketCap: parseFloat(mainPair.fdv || mainPair.marketCap),
        liquidity: parseFloat(mainPair.liquidity?.usd || 0),
        volume24h: parseFloat(mainPair.volume?.h24 || 0),
        priceChange24h: parseFloat(mainPair.priceChange?.h24 || 0),
        timestamp: Date.now()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from DexScreener:', error);
    return null;
  }
}

// ESEMPIO DI UTILIZZO in App.jsx:
/*

import { fetchRealMarketCap, fetchMarketCapDexScreener } from './utils/solana';

// Nel componente App:
useEffect(() => {
  const updateMarketCap = async () => {
    const tokenAddress = 'YOUR_TOKEN_ADDRESS_HERE'; // Sostituisci!
    
    // Metodo 1: Jupiter
    const data = await fetchRealMarketCap(tokenAddress);
    
    // Metodo 2: DexScreener (più completo)
    // const data = await fetchMarketCapDexScreener(tokenAddress);
    
    if (data) {
      setMarketCap(data.marketCap);
    }
  };
  
  // Aggiorna ogni 10 secondi
  const interval = setInterval(updateMarketCap, 10000);
  updateMarketCap(); // Prima chiamata immediata
  
  return () => clearInterval(interval);
}, []);

*/

// 📊 BONUS: Fetch holders count
export async function fetchHoldersCount(tokenAddress) {
  try {
    const response = await fetch(
      `https://public-api.solscan.io/token/holders?tokenAddress=${tokenAddress}&limit=1`
    );
    
    const data = await response.json();
    return data.total || 0;
  } catch (error) {
    console.error('Error fetching holders:', error);
    return 0;
  }
}

// 🎁 AIRDROP UTILITIES

// Verifica se un wallet è elegibile per l'airdrop
export function checkAirdropEligibility(walletAddress, holdersList, minBalance) {
  const holder = holdersList.find(h => h.address === walletAddress);
  return holder && holder.balance >= minBalance;
}

// Calcola l'ammontare dell'airdrop in base al balance
export function calculateAirdropAmount(balance, totalAirdrop, totalBalance) {
  // Distribuzione proporzionale in base al balance
  return (balance / totalBalance) * totalAirdrop;
}

// ESEMPIO: Setup sistema airdrop
export const airdropConfig = {
  stages: [
    {
      stage: 1,
      marketCapTrigger: 15000,
      totalAirdrop: 50000, // Token da distribuire
      minHoldingRequired: 1000, // Min token per essere elegibile
      executed: false
    },
    {
      stage: 2,
      marketCapTrigger: 60000,
      totalAirdrop: 100000,
      minHoldingRequired: 1000,
      executed: false
    },
    {
      stage: 3,
      marketCapTrigger: 100000,
      totalAirdrop: 150000,
      minHoldingRequired: 5000,
      executed: false
    },
    {
      stage: 4,
      marketCapTrigger: 300000,
      totalAirdrop: 500000,
      minHoldingRequired: 10000,
      executed: false
    }
  ]
};

// Monitora e trigghera airdrop automaticamente
export async function monitorAndTriggerAirdrops(currentMarketCap, airdropConfig) {
  for (const airdrop of airdropConfig.stages) {
    if (!airdrop.executed && currentMarketCap >= airdrop.marketCapTrigger) {
      console.log(`🎁 Airdrop Stage ${airdrop.stage} triggered!`);
      
      // Qui implementeresti la logica per:
      // 1. Fetchare lista holders
      // 2. Filtrare per balance minimo
      // 3. Calcolare distribuzione
      // 4. Eseguire transazioni
      
      airdrop.executed = true;
      
      return {
        stage: airdrop.stage,
        triggered: true,
        totalAmount: airdrop.totalAirdrop,
        marketCap: currentMarketCap
      };
    }
  }
  
  return null;
}

// 🔐 WALLET CONNECTION (per future implementazioni)
export function detectSolanaWallet() {
  if (window.solana && window.solana.isPhantom) {
    return 'phantom';
  }
  if (window.solflare) {
    return 'solflare';
  }
  return null;
}

export async function connectWallet() {
  try {
    const walletType = detectSolanaWallet();
    
    if (!walletType) {
      alert('Please install Phantom wallet!');
      window.open('https://phantom.app/', '_blank');
      return null;
    }
    
    const wallet = window.solana;
    const response = await wallet.connect();
    
    return {
      publicKey: response.publicKey.toString(),
      connected: true,
      walletType: walletType
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    return null;
  }
}

// EXPORT DEFAULT
export default {
  fetchRealMarketCap,
  fetchMarketCapDexScreener,
  fetchHoldersCount,
  checkAirdropEligibility,
  calculateAirdropAmount,
  airdropConfig,
  monitorAndTriggerAirdrops,
  detectSolanaWallet,
  connectWallet
};
