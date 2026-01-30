# 🦞 MORPH AI - Evolve & Adapt

Una memecoin rivoluzionaria su Solana che si evolve con il market cap! Ogni evoluzione sblocca un airdrop per i holder.

## 🎨 Features

- ✨ **Animazioni Dinamiche**: Mascotte animata in stile Pokemon con effetti 3D
- 🎭 **5 Stadi Evolutivi**: Da Baby Lobster a Cosmic Lobster
- 📊 **Progress Bar Live**: Traccia l'evoluzione in tempo reale
- 🎁 **Sistema di Airdrop**: Rewards automatici ad ogni evoluzione
- 🌊 **Design Futuristico**: Particelle animate, glassmorphism, effetti glow
- 📱 **Responsive**: Perfetto su mobile e desktop

## 🚀 GUIDA COMPLETA AL DEPLOYMENT

### **STEP 1: Creare Account GitHub**

1. Vai su [github.com](https://github.com)
2. Clicca su "Sign up"
3. Crea il tuo account gratuito

---

### **STEP 2: Installare Git sul Computer**

**Windows:**
1. Scarica Git da [git-scm.com](https://git-scm.com/download/win)
2. Installa con le opzioni predefinite
3. Apri "Git Bash" (cerca nel menu Start)

**Mac:**
1. Apri Terminal
2. Digita: `git --version`
3. Se non installato, segui le istruzioni che appaiono

**Linux:**
```bash
sudo apt-get install git
```

---

### **STEP 3: Caricare il Progetto su GitHub**

1. **Apri Git Bash / Terminal** nella cartella del progetto

2. **Configura Git** (solo la prima volta):
```bash
git config --global user.name "TuoNome"
git config --global user.email "tua@email.com"
```

3. **Inizializza il repository**:
```bash
git init
git add .
git commit -m "Initial commit - MORPH AI website"
```

4. **Vai su GitHub** e crea un nuovo repository:
   - Clicca sul "+" in alto a destra
   - Seleziona "New repository"
   - Nome: `morph-ai` (o quello che vuoi)
   - Lascia **PUBLIC**
   - NON aggiungere README, .gitignore o license
   - Clicca "Create repository"

5. **Collega e carica**:
```bash
git remote add origin https://github.com/TUO-USERNAME/morph-ai.git
git branch -M main
git push -u origin main
```

*(Sostituisci `TUO-USERNAME` con il tuo username GitHub)*

---

### **STEP 4: Deploy su Vercel (GRATIS!)**

1. **Vai su [vercel.com](https://vercel.com)**

2. **Registrati con GitHub** (clicca "Continue with GitHub")

3. **Importa il progetto**:
   - Clicca "Add New..." → "Project"
   - Vedrai i tuoi repository GitHub
   - Clicca "Import" sul repository `morph-ai`

4. **Configura il deploy**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (lascia così)
   - **Build Command**: `npm run build` (già impostato)
   - **Output Directory**: `dist` (già impostato)
   - Clicca "Deploy"

5. **FATTO! 🎉**
   - Vercel compilerà il sito (ci vogliono 1-2 minuti)
   - Ti darà un link tipo: `https://morph-ai-xxx.vercel.app`
   - Il sito è LIVE!

---

### **STEP 5: Aggiungere Dominio Personalizzato (OPZIONALE)**

1. **Compra un dominio**:
   - [Namecheap](https://www.namecheap.com) (~$10/anno)
   - [Google Domains](https://domains.google)
   - Cerca qualcosa tipo: `morphai.xyz`, `morphcoin.io`

2. **Su Vercel**:
   - Vai su Settings → Domains
   - Aggiungi il tuo dominio
   - Segui le istruzioni per configurare i DNS

---

## 🔄 Come AGGIORNARE il Sito

Ogni volta che fai modifiche:

```bash
git add .
git commit -m "Descrizione modifiche"
git push
```

**Vercel aggiornerà automaticamente il sito in 1-2 minuti!** 🚀

---

## ⚙️ Personalizzazione

### Modificare i Colori
Apri `src/App.css` e cambia i gradienti:
```css
background: linear-gradient(135deg, #TUO-COLORE1, #TUO-COLORE2);
```

### Modificare Market Cap Targets
Apri `src/App.jsx` e trova l'array `evolutionStages`:
```javascript
const evolutionStages = [
  { name: "Baby Lobster", marketCap: 0, ... },
  { name: "Teen Crab", marketCap: 15000, ... },
  // Modifica i valori marketCap qui
];
```

### Collegare Market Cap Reale
Nell'`useEffect` che simula il market cap, sostituisci con una chiamata API:
```javascript
// Esempio con Jupiter API per Solana
const fetchMarketCap = async () => {
  const response = await fetch('https://api.jup.ag/price/v2?ids=TUO-TOKEN-ADDRESS');
  const data = await response.json();
  setMarketCap(data.data['TUO-TOKEN-ADDRESS'].price * totalSupply);
};
```

---

## 🎁 Sistema di Airdrop

### Come Fare un Airdrop su Solana

**Metodo 1: Manuale (Semplice)**
1. Installa Solana CLI
2. Crea lista wallet (CSV con indirizzi e quantità)
3. Usa script per distribuire token

**Metodo 2: Automatico**
1. Crea script Node.js
2. Monitora market cap tramite API
3. Quando raggiunge soglia → esegui airdrop automatico

**Costi:**
- ~0.000005 SOL per transazione
- 1000 wallet = ~$1

---

## 📝 Checklist Pre-Launch

- [ ] Crea token su Pump.fun
- [ ] Carica logo aragosta
- [ ] Sostituisci `coin-logo.png` nel progetto
- [ ] Aggiorna Market Cap targets
- [ ] Aggiungi link social (Twitter, Telegram)
- [ ] Collega wallet contract address
- [ ] Testa su mobile e desktop
- [ ] Deploy su Vercel
- [ ] Compra dominio (opzionale)

---

## 🆘 Troubleshooting

**"git not found"**
→ Installa Git (vedi Step 2)

**"Permission denied (publickey)"**
→ Usa HTTPS invece di SSH: `https://github.com/user/repo.git`

**"Build failed" su Vercel**
→ Verifica che `package.json` sia corretto

**Sito lento**
→ Riduci numero particelle in `App.jsx` (cambia `[...Array(20)]` a `[...Array(10)]`)

---

## 💡 Tips

- **Testing locale**: `npm install && npm run dev` (localhost:5173)
- **Aggiornamenti istantanei**: Ogni push su GitHub → Vercel rebuilda automaticamente
- **Performance**: Vercel usa CDN globale = sito velocissimo ovunque
- **Analytics**: Aggiungi Vercel Analytics gratis nel dashboard

---

## 🌟 Prossimi Passi

1. Deploy su Vercel ✅
2. Crea token su Pump.fun
3. Integra con Solana wallet (Phantom)
4. Aggiungi API per market cap live
5. Setup sistema airdrop automatico
6. Marketing su Twitter/Telegram

---

## 📞 Supporto

Se hai problemi:
1. Leggi attentamente gli errori
2. Cerca su Google l'errore specifico
3. Vercel ha documentazione ottima: [vercel.com/docs](https://vercel.com/docs)

---

**Buona fortuna con MORPH AI! 🚀🦞**

*Made with ❤️ for the meme economy*
