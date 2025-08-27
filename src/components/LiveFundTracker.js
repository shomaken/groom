import React from 'react';
import { motion } from 'framer-motion';

const LiveFundTracker = ({ onNext, onPrev }) => {
  const milestones = [
    { amount: 2000, description: "Dress and Suit", emoji: "👰🤵", progress: 0 },
    { amount: 3000, description: "Wedding Rings", emoji: "💍💍", progress: 0 },
    { amount: 8000, description: "Honeymoon", emoji: "🏝️✈️", progress: 0 },
    { amount: 10000, description: "New Car", emoji: "🚗", progress: 0 },
    { amount: 15000, description: "Wedding Ceremony", emoji: "⛪💒", progress: 0 },
    { amount: 100000, description: "House", emoji: "🏡💕", progress: 0 }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="live-fund-tracker">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Fund Our Future</h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="milestones"
        >
          <h3>Wedding Milestones</h3>
          <ul className="milestone-list">
            {milestones.map((milestone, index) => (
              <motion.li
                key={`${milestone.amount}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="milestone-item"
              >
                <div className="milestone-text">
                  <span className="milestone-emoji">
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
                      animate={{ width: `${Math.max(0, Math.min(100, milestone.progress))}%` }}
                      transition={{ duration: 1.0, ease: "easeOut" }}
                    />
                  </div>
                  <span className="progress-text">{Math.max(0, Math.min(100, milestone.progress))}%</span>
                </div>
              </motion.li>
            ))}
          </ul>
          <p className="daily-update-note">Milestones will be updated daily.</p>
          <p className="projection-note">Based on current and expected Pump.fun trading volumes and the 0.05% fee allocation, we project reaching the target funding level in approximately six months.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LiveFundTracker;
