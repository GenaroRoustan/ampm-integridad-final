import React from 'react';
import logoAmpm from '@/assets/logo-ampm.png';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBg?: boolean;
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md', darkBg = false }) => {
  const heights = { sm: 36, md: 52, lg: 68 };
  return (
    <img
      src={logoAmpm}
      alt="am:pm logo"
      style={{
        height: heights[size],
        width: 'auto',
        display: 'inline-block',
        mixBlendMode: 'screen',
      }}
      className={className}
    />
  );
};

export { AMPMLogo };
export default AMPMLogo;
