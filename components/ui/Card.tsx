import { HTMLAttributes, ReactNode } from 'react';

type AccentColor = 'yellow' | 'cyan' | 'pink' | 'green' | 'black' | 'none';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  accent?: AccentColor;
  shadow?: boolean;
}

const accentStyles: Record<AccentColor, string> = {
  yellow: 'border-l-[8px] border-l-brutal-yellow',
  cyan: 'border-l-[8px] border-l-brutal-cyan',
  pink: 'border-l-[8px] border-l-brutal-pink',
  green: 'border-l-[8px] border-l-brutal-green',
  black: 'border-l-[8px] border-l-brutal-black',
  none: '',
};

export default function Card({ children, accent = 'none', shadow = true, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-brutal-card neo-border rounded-[4px]
        ${accentStyles[accent]}
        ${shadow ? 'neo-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
