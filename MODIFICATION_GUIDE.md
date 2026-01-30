# 🔧 GUIDA MODIFICHE STEP-BY-STEP

## 📋 INDICE
1. Come Aggiungere Immagini PNG Custom
2. Come Modificare Colori
3. Come Cambiare Testi
4. Come Aggiungere Clawd-bot
5. Come Applicare le Modifiche
6. Troubleshooting

---

# 1️⃣ AGGIUNGERE IMMAGINI PNG CUSTOM

## Step 1.1: Preparare le Immagini

**Cosa ti serve:**
- 1 logo principale (512x512px) → `coin-logo.png`
- 5 immagini evolutive (400x400px) → per ogni stadio

**Formato:**
- PNG con sfondo trasparente
- Alta qualità
- Formato quadrato

---

## Step 1.2: Posizionare i File

```
morph-ai/
└── public/
    ├── coin-logo.png          ← Sostituisci questo
    └── images/                ← Crea questa cartella
        ├── baby-lobster.png   ← Aggiungi
        ├── teen-crab.png      ← Aggiungi
        ├── adult-lobster.png  ← Aggiungi
        ├── mega-lobster.png   ← Aggiungi
        └── cosmic-lobster.png ← Aggiungi
```

**Come fare:**
1. Apri la cartella `morph-ai/public/`
2. Sostituisci `coin-logo.png` con la tua immagine
3. Crea cartella `images/`
4. Trascina dentro le 5 immagini evolutive

---

## Step 1.3: Aggiornare il Codice

Le modifiche sono **GIÀ FATTE** nei file aggiornati! 

Se parti dal vecchio codice, devi:

**File: `src/App.jsx`**

Trova l'array `evolutionStages` (circa linea 14) e aggiungi `image:` ad ogni stadio:

```javascript
const evolutionStages = [
  {
    name: "Baby Lobster",
    marketCap: 0,
    color: "#ff6b9d",
    description: "Just hatched! A tiny crustacean ready to conquer the seas",
    emoji: "🦐",
    image: "/images/baby-lobster.png",  // ← AGGIUNGI QUESTA RIGA
    size: "small"
  },
  // ... ripeti per tutti gli altri stadi
];
```

Trova la sezione mascotte (circa linea 180) e sostituisci:

```javascript
// VECCHIO:
<span className="mascot-emoji">{currentEvolution.emoji}</span>

// NUOVO:
{currentEvolution.image ? (
  <img 
    src={currentEvolution.image} 
    alt={currentEvolution.name}
    className="mascot-image"
  />
) : (
  <span className="mascot-emoji">{currentEvolution.emoji}</span>
)}
```

**File: `src/App.css`**

Aggiungi dopo `.mascot-emoji` (circa linea 260):

```css
.mascot-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
  transition: all 0.5s;
  animation: bounce 2s ease-in-out infinite;
}

.mascot.small .mascot-image { width: 180px; height: 180px; }
.mascot.medium .mascot-image { width: 220px; height: 220px; }
.mascot.large .mascot-image { width: 280px; height: 280px; }
.mascot.xlarge .mascot-image { width: 340px; height: 340px; }
.mascot.cosmic .mascot-image { 
  width: 400px; 
  height: 400px;
  animation: bounce 2s ease-in-out infinite, cosmicGlow 2s ease-in-out infinite;
}
```

---

# 2️⃣ MODIFICARE COLORI

## Dove Trovare i Colori

**File: `src/App.css`**

### Background Gradient
```css
/* Linea ~20 */
.bg-gradient {
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 0, 100, 0.1) 0%, transparent 50%),
    /* ↑ Cambia questi RGB */
}
```

### Colori Evolutivi
```javascript
// File: src/App.jsx - linea ~14
const evolutionStages = [
  {
    name: "Baby Lobster",
    color: "#ff6b9d",  // ← Cambia questo
  },
  // ...
];
```

### Bottoni
```css
/* Linea ~140 */
.connect-wallet-btn {
  background: linear-gradient(135deg, #e63946, #ff006e);
  /* ↑ Cambia questi colori */
}
```

---

## Quick Color Schemes

### Scheme 1: Blue Ocean
```javascript
Baby: "#4cc9f0"
Teen: "#4361ee"
Adult: "#3a0ca3"
Mega: "#7209b7"
Cosmic: "#f72585"
```

### Scheme 2: Green Money
```javascript
Baby: "#95d5b2"
Teen: "#52b788"
Adult: "#2d6a4f"
Mega: "#1b4332"
Cosmic: "#ffd60a"
```

### Scheme 3: Purple Mystic
```javascript
Baby: "#c8b6ff"
Teen: "#9d4edd"
Adult: "#7209b7"
Mega: "#5a189a"
Cosmic: "#ff006e"
```

---

# 3️⃣ MODIFICARE TESTI

## Nome del Progetto

**File: `src/App.jsx` - linea ~160**
```jsx
<h1 className="title">
  <span className="glitch" data-text="MORPH AI">MORPH AI</span>
  {/* ↑ Cambia entrambi */}
</h1>
```

**File: `index.html` - linea ~8**
```html
<title>MORPH AI - Evolve & Adapt 🦞</title>
<!-- ↑ Cambia questo -->
```

---

## Nomi degli Stadi

**File: `src/App.jsx` - linea ~14**
```javascript
const evolutionStages = [
  {
    name: "Baby Lobster",        // ← Nome stadio
    description: "Just hatched!", // ← Descrizione
  },
];
```

---

## Link Social

**File: `src/App.jsx` - circa linea 350**
```jsx
<div className="social-links">
  <a href="https://twitter.com/TWITTERHANDLE" className="social-link">Twitter</a>
  <a href="https://t.me/TELEGRAMGROUP" className="social-link">Telegram</a>
  <a href="https://discord.gg/DISCORDLINK" className="social-link">Discord</a>
</div>
```

---

## Market Cap Targets

**File: `src/App.jsx` - linea ~14**
```javascript
{
  name: "Teen Crab",
  marketCap: 15000,  // ← Cambia questo (in dollari)
},
```

---

# 4️⃣ AGGIUNGERE CLAWD-BOT

## Metodo Completo (Con Claude API)

### Step 1: Crea Componente
Crea file: `src/components/ClawdBot.jsx`
(Copia tutto il codice da `CLAWD_BOT_GUIDE.md`)

### Step 2: Crea CSS
Crea file: `src/components/ClawdBot.css`
(Copia tutto il CSS da `CLAWD_BOT_GUIDE.md`)

### Step 3: Integra in App.jsx
In cima al file:
```javascript
import ClawdBot from './components/ClawdBot';
```

Prima della chiusura finale (ultima riga prima di `</div>`):
```jsx
<ClawdBot 
  tokenData={{
    marketCap: marketCap,
    nextEvolution: nextEvolution?.name
  }}
  currentStage={evolutionStages[currentStage]}
/>
```

### Step 4: Setup API Key

**IMPORTANTE:** Per sicurezza, usa backend proxy!

Crea file: `api/claude.js`
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

Poi su **Vercel Dashboard**:
1. Vai al tuo progetto
2. Settings → Environment Variables
3. Aggiungi: `ANTHROPIC_API_KEY` = `sk-ant-api03-xxxxx`
4. Save

---

## Metodo Semplice (Senza API - Gratis)

Crea solo risposte predefinite, senza chiamate API.

In `ClawdBot.jsx`, sostituisci la funzione `sendMessage`:

```javascript
const getBotResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  const responses = {
    'airdrop': 'Airdrops happen at each evolution! Check the roadmap! 🎁',
    'buy': 'Buy MORPH on pump.fun! Link in bio 🦞',
    'price': \`Current market cap: $\${tokenData.marketCap.toLocaleString()}! 📊\`,
    'team': 'We are a community-driven project! Join our Telegram! 🌊',
    'roadmap': 'Check our evolution milestones above! Next: ' + tokenData.nextEvolution,
  };
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (input.includes(keyword)) {
      return response;
    }
  }
  
  return "I'm not sure! Try asking about: airdrops, price, roadmap, or team! 🦞";
};

const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = input.trim();
  setInput('');
  
  setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
  setIsLoading(true);

  // Simula delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const botResponse = getBotResponse(userMessage);
  
  setMessages(prev => [...prev, { 
    role: 'assistant', 
    content: botResponse 
  }]);

  setIsLoading(false);
};
```

---

# 5️⃣ COME APPLICARE LE MODIFICHE

## Se Hai Già Caricato su GitHub

```bash
# 1. Apri terminal nella cartella morph-ai

# 2. Aggiungi le modifiche
git add .

# 3. Commit con messaggio
git commit -m "✨ Updated images and added Clawd-bot"

# 4. Push su GitHub
git push

# 5. FATTO! Vercel rebuilda automaticamente in 1-2 minuti
```

---

## Se NON Hai Ancora Caricato

```bash
# 1. Apri terminal nella cartella morph-ai

# 2. Inizializza Git
git init

# 3. Aggiungi tutti i file
git add .

# 4. Primo commit
git commit -m "Initial commit with custom images and Clawd-bot"

# 5. Collega a GitHub (sostituisci USERNAME)
git remote add origin https://github.com/USERNAME/morph-ai.git

# 6. Push
git branch -M main
git push -u origin main

# 7. Vai su Vercel e importa il repository
```

---

## Per Testare Localmente PRIMA di Deploy

```bash
# 1. Installa dependencies (solo prima volta)
npm install

# 2. Avvia server di sviluppo
npm run dev

# 3. Apri browser su: http://localhost:5173

# 4. Testa tutto
# 5. CTRL+C per fermare

# 6. Se ok, fai commit e push
```

---

# 6️⃣ TROUBLESHOOTING

## Immagini Non Appaiono

**Problema:** Immagini nella cartella sbagliata
**Soluzione:** Verifica che siano in `public/images/` (NON `src/images/`)

**Problema:** Path sbagliato nel codice
**Soluzione:** Usa `/images/nome.png` (con `/` iniziale)

**Problema:** Nome file sbagliato
**Soluzione:** Verifica che i nomi nel codice corrispondano ai nomi file esatti

---

## Chatbot Non Funziona

**Problema:** API key mancante
**Soluzione:** Aggiungi env variable su Vercel

**Problema:** Errore 401/403
**Soluzione:** API key non valida, generane una nuova

**Problema:** Bot non risponde
**Soluzione:** Controlla console browser (F12) per errori

---

## Modifiche Non Appaiono Online

**Problema:** Non hai fatto push
**Soluzione:** `git push` per aggiornare GitHub

**Problema:** Vercel non ha rebuildato
**Soluzione:** Vai su Vercel → Deployments → Redeploy

**Problema:** Cache browser
**Soluzione:** CTRL+F5 per hard refresh

---

## Errori di Build su Vercel

**Problema:** Sintassi JavaScript sbagliata
**Soluzione:** Controlla logs su Vercel, correggi errori

**Problema:** Import mancante
**Soluzione:** Verifica che tutti i `import` siano corretti

**Problema:** File mancante
**Soluzione:** Controlla che tutti i file siano stati caricati su GitHub

---

# ✅ CHECKLIST FINALE

Prima di fare deploy finale:

```
[ ] Logo sostituito in public/coin-logo.png
[ ] 5 immagini evolutive in public/images/
[ ] Codice aggiornato in App.jsx per usare le immagini
[ ] CSS aggiornato con stili .mascot-image
[ ] Colori personalizzati (se desiderato)
[ ] Testi modificati (nome progetto, descrizioni, ecc.)
[ ] Link social aggiunti
[ ] Clawd-bot integrato (se desiderato)
[ ] Testato localmente con npm run dev
[ ] Commit fatto
[ ] Push su GitHub
[ ] Deploy su Vercel completato
[ ] Testato su mobile e desktop
[ ] Cache svuotata e sito verificato online
```

---

# 🎯 WORKFLOW TIPO

## Modifica Giornaliera Standard

```bash
# 1. Modifica i file (VS Code, Notepad++, etc.)

# 2. Salva tutto

# 3. Apri terminal
cd /path/to/morph-ai

# 4. Test locale (opzionale)
npm run dev
# Verifica su localhost:5173
# CTRL+C per fermare

# 5. Commit e push
git add .
git commit -m "Descrizione modifiche"
git push

# 6. Attendi 1-2 minuti
# 7. Vai sul sito e verifica
# 8. Se serve, CTRL+F5 per refresh cache
```

---

# 💡 PRO TIPS

1. **Backup Prima di Modificare**
   ```bash
   cp -r morph-ai morph-ai-backup
   ```

2. **Test Sempre Localmente**
   - Evita errori in produzione
   - Più veloce per iterare

3. **Commit Frequenti**
   - Commit piccoli e specifici
   - Più facile fare rollback se serve

4. **Usa Branch per Grosse Modifiche**
   ```bash
   git checkout -b nuova-feature
   # Fai modifiche
   git commit -am "Feature completa"
   git checkout main
   git merge nuova-feature
   ```

5. **Controlla Sempre i Logs**
   - Vercel Dashboard → Deployments → Logs
   - Aiuta a debuggare errori

---

**SEI PRONTO! Vai a modificare il tuo sito! 🚀**

Per qualsiasi dubbio, rileggi questa guida con calma!
