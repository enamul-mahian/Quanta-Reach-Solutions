// =========================================================================
// MetaFore Technologies - Custom Floating & Scroll Animation Component
// =========================================================================

import React from 'react';
import { motion } from 'framer-motion';

interface FloatingElementProps {
  children: React.ReactNode;
  initialX?: number;
  initialY?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  initialX = 0, 
  initialY = 0, 
  duration = 5, 
  delay = 0,
  className = ''
}) => {
  return (
    <motion.div
      className={`fixed z-[1000] pointer-events-none ${className}`}
      initial={{ x: initialX, y: initialY }}
      animate={{ 
        x: [initialX, initialX + 50, initialX], 
        y: [initialY, initialY - 30, initialY] 
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
    >
      {children}
    </motion.div>
  );
};