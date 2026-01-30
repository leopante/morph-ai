import { useState, useEffect } from 'react';
import './App.css';
import ClawdBot from './components/ClawdBot';

function App() {
  const [currentStage, setCurrentStage] = useState(0);
  const [marketCap, setMarketCap] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  const evolutionStages = [
    {
      name: "Baby Lobster",
      marketCap: 0,
      color: "#ff6b9d",
      description: "Just hatched! A tiny crustacean ready to conquer the seas",
      emoji: "🦐",
      image: "/images/baby-lobster.png",
      size: "small"
    },
    {
      name: "Teen Crab",
      marketCap: 30000,
      color: "#ff8c42",
      description: "Growing stronger! The claws are getting sharper",
      emoji: "🦀",
      image: "/images/teen-crab.png",
      size: "medium"
    },
    {
      name: "Adult Lobster",
      marketCap: 100000,
      color: "#e63946",
      description: "Fully matured! Dominating the ocean floor",
      emoji: "🦞",
      image: "/images/adult-lobster.png",
      size: "large"
    },
    {
      name: "Mega Lobster",
      marketCap: 300000,
      color: "#d90368",
      description: "Evolution complete! A legendary beast emerges",
      emoji: "🐉",
      image: "/images/mega-lobster.png",
      size: "xlarge"
    },
    {
      name: "Cosmic Lobster",
      marketCap: 1000000,
      color: "#00b4d8",
      description: "MOONSHOT! Transcended to the stars 🌟",
      emoji: "🚀",
      image: "/images/cosmic-lobster.png",
      size: "cosmic"
    }
  ];

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

  // Update evolution stage based on market cap
  useEffect(() => {
    const newStage = evolutionStages.findIndex((stage, index) => {
      const nextStage = evolutionStages[index + 1];
      return marketCap >= stage.marketCap && (!nextStage || marketCap < nextStage.marketCap);
    });
    
    if (newStage !== currentStage && newStage !== -1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStage(newStage);
        createEvolutionParticles();
        setTimeout(() => setIsAnimating(false), 1000);
      }, 500);
    }
  }, [marketCap]);

  // Create particle explosion on evolution
  const createEvolutionParticles = () => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 2000);
  };

  const currentEvolution = evolutionStages[currentStage];
  const nextEvolution = evolutionStages[currentStage + 1];
  const progress = nextEvolution 
    ? ((marketCap - currentEvolution.marketCap) / (nextEvolution.marketCap - currentEvolution.marketCap)) * 100
    : 100;

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-gradient"></div>
      <div className="bg-grid"></div>
      
      {/* Floating Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{ 
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* Evolution Particles */}
      {particles.map(particle => (
        <div 
          key={particle.id} 
          className="evolution-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`
          }}
        ></div>
      ))}

      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src="/images/coin-logo.png" alt="CLAWDY" className="logo-img" />
          <h1 className="title">
            <span className="glitch" data-text="CLAWDY">CLAWDY</span>
          </h1>
        </div>
        <button className="connect-wallet-btn">
          <span className="btn-text">Connect Wallet</span>
          <span className="btn-glow"></span>
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Mascot Container */}
        <div className="mascot-section">
          <div className={`mascot-container ${isAnimating ? 'evolving' : ''} stage-${currentStage}`}>
            <div className="mascot-glow" style={{ background: `radial-gradient(circle, ${currentEvolution.color}66 0%, transparent 70%)` }}></div>
            <div className={`mascot ${currentEvolution.size}`}>
              {currentEvolution.image ? (
                <img 
                  src={currentEvolution.image} 
                  alt={currentEvolution.name}
                  className="mascot-image"
                />
              ) : (
                <span className="mascot-emoji">{currentEvolution.emoji}</span>
              )}
              <div className="mascot-shadow"></div>
            </div>
            {isAnimating && (
              <div className="evolution-flash"></div>
            )}
          </div>
          
          <div className="stage-info">
            <h2 className="stage-name" style={{ color: currentEvolution.color }}>
              {currentEvolution.name}
            </h2>
            <p className="stage-description">{currentEvolution.description}</p>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="stats-panel">
          <div className="stat-card">
            <span className="stat-label">Current Market Cap</span>
            <span className="stat-value">${marketCap.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Next Evolution</span>
            <span className="stat-value">
              {nextEvolution ? `$${nextEvolution.marketCap.toLocaleString()}` : 'MAX LEVEL!'}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Holders</span>
            <span className="stat-value">1,247</span>
          </div>
        </div>

        {/* Evolution Progress Bar */}
        {nextEvolution && (
          <div className="evolution-progress-container">
            <div className="progress-header">
              <span className="progress-label">Evolution Progress</span>
              <span className="progress-percentage">{progress.toFixed(1)}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${currentEvolution.color}, ${nextEvolution.color})`
                  }}
                >
                  <div className="progress-bar-shine"></div>
                </div>
              </div>
              <div className="progress-markers">
                {evolutionStages.slice(0, -1).map((stage, index) => (
                  <div 
                    key={index}
                    className={`progress-marker ${index <= currentStage ? 'completed' : ''}`}
                    style={{ 
                      left: `${(index / (evolutionStages.length - 1)) * 100}%`,
                      borderColor: index <= currentStage ? stage.color : '#333'
                    }}
                  >
                    <span className="marker-emoji">{stage.emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evolution Roadmap */}
        <div className="roadmap-section">
          <h3 className="section-title">Evolution Roadmap</h3>
          <div className="roadmap-grid">
            {evolutionStages.map((stage, index) => (
              <div 
                key={index}
                className={`roadmap-card ${index <= currentStage ? 'unlocked' : 'locked'}`}
                style={{ 
                  borderColor: index === currentStage ? stage.color : '#333',
                  boxShadow: index === currentStage ? `0 0 30px ${stage.color}44` : 'none'
                }}
              >
                <div className="roadmap-icon" style={{ 
                  background: index <= currentStage ? stage.color : '#1a1a1a' 
                }}>
                  <span className="roadmap-emoji">{stage.emoji}</span>
                </div>
                <h4 className="roadmap-title">{stage.name}</h4>
                <p className="roadmap-cap">${stage.marketCap.toLocaleString()}</p>
                <p className="roadmap-desc">{stage.description}</p>
                {index <= currentStage && (
                  <div className="unlocked-badge">UNLOCKED ✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Airdrop Section */}
        <div className="airdrop-section">
          <h3 className="section-title">🎁 Evolution Airdrops</h3>
          <div className="airdrop-info">
            <p className="airdrop-text">
              Every evolution unlocks an airdrop for our diamond-handed holders! 
              Connect your wallet to claim your rewards.
            </p>
            <div className="airdrop-stats">
              <div className="airdrop-stat">
                <span className="airdrop-label">Next Airdrop At</span>
                <span className="airdrop-value">{nextEvolution?.name || 'COMPLETED'}</span>
              </div>
              <div className="airdrop-stat">
                <span className="airdrop-label">Total Distributed</span>
                <span className="airdrop-value">250,000 MORPH</span>
              </div>
            </div>
            <button className="claim-airdrop-btn">
              <span>Check Eligibility</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="social-links">
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">Telegram</a>
          <a href="#" className="social-link">Discord</a>
        </div>
        <p className="footer-text">MORPH AI - Evolve & Adapt 🦞</p>
      </footer>

      {/* Clawd Bot */}
      <ClawdBot 
        tokenData={{
          marketCap: marketCap,
          nextEvolution: nextEvolution?.name
        }}
        currentStage={evolutionStages[currentStage]}
      />
    </div>
  );
}

export default App;
