# 🤖 INTEGRAZIONE CLAWD-BOT (Claude AI Chatbot)

## 📋 COSA FAREMO

Integreremo un chatbot AI powered by Claude direttamente nel sito MORPH AI per:
- ✅ Rispondere a domande sul progetto
- ✅ Spiegare gli airdrop
- ✅ Dare info sul market cap
- ✅ Assistere gli utenti
- ✅ Engagement interattivo

---

## 🎯 OPZIONE 1: CHATBOT SEMPLICE (CONSIGLIATO)

Usiamo l'API di Claude per creare un chatbot custom integrato.

### Step 1: Ottenere API Key di Anthropic

1. Vai su: https://console.anthropic.com
2. Crea account / Login
3. Vai su "API Keys"
4. Clicca "Create Key"
5. **COPIA E SALVA** la chiave (tipo: `sk-ant-api03-...`)
6. Crediti gratis: $5 per iniziare

**IMPORTANTE:** Ogni richiesta costa ~$0.001-0.003 (molto economico!)

---

### Step 2: Creare il Componente Chatbot

Crea file `src/components/ClawdBot.jsx`:

```jsx
import { useState, useRef, useEffect } from 'react';
import './ClawdBot.css';

function ClawdBot({ tokenData, currentStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🦞 Hey! I\'m Clawd, your MORPH AI assistant! Ask me anything about the project, airdrops, or market cap!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Aggiungi messaggio utente
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Chiama API di Claude
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'LA_TUA_API_KEY_QUI', // ⚠️ SOSTITUISCI!
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: \`You are Clawd, the friendly assistant for MORPH AI memecoin. 
              
Current project info:
- Current Stage: \${currentStage?.name || 'Baby Lobster'}
- Market Cap: $\${tokenData?.marketCap?.toLocaleString() || '0'}
- Next Evolution: \${tokenData?.nextEvolution || 'N/A'}

Answer questions about MORPH AI, airdrops, tokenomics, and help users.
Be friendly, enthusiastic, and use lobster/crab emojis occasionally!

User question: \${userMessage}\`
            }
          ]
        })
      });

      const data = await response.json();
      const botResponse = data.content[0].text;

      // Aggiungi risposta bot
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: botResponse 
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Oops! Something went wrong. Try again!' 
      }]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Domande suggerite
  const quickQuestions = [
    "How do airdrops work?",
    "What's the next evolution?",
    "How can I buy MORPH?",
    "Tell me about tokenomics"
  ];

  return (
    <>
      {/* Bot Toggle Button */}
      <button 
        className={\`clawd-bot-toggle \${isOpen ? 'open' : ''}\`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '🦞'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="clawd-bot-window">
          {/* Header */}
          <div className="clawd-bot-header">
            <div className="clawd-bot-avatar">🦞</div>
            <div>
              <h3>Clawd Bot</h3>
              <p className="status">
                <span className="status-dot"></span>
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="clawd-bot-messages">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={\`message \${msg.role}\`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">🦞</div>
                )}
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-avatar">🦞</div>
                <div className="message-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="quick-questions">
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  className="quick-question-btn"
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(), 100);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="clawd-bot-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Clawd anything..."
              rows="1"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ClawdBot;
```

---

### Step 3: CSS per il Chatbot

Crea file `src/components/ClawdBot.css`:

```css
/* Toggle Button */
.clawd-bot-toggle {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946, #ff006e);
  border: none;
  font-size: 35px;
  cursor: pointer;
  box-shadow: 0 5px 30px rgba(230, 57, 70, 0.4);
  transition: all 0.3s;
  z-index: 1000;
  animation: pulse-btn 2s infinite;
}

.clawd-bot-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 40px rgba(230, 57, 70, 0.6);
}

.clawd-bot-toggle.open {
  background: #333;
  font-size: 25px;
  animation: none;
}

@keyframes pulse-btn {
  0%, 100% { box-shadow: 0 5px 30px rgba(230, 57, 70, 0.4); }
  50% { box-shadow: 0 5px 40px rgba(230, 57, 70, 0.7); }
}

/* Chat Window */
.clawd-bot-window {
  position: fixed;
  bottom: 120px;
  right: 30px;
  width: 400px;
  height: 600px;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.clawd-bot-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  background: linear-gradient(135deg, rgba(230, 57, 70, 0.1), rgba(255, 0, 110, 0.1));
}

.clawd-bot-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946, #ff006e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
}

.clawd-bot-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff88;
  border-radius: 50%;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Messages */
.clawd-bot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.clawd-bot-messages::-webkit-scrollbar {
  width: 6px;
}

.clawd-bot-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.clawd-bot-messages::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.message {
  display: flex;
  gap: 10px;
  animation: messageIn 0.3s ease-out;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946, #ff006e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 15px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.assistant .message-bubble {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message.user .message-bubble {
  background: linear-gradient(135deg, #e63946, #ff006e);
  margin-left: auto;
}

/* Typing Indicator */
.typing {
  display: flex;
  gap: 5px;
  padding: 15px;
}

.typing span {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Quick Questions */
.quick-questions {
  padding: 0 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-question-btn {
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.quick-question-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #e63946;
}

/* Input */
.clawd-bot-input {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
}

.clawd-bot-input textarea {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  color: #fff;
  font-size: 0.95rem;
  resize: none;
  font-family: inherit;
  max-height: 100px;
}

.clawd-bot-input textarea:focus {
  outline: none;
  border-color: #e63946;
}

.clawd-bot-input button {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e63946, #ff006e);
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.clawd-bot-input button:hover:not(:disabled) {
  transform: scale(1.05);
}

.clawd-bot-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .clawd-bot-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 180px);
    right: 20px;
    bottom: 100px;
  }
  
  .clawd-bot-toggle {
    right: 20px;
    bottom: 20px;
  }
}
```

---

### Step 4: Integrare nel Sito

Modifica `src/App.jsx`:

```jsx
// In cima al file, aggiungi:
import ClawdBot from './components/ClawdBot';

// Dentro il return, prima di </div> finale, aggiungi:
<ClawdBot 
  tokenData={{
    marketCap: marketCap,
    nextEvolution: nextEvolution?.name
  }}
  currentStage={evolutionStages[currentStage]}
/>
```

---

### Step 5: SICUREZZA - Nascondere API Key

**IMPORTANTE:** NON mettere mai l'API key direttamente nel frontend!

Usa un backend proxy. Crea `api/claude.js` (Vercel Serverless):

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
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Salva in Vercel Env Vars
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}
```

Poi in `ClawdBot.jsx`, cambia la chiamata:

```javascript
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [...]
  })
});
```

E aggiungi l'API key nelle **Environment Variables di Vercel**:
1. Dashboard Vercel → Progetto → Settings → Environment Variables
2. Aggiungi: `ANTHROPIC_API_KEY` = `sk-ant-api03-...`

---

## 🎯 OPZIONE 2: CHATBOT STATICO (Gratis, Senza API)

Se non vuoi usare l'API, crea un bot con risposte predefinite:

```jsx
const responses = {
  'airdrop': 'Airdrops happen automatically when we reach each evolution milestone! 🎁',
  'buy': 'You can buy MORPH on pump.fun! Check the link in our bio 🦞',
  'marketcap': \`Current market cap is $\${marketCap.toLocaleString()}! 📊\`,
  // ...altre risposte
};

const getBotResponse = (userInput) => {
  const input = userInput.toLowerCase();
  for (const [keyword, response] of Object.entries(responses)) {
    if (input.includes(keyword)) {
      return response;
    }
  }
  return "I'm not sure about that! Check our docs or ask in Telegram! 🦞";
};
```

---

## 📊 COSTI STIMATI

### Con Claude API:
- Primo messaggio: ~$0.003
- 1000 conversazioni: ~$3
- **Molto economico!**

### Alternative Gratuite:
- Bot statico con risposte predefinite
- Integrare ChatGPT free tier (più limitato)

---

## 🚀 DEPLOY

Dopo aver fatto le modifiche:

```bash
git add .
git commit -m "✨ Added Clawd chatbot"
git push
```

Vercel rebuilda automaticamente! ✅

---

## 🎨 PERSONALIZZAZIONI

### Cambiare Colori Bot
In `ClawdBot.css`, cerca:
```css
background: linear-gradient(135deg, #e63946, #ff006e);
```

### Cambiare Avatar
Sostituisci `🦞` con un'immagine:
```jsx
<img src="/images/clawd-avatar.png" alt="Clawd" />
```

### Aggiungere Knowledge Base
Nel prompt del bot, aggiungi più info:
```javascript
\`You are Clawd. Here's what you know:
- Token Address: XYZ123
- Total Supply: 1B tokens
- Airdrops: At $15k, $60k, $100k, $300k
- ...
\`
```

---

## ✅ CHECKLIST

- [ ] API Key ottenuta
- [ ] Componente ClawdBot creato
- [ ] CSS aggiunto
- [ ] Integrato in App.jsx
- [ ] Backend proxy creato (per sicurezza)
- [ ] Env vars configurate su Vercel
- [ ] Testato localmente
- [ ] Deploy su Vercel
- [ ] Bot funzionante! 🎉

---

**Il tuo Clawd Bot è pronto! 🦞🤖**
