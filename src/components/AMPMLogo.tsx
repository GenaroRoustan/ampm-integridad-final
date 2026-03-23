import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBg?: boolean;
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md', darkBg = false }) => {
  const heights = { sm: 36, md: 52, lg: 68 };
  const h = heights[size];
  const w = h * 3.2;
  const NAVY = darkBg ? '#ffffff' : '#2b2d5b';

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 320 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      {/* SOL - paréntesis izquierdo, rayos irregulares cortos */}
      <g transform="translate(34,50)">
        {/* Rayos del sol - 12 rayos puntiagudos como el logo real */}
        <polygon points="0,-32 -4,-22 4,-22" fill="#ee2e24"/>
        <polygon points="22,-23 14,-17 18,-9" fill="#ee2e24"/>
        <polygon points="32,0 22,-4 22,4" fill="#ee2e24"/>
        <polygon points="22,23 18,9 14,17" fill="#ee2e24"/>
        <polygon points="0,32 4,22 -4,22" fill="#ee2e24"/>
        <polygon points="-22,23 -14,17 -18,9" fill="#ee2e24"/>
        <polygon points="-32,0 -22,4 -22,-4" fill="#ee2e24"/>
        <polygon points="-22,-23 -18,-9 -14,-17" fill="#ee2e24"/>
        <polygon points="12,-29 8,-19 16,-17" fill="#ee2e24"/>
        <polygon points="29,-12 19,-10 17,-18" fill="#ee2e24"/>
        <polygon points="29,12 17,18 19,10" fill="#ee2e24"/>
        <polygon points="12,29 16,17 8,19" fill="#ee2e24"/>
        <polygon points="-12,-29 -16,-17 -8,-19" fill="#ee2e24"/>
        <polygon points="-12,29 -8,19 -16,17" fill="#ee2e24"/>
        {/* Círculo del sol */}
        <circle cx="0" cy="0" r="20" fill="#ee2e24"/>
      </g>

      {/* TEXTO am:pm */}
      <text
        x="66"
        y="76"
        fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
        fontWeight="900"
        fontSize="68"
        letterSpacing="-2"
      >
        <tspan fill="#ee2e24">am</tspan>
        <tspan fill={NAVY}>:</tspan>
        <tspan fill={NAVY}>pm</tspan>
      </text>

      {/* LUNA - paréntesis derecho */}
      <path
        d="M 288,18 A 32,32 0 1,1 288,82 A 22,32 0 1,0 288,18 Z"
        fill={NAVY}
      />

      {/* TM */}
      <text x="302" y="24" fontFamily="Arial,sans-serif" fontSize="14" fill={NAVY}>™</text>
    </svg>
  );
};

export { AMPMLogo };
export default AMPMLogo;
