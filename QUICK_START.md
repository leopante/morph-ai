# 🚀 QUICK START - 5 MINUTI

## 📥 ESTRAI I FILE

```bash
# Estrai l'archivio
tar -xzf morph-ai-complete.tar.gz

# O su Windows: click destro → Estrai tutto
```

---

## ⚡ COMANDI RAPIDI

### 1️⃣ TEST LOCALE (OPZIONALE)
```bash
cd morph-ai
npm install
npm run dev

# Apri: http://localhost:5173
# CTRL+C per fermare
```

### 2️⃣ CARICA SU GITHUB
```bash
# Prima volta? Configura:
git config --global user.name "TuoNome"
git config --global user.email "tua@email.com"

# Poi:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO-USERNAME/morph-ai.git
git branch -M main
git push -u origin main
```

### 3️⃣ DEPLOY SU VERCEL
```
1. Vai su vercel.com
2. Login con GitHub
3. Import repository "morph-ai"
4. Deploy (lascia tutto come sta)
5. FATTO! ✅
```

### 4️⃣ AGGIORNAMENTI FUTURI
```bash
# Dopo qualsiasi modifica:
git add .
git commit -m "Descrizione modifica"
git push

# Vercel aggiorna automaticamente!
```

---

## 🎨 PERSONALIZZAZIONI VELOCI

### Logo
```
Sostituisci: public/coin-logo.png
Con la tua immagine (512x512px)
```

### Colori
```javascript
// src/App.css - cerca e modifica:
background: linear-gradient(135deg, #TUO-COLORE1, #TUO-COLORE2);
```

### Market Cap Targets
```javascript
// src/App.jsx - linea ~14:
{ name: "Baby Lobster", marketCap: 0 },
{ name: "Teen Crab", marketCap: 15000 },    // ⬅️ Modifica qui
{ name: "Adult Lobster", marketCap: 60000 }, // ⬅️ E qui
// ...
```

### Token Address
```javascript
// src/utils/solana.js - sostituisci:
const TOKEN_ADDRESS = 'IL_TUO_TOKEN_ADDRESS';
```

---

## 🎁 AIRDROP VELOCE

```bash
# Setup (una volta sola)
solana-keygen new --outfile airdrop-wallet.json
solana config set --url https://api.mainnet-beta.solana.com
solana config set --keypair airdrop-wallet.json

# Invia SOL e token al wallet

# Configura
nano execute-airdrop.js
# → Sostituisci TOKEN_MINT

# Esegui
npm install @solana/web3.js @solana/spl-token node-fetch
node execute-airdrop.js
```

---

## 📁 STRUTTURA FILE

```
morph-ai/
├── src/
│   ├── App.jsx           👈 Logica principale
│   ├── App.css           👈 Stili & animazioni
│   └── utils/solana.js   👈 Integrazione blockchain
├── public/
│   └── coin-logo.png     👈 AGGIUNGI IL TUO LOGO
├── README.md             👈 Documentazione completa
├── DEPLOYMENT_GUIDE.md   👈 Guida visuale step-by-step
├── AIRDROP_GUIDE.md      👈 Tutto sugli airdrop
└── execute-airdrop.js    👈 Script pronto all'uso
```

---

## 🔗 LINK UTILI

```
Vercel:      https://vercel.com
GitHub:      https://github.com
Pump.fun:    https://pump.fun
Solana Docs: https://docs.solana.com
```

---

## ⚡ TL;DR - ULTRA VELOCE

```bash
1. Estrai file
2. cd morph-ai
3. Carica su GitHub
4. Import su Vercel
5. Deploy
6. PROFIT! 🚀
```

---

## 🆘 PROBLEMI?

**Leggi i file:**
- `README.md` - Overview completo
- `DEPLOYMENT_GUIDE.md` - Step by step con screenshot
- `AIRDROP_GUIDE.md` - Tutto sugli airdrop

**Ancora bloccato?**
- Controlla che Node.js sia installato
- Verifica che Git sia installato
- Riavvia il terminal
- Rileggi le guide con calma

---

**FATTO! Hai tutto il necessario! 🦞**

Leggi `DEPLOYMENT_GUIDE.md` per la guida completa visuale!
