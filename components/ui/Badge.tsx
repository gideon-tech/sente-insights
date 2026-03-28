type BadgeVariant = 'guest' | 'free' | 'premium' | 'enterprise';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  guest: 'bg-brutal-surface text-brutal-black',
  free: 'bg-brutal-surface text-brutal-black',
  premium: 'bg-brutal-yellow text-brutal-black',
  enterprise: 'bg-brutal-cyan text-brutal-black',
};

const labels: Record<BadgeVariant, string> = {
  guest: 'GUEST',
  free: 'FREE',
  premium: 'PREMIUM',
  enterprise: 'ENTERPRISE',
};

export default function Badge({ variant, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-block px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[1.5px]
        border-2 border-brutal-black rounded-[4px]
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {labels[variant]}
    </span>
  );
}
