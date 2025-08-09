import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = ({ currentPage, onPageChange, isCardOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pages = [
    { id: 'cover', name: 'Home' },
    { id: 'story', name: 'Our Story' },
    { id: 'fund', name: 'Fund Tracker' },
    { id: 'after', name: 'After Wedding' },
    { id: 'token', name: 'Token Info' },
    { id: 'contact', name: 'Contact' }
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src="/Logo-transparent.png" alt="GROOM" className="navbar-logo" />
          <span className="navbar-title">GROOM</span>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {pages.map((page) => (
            <button
              key={page.id}
              className={`navbar-link ${currentPage === page.id ? 'active' : ''}`}
              onClick={() => handlePageChange(page.id)}
              disabled={!isCardOpen && page.id !== 'cover'}
            >
              {page.name}
            </button>
          ))}
          
          {/* Action Buttons */}
          <div className="navbar-actions">
            <button className="btn btn-buy" onClick={() => window.open('https://bags.fm/3pbRf4yo42oQCBBHxuDeRWm7vtunBxKSj6thjX2eBAGS', '_blank')}>
              Buy $GROOM
            </button>
            <button className="btn btn-follow" onClick={() => window.open('https://x.com/groomdotfund', '_blank')}>
              FOLLOW X
            </button>
          </div>
        </div>

        {/* Mobile Burger Menu */}
        <div className="navbar-mobile">
          <button className="burger-menu" onClick={toggleMenu}>
            <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <div className="mobile-menu-brand">
                  <img src="/Logo-transparent.png" alt="GROOM" className="mobile-menu-logo" />
                  <span className="mobile-menu-title">GROOM</span>
                </div>
                <button className="close-menu" onClick={toggleMenu}>
                  <span className="close-icon">×</span>
                </button>
              </div>
              <div className="mobile-menu-links">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    className={`mobile-menu-link ${currentPage === page.id ? 'active' : ''}`}
                    onClick={() => handlePageChange(page.id)}
                    disabled={!isCardOpen && page.id !== 'cover'}
                  >
                    <span className="link-text">{page.name}</span>
                    {currentPage === page.id && <span className="active-indicator">●</span>}
                  </button>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="mobile-actions">
                  <button className="btn btn-buy" onClick={() => window.open('https://bags.fm/3pbRf4yo42oQCBBHxuDeRWm7vtunBxKSj6thjX2eBAGS', '_blank')}>
                    Buy $GROOM
                  </button>
                  <button className="btn btn-follow" onClick={() => window.open('https://x.com/groomdotfund', '_blank')}>
                    FOLLOW X
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 
