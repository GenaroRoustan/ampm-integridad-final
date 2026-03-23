import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md' }) => {
  const scales = { sm: 0.65, md: 0.85, lg: 1.1 };
  const scale = scales[size];

  return (
    <svg
      width={200 * scale}
      height={60 * scale}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      <text
        x="0"
        y="48"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="52"
        letterSpacing="-2"
      >
        <tspan fill="#e87200">am</tspan>
        <tspan fill="#11284a">:</tspan>
        <tspan fill="#11284a">pm</tspan>
      </text>
      <text
        x="185"
        y="16"
        fontFamily="Arial, sans-serif"
        fontSize="11"
        fill="#11284a"
      >
        ™
      </text>
    </svg>
  );
};

export { AMPMLogo };
export default AMPMLogo;
