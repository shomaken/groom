import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TokenInfo = ({ onNext, onPrev }) => {
  const [copied, setCopied] = useState(false);
  const contractAddress = "AGtduuqemj3g8Vd9vy5wUQqgcMJSL1auDmS5qLuL8VYf";
  const buyUrl = "https://pump.fun/coin/AGtduuqemj3g8Vd9vy5wUQqgcMJSL1auDmS5qLuL8VYf";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div className="token-info">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Token Info</h2>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="token-utility"
        >
          <div className="card">
            <div className="card-header">
              <h3>Contract Address</h3>
            </div>
            <div className="utility-explanation">
              <div className="address-row">
                <code className="contract-address">{contractAddress}</code>
                <button className="copy-button" onClick={handleCopy}>{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="where-to-buy"
        >
          <div className="card">
            <h3>Buy</h3>
            <button className="btn btn-primary" onClick={() => window.open(buyUrl, '_blank')}>Buy on Pump.fun</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TokenInfo;
