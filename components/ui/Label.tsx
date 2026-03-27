import { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
  className?: string;
}

export default function Label({ children, className = '' }: LabelProps) {
  return (
    <span className={`font-mono text-[10px] font-bold uppercase tracking-[1.5px] ${className}`}>
      {children}
    </span>
  );
}
