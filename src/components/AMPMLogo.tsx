import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBg?: boolean;
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md', darkBg = false }) => {
  const configs = {
    sm:  { w: 160, h: 52,  fs: 36, sol: 18, solX: 20,  solY: 26, textX: 34,  textY: 40, tmX: 148, tmY: 12, tmFs: 9  },
    md:  { w: 220, h: 72,  fs: 50, sol: 25, solX: 27,  solY: 36, textX: 46,  textY: 55, tmX: 204, tmY: 16, tmFs: 11 },
    lg:  { w: 280, h: 90,  fs: 62, sol: 31, solX: 34,  solY: 45, textX: 58,  textY: 68, tmX: 260, tmY: 20, tmFs: 13 },
  };

  const c = configs[size];
  const RED = '#ee2e24';
  const NAVY = darkBg ? '#ffffff' : '#2b2d5b';

  // Rayos del sol: 8 rayos puntiagudos irregulares como en el logo real
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 360) / 8 - 90;
    const rad = (angle * Math.PI) / 180;
    const radL = ((angle - 12) * Math.PI) / 180;
    const radR = ((angle + 12) * Math.PI) / 180;
    const inner = c.sol * 0.62;
    const outer = c.sol * 1.45;
    return `${c.solX + Math.cos(rad) * outer},${c.solY + Math.sin(rad) * outer} ${c.solX + Math.cos(radR) * inner},${c.solY + Math.sin(radR) * inner} ${c.solX + Math.cos(radL) * inner},${c.solY + Math.sin(radL) * inner}`;
  });

  return (
    <svg
      width={c.w}
      height={c.h}
      viewBox={`0 0 ${c.w} ${c.h}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      {/* SOL con rayos puntiagudos */}
      <g>
        {rays.map((pts, i) => (
          <polygon key={i} points={pts} fill={RED} />
        ))}
        <circle cx={c.solX} cy={c.solY} r={c.sol * 0.62} fill={RED} />
      </g>

      {/* TEXTO am:pm */}
      <text
        x={c.textX}
        y={c.textY}
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize={c.fs}
        letterSpacing="-1"
      >
        <tspan fill={RED}>am</tspan>
        <tspan fill={NAVY}>:</tspan>
        <tspan fill={NAVY}>pm</tspan>
      </text>

      {/* LUNA - media luna a la derecha */}
      <g>
        <path
          d={`M ${c.w - c.tmX * 0.08} ${c.solY - c.sol * 0.85}
              A ${c.sol * 0.85} ${c.sol * 0.85} 0 1 1 ${c.w - c.tmX * 0.08} ${c.solY + c.sol * 0.85}
              A ${c.sol * 0.58} ${c.sol * 0.85} 0 1 0 ${c.w - c.tmX * 0.08} ${c.solY - c.sol * 0.85}
              Z`}
          fill={NAVY}
          transform={`translate(-${c.sol * 1.1}, 0)`}
        />
      </g>

      {/* TM */}
      <text x={c.tmX} y={c.tmY} fontFamily="Arial, sans-serif" fontSize={c.tmFs} fill={NAVY}>™</text>
    </svg>
  );
};

export { AMPMLogo };
export default AMPMLogo;
