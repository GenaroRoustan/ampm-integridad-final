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
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      {/* SOL */}
      <g transform="translate(18, 40)">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => (
          <line key={i}
            x1={Math.cos((angle*Math.PI)/180)*13} y1={Math.sin((angle*Math.PI)/180)*13}
            x2={Math.cos((angle*Math.PI)/180)*18} y2={Math.sin((angle*Math.PI)/180)*18}
            stroke="#e87200" strokeWidth="3" strokeLinecap="round"
          />
        ))}
        <circle cx="0" cy="0" r="9" fill="#e87200" />
      </g>

      {/* TEXTO am:pm */}
      <text x="36" y="52" fontFamily="'Arial Black','Arial',sans-serif" fontWeight="900" fontSize="36" letterSpacing="-1">
        <tspan fill="#e87200">am</tspan>
        <tspan fill="#11284a">:</tspan>
        <tspan fill="#11284a">pm</tspan>
      </text>

      {/* LUNA */}
      <g transform="translate(181, 40)">
        <path d="M 0 -18 A 18 18 0 1 1 0 18 A 12 18 0 1 0 0 -18 Z" fill="#11284a" />
      </g>

      {/* TM */}
      <text x="188" y="24" fontFamily="Arial,sans-serif" fontSize="9" fill="#11284a">™</text>
    </svg>
  );
}

export default AMPMLogo;
