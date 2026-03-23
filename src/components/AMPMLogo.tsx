interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AMPMLogo({ className = '', size = 'md' }: AMPMLogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} aspect-[2.5/1] bg-primary rounded-lg flex items-center justify-center px-4`}>
        <span className="text-primary-foreground font-extrabold tracking-tight" style={{ fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1rem' }}>
          AMPM
        </span>
      </div>
      <div className="hidden sm:block">
        <span className="text-sm font-medium text-muted-foreground">Nicaragua</span>
      </div>
    </div>
  );
}
