import React from 'react';
import { motion } from 'framer-motion';

const OurStory = ({ onNext, onPrev }) => {
  return (
    <div className="our-story">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="story-content"
      >
        <h2>Our Story</h2>
        
        <div className="story-text">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            In a world where love meets technology, Ashley and Martin discovered something 
            extraordinary. Both passionate about blockchain and community building, they 
            realized their wedding could become more than just a celebration - it could 
            become a movement.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Instead of a traditional wedding registry, they envisioned something revolutionary: 
            a token-powered funding system that would not only support their special day but 
            create lasting value for their community. Every transaction, every trade, every 
            moment of belief in their love story contributes to making dreams come true.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            GROOM isn't just about one wedding - it's about proving that decentralized 
            communities can come together to support real love, real dreams, and real change. 
            When you hold $GROOM, you're not just holding a token; you're holding a piece 
            of our journey and becoming part of our extended family.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="story-highlight"
          >
            <h3>Why We Created GROOM</h3>
            <ul>
              <li>To revolutionize how communities support life's biggest moments</li>
              <li>To create sustainable value that extends beyond our wedding day</li>
              <li>To build a model that can help other couples realize their dreams</li>
              <li>To prove that love and technology can create something beautiful together</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OurStory;