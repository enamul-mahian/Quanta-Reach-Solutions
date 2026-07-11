// =========================================================================
// MetaFore Technologies - Reusable Container Component
// =========================================================================

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  // HTML ট্যাগের ধরন (যেমন: div, section, header, footer) পরিবর্তন করার অপশন
  as?: React.ElementType; 
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}) => {
  return (
    <Component 
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${className}`}
    >
      {children}
    </Component>
  );
};