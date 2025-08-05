import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = ({ onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

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
          <h3>Join Our Community</h3>
          <p>
            Connect with us and fellow $GROOM holders across our social platforms. 
            Stay updated on our wedding journey, token developments, and future NGO activities.
          </p>
          
          <div className="social-links">
            <motion.a
              href="https://x.com/groomtoken"
              className="social-link twitter"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>𝕏</span>
            </motion.a>
            
            <motion.a
              href="https://t.me/groomtoken"
              className="social-link telegram"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ filter: 'grayscale(100%)' }}>✈️</span>
            </motion.a>
            
            <motion.a
              href="https://discord.gg/groomtoken"
              className="social-link discord"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ filter: 'grayscale(100%)' }}>💬</span>
            </motion.a>
          </div>
          
          <div className="social-descriptions">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="social-item"
            >
              <h4>Twitter/X</h4>
              <p>Daily updates, milestone celebrations, and community highlights</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="social-item"
            >
              <h4>Telegram</h4>
              <p>Real-time chat with the community and instant wedding updates</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="social-item"
            >
              <h4>Discord</h4>
              <p>Deep discussions about tokenomics and future NGO planning</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="contact-form-section"
        >
          <h3>Get in Touch</h3>
          <p>
            Have questions about $GROOM, our wedding, or the future NGO? 
            We'd love to hear from you!
          </p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Tell us what's on your mind..."
                rows="5"
              />
            </div>
            
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isSubmitted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? 'Sending...' : isSubmitted ? 'Message Sent!' : 'Send Message'}
            </motion.button>
            
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="success-message"
              >
                Thank you for your message! We'll get back to you soon.
              </motion.div>
            )}
          </form>
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
                © 2024 GROOM. Built with love for our community.
              </p>
            </div>
            
            <div className="footer-links">
              <button className="footer-link" onClick={() => window.open('https://groomtoken.com/privacy', '_blank')}>Privacy Policy</button>
              <button className="footer-link" onClick={() => window.open('https://groomtoken.com/terms', '_blank')}>Terms of Service</button>
              <button className="footer-link" onClick={() => window.open('https://groomtoken.com/whitepaper', '_blank')}>Whitepaper</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
