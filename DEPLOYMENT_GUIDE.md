# 🚀 DEPLOYMENT VISUALE - PASSO PASSO

## 📱 IL TUO PERCORSO COMPLETO

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  STEP 1: CREARE TOKEN SU PUMP.FUN                          │
│  ↓                                                          │
│  STEP 2: CREARE IL SITO                                    │
│  ↓                                                          │
│  STEP 3: CARICARE SU GITHUB                                │
│  ↓                                                          │
│  STEP 4: DEPLOY SU VERCEL                                  │
│  ↓                                                          │
│  STEP 5: SETUP AIRDROP                                     │
│  ↓                                                          │
│  STEP 6: GO LIVE! 🎉                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## STEP 1: CREARE TOKEN SU PUMP.FUN 🪙

### 1.1 Vai su pump.fun
```
🌐 https://pump.fun
```

### 1.2 Connetti Wallet
- Clicca "Connect Wallet"
- Scegli Phantom (o il tuo wallet Solana)
- Approva connessione

### 1.3 Crea il Token
```
Nome: MORPH AI
Symbol: MORPH
Descrizione: The evolution-based memecoin. Watch our lobster 
             evolve and earn airdrops at each stage!
```

### 1.4 Carica l'Immagine
- Usa l'immagine della coin che hai caricato
- Dimensioni consigliate: 512x512px

### 1.5 Launch!
- Costo: ~$2 in SOL
- Clicca "Create Coin"
- Approva transazione

### 1.6 SALVA QUESTE INFO! 📝
```
Token Address: [COPIA E INCOLLA QUI]
Contract Link: https://solscan.io/token/[IL_TUO_ADDRESS]
Pump.fun Link: https://pump.fun/coin/[IL_TUO_ADDRESS]
```

---

## STEP 2: PREPARARE IL SITO 💻

### 2.1 Struttura File (GIÀ PRONTA!)
```
morph-ai/
├── src/
│   ├── App.jsx          ✅ Componente principale
│   ├── App.css          ✅ Animazioni & stili
│   ├── main.jsx         ✅ Entry point
│   ├── index.css        ✅ Base styles
│   └── utils/
│       └── solana.js    ✅ Integrazione blockchain
├── public/
│   └── coin-logo.png    ⚠️ AGGIUNGI LA TUA IMMAGINE
├── index.html           ✅ HTML template
├── package.json         ✅ Dependencies
├── vite.config.js       ✅ Build config
├── .gitignore           ✅ Git config
├── README.md            ✅ Documentazione
├── AIRDROP_GUIDE.md     ✅ Guida airdrop
└── execute-airdrop.js   ✅ Script airdrop
```

### 2.2 Aggiungi il Logo
1. Salva l'immagine della tua coin come `coin-logo.png`
2. Mettila nella cartella `public/`

### 2.3 Personalizza (OPZIONALE)
Apri `src/App.jsx` e cerca:
```javascript
// Linea ~14: Modifica gli stage se vuoi
const evolutionStages = [
  { name: "Baby Lobster", marketCap: 0, ... },
  // Modifica nomi, market cap targets, emoji...
];
```

---

## STEP 3: CARICARE SU GITHUB 📤

### 3.1 Installa Git
**Windows:**
```
https://git-scm.com/download/win
→ Scarica
→ Installa (next, next, next)
→ Apri "Git Bash"
```

**Mac:**
```bash
# Apri Terminal e digita:
git --version
# Se non installato, segui le istruzioni
```

### 3.2 Configura Git (SOLO PRIMA VOLTA)
```bash
git config --global user.name "TuoNome"
git config --global user.email "tua@email.com"
```

### 3.3 Vai nella Cartella del Progetto
```bash
# Windows (Git Bash):
cd C:/Users/TuoNome/Desktop/morph-ai

# Mac/Linux:
cd ~/Desktop/morph-ai
```

### 3.4 Inizializza Git
```bash
git init
git add .
git commit -m "🦞 Initial commit - MORPH AI website"
```

### 3.5 Crea Repository su GitHub
1. Vai su https://github.com
2. Clicca il "+" in alto a destra
3. "New repository"
4. Nome: `morph-ai`
5. ✅ Public
6. ❌ NON aggiungere README
7. "Create repository"

### 3.6 Collega e Carica
```bash
# Sostituisci TUO-USERNAME con il tuo username GitHub
git remote add origin https://github.com/TUO-USERNAME/morph-ai.git
git branch -M main
git push -u origin main
```

**Ti chiederà username e password:**
- Username: il tuo username GitHub
- Password: usa un Personal Access Token (NON la password)
  - Vai su GitHub → Settings → Developer settings → Personal access tokens
  - Genera nuovo token con permessi "repo"

---

## STEP 4: DEPLOY SU VERCEL 🚀

### 4.1 Vai su Vercel
```
🌐 https://vercel.com
```

### 4.2 Sign Up con GitHub
- Clicca "Continue with GitHub"
- Autorizza Vercel

### 4.3 Importa Progetto
```
1. Clicca "Add New..." → "Project"
2. Vedrai i tuoi repository GitHub
3. Trova "morph-ai"
4. Clicca "Import"
```

### 4.4 Configura Build
```
Framework Preset:     Vite       (auto-rilevato)
Root Directory:       ./         (lascia così)
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
```

### 4.5 DEPLOY!
```
Clicca il bottone rosso "Deploy"
⏱️ Attendi 1-2 minuti...
```

### 4.6 🎉 SITO LIVE!
```
Vercel ti darà un URL tipo:
https://morph-ai-abc123.vercel.app

✅ COPIA QUESTO LINK!
```

### 4.7 Dominio Personalizzato (OPZIONALE)
```
1. Su Vercel: Settings → Domains
2. Aggiungi il tuo dominio (es: morphai.xyz)
3. Configura DNS come indicato
4. Attendi propagazione (5-30 min)
```

---

## STEP 5: AGGIORNARE IL SITO CON TOKEN INFO 🔗

### 5.1 Apri src/App.jsx
Trova questa sezione (circa linea 25):
```javascript
// Simulate market cap changes (in production, fetch from blockchain)
useEffect(() => {
  const interval = setInterval(() => {
    setMarketCap(prev => {
      const increase = Math.random() * 5000;
      return Math.min(prev + increase, 350000);
    });
  }, 3000);
  return () => clearInterval(interval);
}, []);
```

### 5.2 Sostituisci con Market Cap Reale
```javascript
import { fetchMarketCapDexScreener } from './utils/solana';

useEffect(() => {
  const fetchRealData = async () => {
    const TOKEN_ADDRESS = 'IL_TUO_TOKEN_ADDRESS'; // ⚠️ Sostituisci!
    const data = await fetchMarketCapDexScreener(TOKEN_ADDRESS);
    if (data) {
      setMarketCap(data.marketCap);
    }
  };
  
  // Aggiorna ogni 30 secondi
  const interval = setInterval(fetchRealData, 30000);
  fetchRealData(); // Prima chiamata immediata
  
  return () => clearInterval(interval);
}, []);
```

### 5.3 Aggiungi Link Social
Trova il footer (circa linea 200):
```javascript
<div className="social-links">
  <a href="https://twitter.com/TUO_HANDLE" className="social-link">Twitter</a>
  <a href="https://t.me/TUO_GRUPPO" className="social-link">Telegram</a>
  <a href="https://discord.gg/TUO_SERVER" className="social-link">Discord</a>
</div>
```

### 5.4 Carica gli Aggiornamenti
```bash
git add .
git commit -m "✨ Added real token data"
git push
```

**Vercel aggiornerà automaticamente il sito in 1-2 minuti!** 🚀

---

## STEP 6: SETUP AIRDROP 🎁

### 6.1 Installa Solana CLI
**Windows:**
```powershell
# PowerShell come Amministratore
cmd /c "curl https://release.solana.com/v1.17.0/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-tmp\solana-install-init.exe --create-dirs"
C:\solana-install-tmp\solana-install-init.exe v1.17.0
```

**Mac/Linux:**
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
```

### 6.2 Crea Wallet per Airdrop
```bash
solana-keygen new --outfile airdrop-wallet.json
# ⚠️ SALVA LA SEED PHRASE IN UN POSTO SICURO!
```

### 6.3 Configura Network
```bash
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair airdrop-wallet.json
```

### 6.4 Invia SOL e Token al Wallet Airdrop
```
1. Apri Phantom wallet
2. Invia 0.1 SOL a: [address del wallet airdrop]
3. Invia i token MORPH per l'airdrop
```

### 6.5 Installa Dependencies Node.js
```bash
npm install @solana/web3.js @solana/spl-token node-fetch
```

### 6.6 Configura Script Airdrop
Apri `execute-airdrop.js` e modifica:
```javascript
const CONFIG = {
  TOKEN_MINT: 'IL_TUO_TOKEN_ADDRESS',  // ⚠️ Sostituisci!
  MIN_BALANCE: 1000,
  TOTAL_AIRDROP: 50000,
  // ... resto config
};
```

### 6.7 TEST su Devnet PRIMA!
```javascript
// In execute-airdrop.js, usa devnet:
CLUSTER_URL: 'https://api.devnet.solana.com',
```

Poi:
```bash
# Ottieni SOL devnet gratis
solana airdrop 1

# Esegui test
node execute-airdrop.js
```

### 6.8 ESEGUI SU MAINNET
```javascript
// Cambia a mainnet:
CLUSTER_URL: 'https://api.mainnet-beta.solana.com',
```

```bash
node execute-airdrop.js
```

---

## ✅ CHECKLIST FINALE

Prima del lancio pubblico:

```
[ ] Token creato su Pump.fun
[ ] Logo caricato nel sito
[ ] Sito deployato su Vercel
[ ] Market cap live collegato
[ ] Link social aggiunti
[ ] Testato su mobile
[ ] Wallet airdrop configurato
[ ] Script airdrop testato su devnet
[ ] Dominio personalizzato (opzionale)
[ ] Community Telegram/Discord creata
[ ] Tweet di lancio preparato
```

---

## 🆘 TROUBLESHOOTING COMUNI

### "git not recognized"
```
→ Installa Git da git-scm.com
→ Riapri terminal dopo installazione
```

### "npm not found"
```
→ Installa Node.js da nodejs.org
→ Riavvia computer
```

### "Build failed" su Vercel
```
→ Verifica che package.json sia corretto
→ Controlla i logs su Vercel dashboard
→ Prova a re-deploy
```

### "Can't fetch market cap"
```
→ Verifica che il token sia tradato
→ Attendi qualche ora dopo il lancio
→ Usa la simulazione intanto
```

### "Insufficient SOL"
```
→ Invia più SOL al wallet airdrop
→ Servono ~0.1 SOL per sicurezza
```

---

## 📊 TIMELINE REALISTICA

```
Giorno 1: Setup (2-3 ore)
├─ Creare token           (30 min)
├─ Deploy sito            (1 ora)
├─ Setup airdrop          (1 ora)
└─ Test tutto             (30 min)

Giorno 2-7: Pre-Launch
├─ Marketing              (continuativo)
├─ Community building     (continuativo)
└─ Hype generation        (continuativo)

Giorno 8: LAUNCH! 🚀
├─ Annuncio pubblico
├─ Monitor market cap
└─ Engage community

Ongoing:
├─ Airdrop automatici quando si raggiungono i milestone
├─ Aggiornamenti sito
└─ Community management
```

---

## 💡 PRO TIPS

1. **Testa TUTTO su devnet prima di mainnet**
2. **Fai backup di tutti i wallet e seed phrases**
3. **Usa analytics per tracciare visite** (Vercel Analytics gratis)
4. **Monitora gas prices** prima di fare airdrop grandi
5. **Comunica SEMPRE prima degli airdrop** (Twitter, Telegram)
6. **Screenshot tutto** per marketing (txs, milestone, etc)
7. **Rispondi velocemente** alla community
8. **Sii trasparente** su tutto

---

## 🎯 AFTER LAUNCH

### Marketing
- [ ] Tweet con link al sito
- [ ] Post su r/CryptoMoonShots
- [ ] Post su Telegram groups
- [ ] Contest e giveaway
- [ ] Collaborate con altri progetti

### Grow
- [ ] Lista su CoinGecko (dopo volume sufficiente)
- [ ] Lista su CoinMarketCap
- [ ] Partnerships
- [ ] More utilità per il token

---

**SEI PRONTO! GO MAKE IT HAPPEN! 🚀🦞**

*Remember: This is a meme. Have fun, be creative, don't promise unrealistic things!*
