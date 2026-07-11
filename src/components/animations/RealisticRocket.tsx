// =========================================================================
// MetaFore Technologies - Realistic Rocket Animation
// =========================================================================

import React from 'react';
import { motion } from 'framer-motion';

export const RealisticRocket: React.FC = () => {
  return (
    <motion.div className="relative w-12 h-12 rotate-45">
      {/* রকেট বডি */}
      <svg viewBox="0 0 24 24" className="w-full h-full fill-electric">
        <path d="M12 2C8 6 4 10 4 15c0 4 2 6 8 6s8-2 8-6c0-5-4-9-8-13z" />
        <path className="fill-white/30" d="M12 4c-3 4-6 8-6 11 0 3 1 5 6 5s6-2 6-5c0-3-3-7-6-11z" />
        {/* রকেট উইংস */}
        <path className="fill-purple-accent" d="M7 16l-3 4 3-1z" />
        <path className="fill-purple-accent" d="M17 16l3 4-3-1z" />
      </svg>
      
      {/* রকেটের আগুন বা ফ্লেম */}
      <motion.div 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3 h-8 bg-gradient-to-t from-orange-500 to-transparent blur-[2px]"
        animate={{ height: [20, 35, 20], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};