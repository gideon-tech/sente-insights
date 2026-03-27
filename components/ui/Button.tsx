'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'cyan' | 'green' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brutal-yellow text-brutal-black neo-border neo-shadow neo-shadow-hover neo-shadow-active',
  secondary: 'bg-brutal-card text-brutal-black neo-border neo-shadow neo-shadow-hover neo-shadow-active',
  cyan: 'bg-brutal-cyan text-brutal-black neo-border neo-shadow neo-shadow-hover neo-shadow-active',
  green: 'bg-brutal-green text-brutal-black neo-border neo-shadow neo-shadow-hover neo-shadow-active',
  outline: 'bg-transparent text-brutal-black neo-border hover:bg-brutal-black hover:text-white transition-colors',
  ghost: 'bg-transparent text-brutal-black hover:text-brutal-yellow transition-colors',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-8 py-4 text-lg',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          font-mono font-bold uppercase tracking-tight rounded-[4px] cursor-pointer
          transition-all duration-150
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-40 cursor-not-allowed !shadow-none !translate-x-0 !translate-y-0' : ''}
          ${className}
        `}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
