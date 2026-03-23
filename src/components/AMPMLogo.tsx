import React from 'react';
import logoAmpm from '@/assets/logo-ampm.jpeg';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBg?: boolean;
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md' }) => {
  const heights = { sm: 36, md: 52, lg: 68 };
  const h = heights[size];

  return (
    <img
      src={logoAmpm}
      alt="am:pm logo"
      height={h}
      style={{ height: h, width: 'auto', display: 'inline-block' }}
      className={className}
    />
  );
};

export { AMPMLogo };
export default AMPMLogo;
