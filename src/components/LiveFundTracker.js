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
        const data = await tokenService.getTokenMetrics();
        
        setTokenData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching token data:', error);
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

  // Parse total raised amount from string to number
  const getTotalRaisedNumber = () => {
    if (!tokenData.success || !tokenData.isRealLifetimeFees) return 0;
    
    // Extract number from string like "$53.2K" or "$4,800.80" or "Error: No data available"
    const totalRaisedStr = tokenData.totalRaised;
    if (totalRaisedStr.includes('Error') || totalRaisedStr === 'Loading...') return 0;
    
    // Remove "$" and "," and convert to number
    let cleanAmount = totalRaisedStr.replace(/[$,]/g, '');
    
    // Handle K (thousands), M (millions), B (billions) suffixes
    let multiplier = 1;
    if (cleanAmount.includes('K')) {
      multiplier = 1000;
      cleanAmount = cleanAmount.replace('K', '');
    } else if (cleanAmount.includes('M')) {
      multiplier = 1000000;
      cleanAmount = cleanAmount.replace('M', '');
    } else if (cleanAmount.includes('B')) {
      multiplier = 1000000000;
      cleanAmount = cleanAmount.replace('B', '');
    }
    
    const amount = parseFloat(cleanAmount);
    return isNaN(amount) ? 0 : amount * multiplier;
  };

  // Check if we have valid data for display
  const hasValidData = () => {
    return tokenData.success && 
           tokenData.isRealLifetimeFees && 
           !tokenData.totalRaised.includes('Error') &&
           tokenData.totalRaised !== 'Loading...';
  };

  const getMilestoneProgress = (milestoneAmount) => {
    if (!hasValidData()) return 0;
    
    const totalRaised = getTotalRaisedNumber();
    
    const previousMilestone = milestones
      .filter(m => m.amount < milestoneAmount)
      .reduce((max, current) => current.amount > max ? current.amount : max, 0);
    
    const progressBase = totalRaised - previousMilestone;
    const milestoneRange = milestoneAmount - previousMilestone;
    
    if (totalRaised >= milestoneAmount) {
      return 100;
    } else if (totalRaised <= previousMilestone) {
      return 0;
    } else {
      return Math.min(100, (progressBase / milestoneRange) * 100);
    }
  };

  const isCompleted = (milestoneAmount) => {
    if (!hasValidData()) return false;
    const totalRaised = getTotalRaisedNumber();
    return totalRaised >= milestoneAmount;
  };

  const isActive = (milestoneAmount, index) => {
    if (!hasValidData()) return false;
    const totalRaised = getTotalRaisedNumber();
    if (index === 0) return totalRaised < milestoneAmount;
    const previousMilestone = milestones[index - 1];
    return totalRaised >= previousMilestone.amount && totalRaised < milestoneAmount;
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
               <div className="stat-value">
                 {tokenData.success && tokenData.isRealMetrics ? tokenData.price : 'Error'}
               </div>
               <div className="stat-label">Token Price</div>
             </div>
             <div className="stat-item">
               <div className="stat-value">
                 {tokenData.success && tokenData.isRealMetrics ? tokenData.marketCap : 'Error'}
               </div>
               <div className="stat-label">Market Cap</div>
             </div>
             <div className="stat-item">
               <div className="stat-value">
                 {tokenData.success && tokenData.isRealMetrics ? tokenData.volume : 'Error'}
               </div>
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
                         <h3>Raised for GROOM so far: {tokenData.success && tokenData.isRealLifetimeFees ? tokenData.totalRaised : 'Error: No data available'}</h3>
                         {tokenData.success && tokenData.isRealLifetimeFees && tokenData.totalRaisedSOL && (
               <p className="sol-amount">({tokenData.totalRaisedSOL})</p>
             )}
                         {tokenData.lastUpdated && (
               <p className="last-updated">
                 Last updated: {tokenService.getTimeAgo(tokenData.lastUpdated)}
                 {tokenData.isRealLifetimeFees && <span className="real-data-indicator"> • Real Lifetime Fees</span>}
                 {tokenData.isRealMetrics && <span className="real-data-indicator"> • Real Token Metrics</span>}
                 {!tokenData.success && <span className="error-indicator"> • API Error: {tokenData.error || 'Unknown error'}</span>}
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
                       <div className="current-progress">
              <p>Current Progress: <strong>{hasValidData() ? `$${getTotalRaisedNumber().toLocaleString()}` : 'Loading...'}</strong> raised</p>
            </div>
          <ul className="milestone-list">
                         {milestones.map((milestone, index) => (
               <motion.li
                 key={`${milestone.amount}-${getTotalRaisedNumber()}`}
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
                       transition={{ duration: 1.5, ease: "easeOut" }}
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
