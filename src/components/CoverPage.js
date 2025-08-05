import React from 'react';
import { motion } from 'framer-motion';

const CoverPage = ({ onNext, onPrev }) => {
  return (
    <div className="cover-page">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="cover-content"
      >
        <div className="logo-section">
          <motion.img 
            src="/Logo-transparent.png" 
            alt="GROOM Logo" 
            className="cover-logo"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="welcome-text"
        >
          <h1>Ashley & Martin</h1>
          <p className="tagline">Built on love. Powered by $GROOM.</p>
          <p className="description">
            You're about to witness something beautiful - a real love story that's 
            changing the world of decentralized finance, one heart at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="next-prompt"
        >
          <button className="btn btn-primary" onClick={onNext}>
            Begin Our Story →
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CoverPage;