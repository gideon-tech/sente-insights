'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-brutal-black">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 bg-brutal-card text-brutal-black font-body text-sm
            border-3 border-brutal-black rounded-[4px] outline-none
            focus:border-brutal-yellow transition-colors
            placeholder:text-brutal-muted
            ${error ? 'border-brutal-pink' : ''}
            ${className}
          `}
          style={{ borderWidth: '3px' }}
          {...props}
        />
        {error && (
          <p className="font-mono text-[10px] font-bold text-brutal-pink">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
