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
    
    // Calculate cumulative amounts for sequential milestone filling
    let cumulativeAmount = 0;
    
    // Find which milestone this is and calculate cumulative amount up to previous milestone
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].amount === milestoneAmount) {
        break;
      }
      cumulativeAmount += milestones[i].amount;
    }
    
    // Calculate how much money is available for this specific milestone
    const availableForThisMilestone = totalRaised - cumulativeAmount;
    
    // Calculate the range this milestone needs to be completed
    const milestoneRange = milestoneAmount;
    
    // Debug logging
    console.log(`Milestone $${milestoneAmount}:`, {
      totalRaised: `$${totalRaised.toLocaleString()}`,
      cumulativeAmount: `$${cumulativeAmount.toLocaleString()}`,
      availableForThisMilestone: `$${availableForThisMilestone.toLocaleString()}`,
      milestoneRange: `$${milestoneRange.toLocaleString()}`,
      percentage: `${((availableForThisMilestone / milestoneRange) * 100).toFixed(1)}%`
    });
    
    if (totalRaised >= (cumulativeAmount + milestoneAmount)) {
      // Milestone is fully completed
      return 100;
    } else if (totalRaised <= cumulativeAmount) {
      // Not enough money to start this milestone yet
      return 0;
    } else {
      // Calculate percentage based on how much of this milestone's range is filled
      const percentage = (availableForThisMilestone / milestoneRange) * 100;
      return Math.min(100, Math.max(0, percentage));
    }
  };

  const isCompleted = (milestoneAmount) => {
    if (!hasValidData()) return false;
    const totalRaised = getTotalRaisedNumber();
    
    // Calculate cumulative amount up to this milestone
    let cumulativeAmount = 0;
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].amount === milestoneAmount) {
        cumulativeAmount += milestoneAmount;
        break;
      }
      cumulativeAmount += milestones[i].amount;
    }
    
    return totalRaised >= cumulativeAmount;
  };

  const isActive = (milestoneAmount, index) => {
    if (!hasValidData()) return false;
    const totalRaised = getTotalRaisedNumber();
    
    // Calculate cumulative amount up to previous milestone
    let cumulativeAmount = 0;
    for (let i = 0; i < index; i++) {
      cumulativeAmount += milestones[i].amount;
    }
    
    // Calculate cumulative amount up to this milestone
    const cumulativeAmountWithThis = cumulativeAmount + milestoneAmount;
    
    // Milestone is active if we've completed all previous ones but not this one
    return totalRaised >= cumulativeAmount && totalRaised < cumulativeAmountWithThis;
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
                   <span className={`milestone-emoji ${isCompleted(milestone.amount) ? 'completed' : isActive(milestone.amount, index) ? 'active' : ''}`}>
                     {milestone.emoji}
                   </span>
                   <span>{milestone.description}</span>
                   {isActive(milestone.amount, index) && (
                     <span className="active-indicator"> ← Currently Working On</span>
                   )}
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
