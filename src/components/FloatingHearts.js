import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './FloatingHearts.css';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Create initial batch of hearts
    const createInitialHearts = () => {
      const initialHearts = [];
      for (let i = 0; i < 30; i++) {
        initialHearts.push({
          id: `heart-${i}`,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight + window.innerHeight,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 15 + 10,
          delay: Math.random() * 5,
        });
      }
      setHearts(initialHearts);
    };

    createInitialHearts();

    // Add new hearts every 2 seconds
    const heartInterval = setInterval(() => {
      setHearts(prevHearts => {
        const newHeart = {
          id: `heart-${Date.now()}-${Math.random()}`,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 15 + 10,
          delay: 0,
        };
        
        // Keep max 40 hearts to prevent performance issues
        const updatedHearts = [...prevHearts, newHeart].slice(-40);
        return updatedHearts;
      });
    }, 2000);

    return () => clearInterval(heartInterval);
  }, []);

  return (
    <div className="floating-hearts-container">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-heart"
          initial={{
            x: heart.x,
            y: heart.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: heart.x + (Math.random() - 0.5) * 100,
            y: -100,
            opacity: [0, 0.8, 0.8, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeInOut",
          }}
          style={{
            fontSize: `${heart.size}px`,
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;