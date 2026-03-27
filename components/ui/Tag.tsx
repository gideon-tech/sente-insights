import { ReactNode } from 'react';

type TagColor = 'yellow' | 'cyan' | 'pink' | 'green' | 'gray' | 'black';

interface TagProps {
  children: ReactNode;
  color?: TagColor;
  className?: string;
}

const colorStyles: Record<TagColor, string> = {
  yellow: 'bg-brutal-yellow text-brutal-black',
  cyan: 'bg-brutal-cyan text-brutal-black',
  pink: 'bg-brutal-pink text-brutal-black',
  green: 'bg-brutal-green text-brutal-black',
  gray: 'bg-neutral-200 text-brutal-black',
  black: 'bg-brutal-black text-white',
};

export default function Tag({ children, color = 'gray', className = '' }: TagProps) {
  return (
    <span
      className={`
        inline-block px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider
        border-2 border-brutal-black rounded-[4px]
        ${colorStyles[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
