import React from 'react';
import { motion } from 'framer-motion';

const Contact = ({ onNext, onPrev }) => {

  return (
    <div className="contact">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2>Contact & Community</h2>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="community-section"
        >
          <h3>Get in Touch</h3>
          <p>
            Connect with us directly for questions about $GROOM, our wedding journey, or future plans.
          </p>
          
          <div className="contact-info">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="contact-item"
            >
              <h4>📧 Email</h4>
              <p>groomfund@gmail.com</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="contact-item"
            >
              <h4>🐦 X (Twitter)</h4>
              <p>DM us on X</p>
            </motion.div>
          </div>
        </motion.div>



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1 }}
          className="footer-section"
        >
          <div className="footer-content">
            <div className="footer-logo">
              <img 
                src="/Logo-transparent.png" 
                alt="GROOM Logo" 
                className="footer-logo-img"
              />
            </div>
            
            <div className="footer-text">
              <h4>GROOM</h4>
              <p>Building love on the blockchain, one block at a time.</p>
                             <p className="copyright">
                 © 2025 GROOM. Built with love for our community.
               </p>
            </div>
            

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
