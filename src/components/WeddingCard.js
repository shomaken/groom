import React from 'react';
import { motion } from 'framer-motion';
import './WeddingCard.css';

const WeddingCard = ({ isOpen, onOpen }) => {
  return (
    <motion.div 
      className="wedding-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
    >
      <div className="card-front">
        <div className="card-border">
          <div className="logo-container">
            <img 
              src="/Logo-transparent.png" 
              alt="GROOM Logo" 
              className="groom-logo"
            />
          </div>
          <div className="invitation-text">
            <h1 className="invitation-title">You're Invited</h1>
            <p className="invitation-subtitle">Built on love. Powered by $GROOM.</p>
            <div className="tap-hint">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="tap-circle"
              />
              <span>Tap to open</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeddingCard;