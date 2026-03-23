import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBg?: boolean;
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md', darkBg = false }) => {
  const configs = {
    sm: { width: 130, height: 38, fontSize: 32, tmSize: 10, tmX: 122, tmY: 10 },
    md: { width: 175, height: 52, fontSize: 44, tmSize: 11, tmX: 165, tmY: 14 },
    lg: { width: 220, height: 65, fontSize: 55, tmSize: 13, tmX: 207, tmY: 17 },
  };

  const c = configs[size];
  const pmColor = darkBg ? '#ffffff' : '#11284a';
  const colonColor = darkBg ? '#ffffff' : '#11284a';

  return (
    <svg
      width={c.width}
      height={c.height}
      viewBox={`0 0 ${c.width} ${c.height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      <text
        x="2"
        y={c.height - 8}
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize={c.fontSize}
        letterSpacing="-1"
      >
        <tspan fill="#e87200">am</tspan>
        <tspan fill={colonColor}>:</tspan>
        <tspan fill={pmColor}>pm</tspan>
      </text>
      <text
        x={c.tmX}
        y={c.tmY}
        fontFamily="Arial, sans-serif"
        fontSize={c.tmSize}
        fill={pmColor}
      >
        ™
      </text>
    </svg>
  );
};

export { AMPMLogo };
export default AMPMLogo;
