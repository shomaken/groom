import React from 'react';
import { motion } from 'framer-motion';

const LiveFundTracker = ({ onNext, onPrev }) => {
  const milestones = [
    { amount: 2000, description: "Dress and Suit", emoji: "👰🤵" },
    { amount: 3000, description: "Wedding Rings", emoji: "💍💍" },
    { amount: 8000, description: "Honeymoon", emoji: "🏝️✈️" },
    { amount: 10000, description: "New Car", emoji: "🚗" },
    { amount: 15000, description: "Wedding Ceremony", emoji: "⛪💒" },
    { amount: 100000, description: "House", emoji: "🏡💕" }
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
