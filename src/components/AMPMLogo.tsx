import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AMPMLogo({ className = '', size = 'md' }: AMPMLogoProps) {
  const sizes = {
    sm: { width: 120, height: 48 },
    md: { width: 160, height: 64 },
    lg: { width: 200, height: 80 },
  };
  const { width, height } = sizes[size];

  return (
    <img
      src="/AIntegrity-AMPM/logo-ampm.png"
      alt="am:pm logo"
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}

export default AMPMLogo;
