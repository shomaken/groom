import React from 'react';
import { motion } from 'framer-motion';

const AfterWedding = ({ onNext, onPrev }) => {
  return (
    <div className="after-wedding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>After the Wedding</h2>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="ngo-explanation"
        >
          <div className="card">
            <div className="card-header">
              <h3>GROOM Evolves Into an NGO</h3>
            </div>
            <p>
              Ashley and Martin's wedding is just the beginning. Once we say "I do," GROOM transforms 
              into something even more meaningful - a non-governmental organization 
              dedicated to supporting grooms and couples in need around the world.
            </p>
            <p>
              The same community that helped fund our special day will continue to 
              make a difference in the lives of others, creating a lasting legacy 
              of love and support.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="future-plans"
        >
          <h3>Our Mission Going Forward</h3>
          
          <div className="mission-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mission-item"
            >
              <div className="mission-icon" style={{ filter: 'grayscale(100%)' }}>🤝</div>
              <h4>Community Support</h4>
              <p>Continue funding weddings for couples who need financial assistance to celebrate their love.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="mission-item"
            >
              <div className="mission-icon" style={{ filter: 'grayscale(100%)' }}>📋</div>
              <h4>KYC-Based Applications</h4>
              <p>Implement a transparent application system where verified couples can request support for their wedding expenses.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mission-item"
            >
              <div className="mission-icon" style={{ filter: 'grayscale(100%)' }}>🌍</div>
              <h4>Global Impact</h4>
              <p>Expand our reach to help couples from different backgrounds and cultures celebrate their unions.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mission-item"
            >
              <div className="mission-icon" style={{ filter: 'grayscale(100%)' }}>💎</div>
              <h4>Token Utility</h4>
              <p>$GROOM holders will have voting rights on which couples receive funding, creating a truly democratic process.</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="sustainability-model"
        >
          <div className="card">
            <h4>Sustainable Funding Model</h4>
            <ul>
              <li>0.05% of all trading volume continues to flow into the community fund</li>
              <li>Transparent allocation of funds through community voting</li>
              <li>Regular reporting on couples helped and funds distributed</li>
              <li>Partnership opportunities with wedding vendors and services</li>
              <li>Annual community events to celebrate the couples we've supported</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="call-to-action"
        >
          <div className="card">
            <h4>Join Our Mission</h4>
            <p>
              By holding $GROOM, you're not just supporting Ashley and Martin's wedding - you're becoming 
              part of a movement that will help countless couples around the world celebrate 
              their love stories. Together, we can prove that cryptocurrency can create 
              real, positive change in people's lives.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AfterWedding;
