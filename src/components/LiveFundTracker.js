import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import tokenService from '../services/tokenService';

const LiveFundTracker = ({ onNext, onPrev }) => {
  const [tokenData, setTokenData] = useState({
    price: 'Loading...',
    marketCap: 'Loading...',
    volume: 'Loading...',
    totalRaised: 'Loading...',
    lastUpdated: null,
    success: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const milestones = [
    { amount: 2000, description: "Dress and Suit", emoji: "👰🤵" },
    { amount: 3000, description: "Wedding Rings", emoji: "💍💍" },
    { amount: 8000, description: "Honeymoon", emoji: "🏝️✈️" },
    { amount: 10000, description: "Wedding Car", emoji: "🚗💨" },
    { amount: 15000, description: "Wedding Ceremony", emoji: "⛪💒" },
    { amount: 100000, description: "House", emoji: "🏡💕" }
  ];

  useEffect(() => {
    // Fetch real token data from our backend
    const fetchTokenData = async () => {
      try {
        setError(null);
        const data = await tokenService.getTokenMetrics();
        
        setTokenData(data);
        setLoading(false);
        
        if (!data.success && data.error) {
          setError(data.error);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError(error.message || 'Failed to fetch token data');
        setLoading(false);
      }
    };

    fetchTokenData();
    
    // Update data every 60 seconds
    const interval = setInterval(fetchTokenData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const getMilestoneProgress = (milestoneAmount) => {
    const previousMilestone = milestones
      .filter(m => m.amount < milestoneAmount)
      .reduce((max, current) => current.amount > max ? current.amount : max, 0);
    
    const progressBase = tokenData.totalRaised - previousMilestone;
    const milestoneRange = milestoneAmount - previousMilestone;
    
    if (tokenData.totalRaised >= milestoneAmount) {
      return 100;
    } else if (tokenData.totalRaised <= previousMilestone) {
      return 0;
    } else {
      return Math.min(100, (progressBase / milestoneRange) * 100);
    }
  };

  const isCompleted = (milestoneAmount) => {
    return tokenData.totalRaised >= milestoneAmount;
  };

  const isActive = (milestoneAmount, index) => {
    if (index === 0) return tokenData.totalRaised < milestoneAmount;
    const previousMilestone = milestones[index - 1];
    return tokenData.totalRaised >= previousMilestone.amount && tokenData.totalRaised < milestoneAmount;
  };

  if (loading) {
    return (
      <div className="live-fund-tracker">
        <div className="loading-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          />
          <p>Loading live data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-fund-tracker">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Fund Our Future</h2>
        
        <div className="token-stats">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="stats-grid"
          >
            <div className="stat-item">
              <div className="stat-value">{tokenData.price}</div>
              <div className="stat-label">Token Price</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{tokenData.marketCap}</div>
              <div className="stat-label">Market Cap</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{tokenData.volume}</div>
              <div className="stat-label">24h Volume</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">${tokenData.solPrice ? tokenData.solPrice.toFixed(2) : '170.00'}</div>
              <div className="stat-label">SOL Price</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="total-raised"
          >
            <h3>Raised for GROOM so far: {tokenData.totalRaised}</h3>
            {tokenData.totalRaisedSOL && (
              <p className="sol-amount">({tokenData.totalRaisedSOL})</p>
            )}
                         {tokenData.lastUpdated && (
               <p className="last-updated">
                 Last updated: {tokenService.getTimeAgo(tokenData.lastUpdated)}
                 {tokenData.isRealLifetimeFees && <span className="real-data-indicator"> • Real Lifetime Fees</span>}
                 {tokenData.isRealMetrics && <span className="real-data-indicator"> • Real Token Metrics</span>}
                 {!tokenData.isRealLifetimeFees && <span className="demo-indicator"> • Demo Lifetime Fees</span>}
                 {!tokenData.isRealMetrics && <span className="demo-indicator"> • Demo Token Metrics</span>}
                 {error && <span className="error-indicator"> (Error: {error})</span>}
               </p>
             )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="milestones"
        >
          <h3>Wedding Milestones</h3>
          <ul className="milestone-list">
            {milestones.map((milestone, index) => (
              <motion.li
                key={milestone.amount}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className={`milestone-item ${isCompleted(milestone.amount) ? 'completed' : ''} ${isActive(milestone.amount, index) ? 'active' : ''}`}
              >
                <div className="milestone-text">
                  <span className="milestone-emoji" style={{ filter: 'grayscale(100%)' }}>
                    {milestone.emoji}
                  </span>
                  <span>{milestone.description}</span>
                </div>
                <div className="milestone-amount">
                  ${formatNumber(milestone.amount)}
                </div>
                <div className="milestone-progress">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${getMilestoneProgress(milestone.amount)}%` }}
                      transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    />
                  </div>
                  <span className="progress-text">
                    {getMilestoneProgress(milestone.amount).toFixed(0)}%
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="fund-explanation"
        >
          <div className="card">
            <h4>How It Works</h4>
            <p>
              1% of all $GROOM trading volume is automatically redirected to our wedding fund. 
              Every trade helps us reach our next milestone, creating real value from community support.
            </p>
            <p>
              <strong>Next Update:</strong> Live data refreshes every 30 seconds
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LiveFundTracker;
