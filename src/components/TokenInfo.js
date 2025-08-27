import React from 'react';
import { motion } from 'framer-motion';

const TokenInfo = ({ onNext, onPrev }) => {
  return (
    <div className="token-info">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Details</h2>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="token-utility"
        >
          <div className="card">
            <div className="card-header">
              <h3>Coming Soon</h3>
            </div>
            <div className="utility-explanation">
              <p>
                Information about the token and on-chain references will be shared here following launch.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TokenInfo;
