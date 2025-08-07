import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TokenInfo = ({ onNext, onPrev }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  const tokenAddress = "ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS"; // GROOM token address
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="token-info">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Token Information</h2>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="token-utility"
        >
          <div className="card">
            <div className="card-header">
              <h3>$GROOM Token Utility</h3>
            </div>
            <div className="utility-explanation">
              <p>
                <strong>Revenue Share:</strong> 1% of all trading volume is automatically 
                redirected to the GROOM wedding fund, creating sustainable funding for 
                our special day and future NGO operations.
              </p>
              <p>
                <strong>Community Governance:</strong> Token holders will have voting 
                rights on future funding decisions once GROOM transitions to an NGO.
              </p>
              <p>
                <strong>Transparency:</strong> All fund allocations and wedding expenses 
                are tracked on-chain and reported to the community.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="contract-details"
        >
          <div className="card">
            <h3>Contract Details</h3>
            
            <div className="contract-item">
              <label>Token Address:</label>
              <div className="address-container">
                <code className="contract-address">{tokenAddress}</code>
                <button 
                  className="copy-button"
                  onClick={() => copyToClipboard(tokenAddress)}
                >
                  {copiedAddress ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="contract-item">
              <label>Blockchain:</label>
              <span>Solana</span>
            </div>

            <div className="contract-item">
              <label>Token Symbol:</label>
              <span>$GROOM</span>
            </div>

            <div className="contract-item">
              <label>Decimals:</label>
              <span>9</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="where-to-buy"
        >
          <h3>Where to Buy $GROOM</h3>
          
          <div className="buy-options">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="buy-option"
            >
              <div className="platform-logo" style={{ filter: 'grayscale(100%)' }}>🛍️</div>
              <h4>BagsApp</h4>
              <p>The primary marketplace for $GROOM tokens</p>
                                <a href="https://bags.fm/ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                Buy on BagsApp
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="buy-option"
            >
              <div className="platform-logo" style={{ filter: 'grayscale(100%)' }}>📊</div>
              <h4>Birdeye</h4>
              <p>View live charts and trading data</p>
                                <a href="https://birdeye.so/token/ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                View Chart
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="buy-option"
            >
              <div className="platform-logo" style={{ filter: 'grayscale(100%)' }}>🔍</div>
              <h4>Solscan</h4>
              <p>Explore token and transactions</p>
                                <a href="https://solscan.io/token/ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                View Token
              </a>
            </motion.div>
          </div>
        </motion.div>



        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="disclaimer"
        >
          <div className="card">
            <h4>Important Notice</h4>
            <p>
              <strong>DYOR (Do Your Own Research):</strong> Cryptocurrency investments 
              carry risk. Please research thoroughly and only invest what you can 
              afford to lose. $GROOM is designed as a community token to support 
              real-world wedding funding and future charitable activities.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TokenInfo;
