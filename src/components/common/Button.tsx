// =========================================================================
// MetaFore Technologies - Reusable Global Button Component
// =========================================================================

import React, { ButtonHTMLAttributes } from 'react';

// বাটনের বিভিন্ন স্টাইল এবং সাইজের অপশন
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'glass' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  // বাটনের বেসিক স্টাইল যা সব বাটনেই থাকবে
  const baseStyle = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  // ভ্যারিয়েন্ট অনুযায়ী রঙের স্টাইল
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-electric hover:bg-electric-bright text-white shadow-premium hover:shadow-electric/30 hover:-translate-y-0.5',
    secondary: 'bg-navy-surface text-white hover:bg-navy-surface/80 border border-borderColor',
    outline: 'border border-electric text-electric hover:bg-electric hover:text-white',
    glass: 'glass-panel hover:bg-white/10 text-white',
    ghost: 'bg-transparent text-soft-gray hover:text-white hover:bg-navy-surface',
  };

  // সাইজ অনুযায়ী প্যাডিং এবং ফন্ট সাইজ
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg font-semibold',
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];
  const widthStyle = fullWidth ? 'w-full' : '';

  // সবগুলো ক্লাসকে একত্রিত করা
  const combinedClasses = `${baseStyle} ${variantStyle} ${sizeStyle} ${widthStyle} ${className}`;

  return (
    <button 
      className={combinedClasses.trim()} 
      disabled={disabled || isLoading} 
      {...props}
    >
      {/* লোডিং অবস্থায় থাকলে স্পিনার দেখাবে */}
      {isLoading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* বাম পাশের আইকন (যদি থাকে এবং লোডিং না হয়) */}
      {!isLoading && leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      
      {/* মূল লেখা */}
      <span>{children}</span>
      
      {/* ডান পাশের আইকন (যদি থাকে) */}
      {!isLoading && rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
    </button>
  );
};