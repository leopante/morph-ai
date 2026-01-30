import { useState, useRef, useEffect } from 'react';
import './ClawdBot.css';

function ClawdBot({ tokenData, currentStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🦞 Hey! I\'m Clawd, your MORPH AI assistant! Ask me anything about the project, airdrops, or evolution milestones!'
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

  // Risposte predefinite intelligenti
  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    const responses = {
      'airdrop': `🎁 Airdrops happen automatically when we reach each evolution milestone!\n\nMilestones:\n• $15K - Teen Crab evolution\n• $60K - Adult Lobster evolution\n• $100K - Mega Lobster evolution\n• $300K - Cosmic Lobster evolution\n\nHold MORPH to be eligible!`,
      
      'buy': `💰 You can buy MORPH on pump.fun!\n\nSteps:\n1. Connect your Solana wallet\n2. Search for MORPH AI\n3. Swap SOL for MORPH\n4. Join the evolution! 🦞`,
      
      'price': `📊 Current Stats:\n• Market Cap: $${tokenData?.marketCap?.toLocaleString() || '0'}\n• Current Stage: ${currentStage?.name || 'Baby Lobster'}\n• Next Evolution: ${tokenData?.nextEvolution || 'N/A'}\n\nWatch the evolution progress live!`,
      
      'market': `📊 Current Stats:\n• Market Cap: $${tokenData?.marketCap?.toLocaleString() || '0'}\n• Current Stage: ${currentStage?.name || 'Baby Lobster'}\n• Next Evolution: ${tokenData?.nextEvolution || 'N/A'}`,
      
      'team': `🌊 MORPH AI is a community-driven memecoin!\n\nJoin our community:\n• Twitter for updates\n• Telegram for discussions\n• Discord for deeper engagement\n\nTogether we evolve! 🦞`,
      
      'roadmap': `🗺️ Evolution Roadmap:\n\n🦐 Baby Lobster - $0\n└─ Just hatched!\n\n🦀 Teen Crab - $15K\n└─ First evolution + Airdrop\n\n🦞 Adult Lobster - $60K\n└─ Matured + Airdrop\n\n🐉 Mega Lobster - $100K\n└─ Legendary + Airdrop\n\n🚀 Cosmic Lobster - $300K\n└─ MOONSHOT + Airdrop`,
      
      'evolution': `🔄 Current Evolution Status:\n\nStage: ${currentStage?.name || 'Baby Lobster'}\nMarket Cap: $${tokenData?.marketCap?.toLocaleString() || '0'}\nNext Target: ${tokenData?.nextEvolution || 'Completed'}\n\nWatch the progress bar to see how close we are!`,
      
      'how': `🎮 How MORPH AI Works:\n\n1. Buy MORPH tokens\n2. Hold them in your wallet\n3. Watch the market cap grow\n4. Lobster evolves at milestones\n5. Receive airdrops at each evolution!\n\nIt's that simple! 🦞`,
      
      'tokenomics': `💎 Tokenomics:\n\n• Fair launch on pump.fun\n• Community-driven\n• Airdrops at evolution milestones\n• No team tokens\n• LP burned\n\nPure memecoin economics! 🚀`,
      
      'hello': `👋 Hey there! I'm Clawd, your MORPH AI guide!\n\nI can help you with:\n• Airdrops info\n• How to buy\n• Current price & stats\n• Roadmap & evolution\n• Tokenomics\n\nWhat would you like to know? 🦞`,
      
      'hi': `👋 Hey! What can I help you with today?\n\nTry asking about:\n• "How do airdrops work?"\n• "What's the current price?"\n• "Show me the roadmap"\n• "How to buy MORPH?"`,
      
      'help': `🆘 I can answer questions about:\n\n💰 Price & Market Cap\n🎁 Airdrops & Rewards\n🗺️ Roadmap & Evolution\n🛒 How to Buy\n👥 Team & Community\n📊 Tokenomics\n\nJust ask me anything!`,
      
      'current': `📊 Current Stats:\n• Market Cap: $${tokenData?.marketCap?.toLocaleString() || '0'}\n• Current Stage: ${currentStage?.name || 'Baby Lobster'}\n• Next Evolution: ${tokenData?.nextEvolution || 'N/A'}`
    };
    
    // Check for keywords
    for (const [keyword, response] of Object.entries(responses)) {
      if (input.includes(keyword)) {
        return response;
      }
    }
    
    // Default response
    return `🦞 I'm not sure about that!\n\nTry asking me about:\n• Airdrops\n• Price/Market cap\n• How to buy\n• Roadmap\n• Team\n\nOr join our Telegram for more help!`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get bot response
    const botResponse = getBotResponse(userMessage);
    
    // Add bot response
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: botResponse 
    }]);

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick questions
  const quickQuestions = [
    "How do airdrops work?",
    "What's the current price?",
    "Show me the roadmap",
    "How to buy MORPH?"
  ];

  return (
    <>
      {/* Bot Toggle Button */}
      <button 
        className={`clawd-bot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Clawd Bot"
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
                className={`message ${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">🦞</div>
                )}
                <div className="message-bubble">
                  {msg.content.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </span>
                  ))}
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
              <p className="quick-questions-title">Quick questions:</p>
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
              aria-label="Send message"
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
