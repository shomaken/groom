import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import WeddingCard from './components/WeddingCard';
import CoverPage from './components/CoverPage';
import OurStory from './components/OurStory';
import LiveFundTracker from './components/LiveFundTracker';
import AfterWedding from './components/AfterWedding';
import TokenInfo from './components/TokenInfo';
import Contact from './components/Contact';
import Navbar from './components/Navbar';

function App() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('cover');

  const pages = [
    { id: 'cover', component: CoverPage, title: "Cover" },
    { id: 'story', component: OurStory, title: "Our Story" },
    { id: 'fund', component: LiveFundTracker, title: "Fund Our Future" },
    { id: 'after', component: AfterWedding, title: "After the Wedding" },
    { id: 'token', component: TokenInfo, title: "Token Info" },
    { id: 'contact', component: Contact, title: "Contact & Community" }
  ];

  const handleOpenCard = () => {
    setIsCardOpen(true);
  };

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
  };

  const nextPage = () => {
    const currentIndex = pages.findIndex(page => page.id === currentPage);
    if (currentIndex < pages.length - 1) {
      setCurrentPage(pages[currentIndex + 1].id);
    }
  };

  const prevPage = () => {
    const currentIndex = pages.findIndex(page => page.id === currentPage);
    if (currentIndex > 0) {
      setCurrentPage(pages[currentIndex - 1].id);
    }
  };

  const getCurrentComponent = () => {
    const currentPageData = pages.find(page => page.id === currentPage);
    const CurrentComponent = currentPageData.component;
    return <CurrentComponent onNext={nextPage} onPrev={prevPage} />;
  };

  return (
    <div className="App">
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isCardOpen={isCardOpen} 
      />
      <div className="background-pattern"></div>
      <AnimatePresence mode="wait">
        {!isCardOpen ? (
          <motion.div
            key="closed-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="closed-card-container"
          >
            <WeddingCard isOpen={false} onOpen={handleOpenCard} />
          </motion.div>
        ) : (
          <motion.div
            key="open-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="open-card-container"
          >
            <div className="page-container">
              <div className="page-navigation">
                <button 
                  className="nav-button prev" 
                  onClick={prevPage}
                  disabled={pages.findIndex(page => page.id === currentPage) === 0}
                >
                  ←
                </button>
                <span className="page-indicator">
                  {pages.findIndex(page => page.id === currentPage) + 1} / {pages.length}
                </span>
                <button 
                  className="nav-button next" 
                  onClick={nextPage}
                  disabled={pages.findIndex(page => page.id === currentPage) === pages.length - 1}
                >
                  →
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="page-content"
                >
                  {getCurrentComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;