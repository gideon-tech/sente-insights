interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b-[3px] border-brutal-black bg-brutal-card px-6 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-mono font-black text-4xl md:text-6xl tracking-tighter uppercase mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-lg text-brutal-muted max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
