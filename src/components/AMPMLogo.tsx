import React from 'react';

interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md' }) => {
  const scales = { sm: 0.6, md: 0.85, lg: 1.1 };
  const scale = scales[size];

  return (
    <svg
      width={320 * scale}
      height={90 * scale}
      viewBox="0 0 320 90"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      {/* SOL con rayos dentados - forma el paréntesis izquierdo ( */}
      <g transform="translate(30, 45)">
        {/* Rayos puntiagudos irregulares del sol */}
        <polygon
          points="
            0,-26  3,-18  0,-22 -3,-18
            10,-24  8,-16  13,-19  7,-13
            20,-15  15,-10  21,-11  14,-6
            24,-2  18,0   24,3   18,2
            20,14  14,8   19,12  13,7
            10,23  8,15   12,20  6,14
            0,26  -3,18  0,22  3,18
            -10,23 -7,14  -12,20 -6,14
            -20,14 -13,8  -19,12 -14,7
            -24,2  -18,0  -24,-2 -18,-2
            -20,-15 -14,-6 -21,-11 -15,-10
            -10,-24 -6,-14 -13,-19 -8,-16
          "
          fill="#e87200"
          opacity="0"
        />
        {/* Rayos como triángulos puntiagudos */}
        {[
          [0, -28, -4, -18, 4, -18],
          [19, -20, 12, -13, 16, -10],
          [27, -3, 17, -1, 17, 3],
          [19, 20, 12, 13, 16, 10],
          [0, 28, -4, 18, 4, 18],
          [-19, 20, -12, 13, -16, 10],
          [-27, -3, -17, -1, -17, 3],
          [-19, -20, -12, -13, -16, -10],
          [10, -26, 6, -16, 14, -16],
          [25, 10, 15, 7, 18, 14],
          [-10, 26, -6, 16, -14, 16],
          [-25, 10, -15, 7, -18, 14],
        ].map(([x1, y1, x2, y2, x3, y3], i) => (
          <polygon
            key={i}
            points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
            fill="#e87200"
          />
        ))}
        {/* Círculo central */}
        <circle cx="0" cy="0" r="13" fill="#e87200" />
      </g>

      {/* Texto am:pm */}
      <text
        x="60"
        y="65"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="52"
        letterSpacing="-2"
      >
        <tspan fill="#e87200">am</tspan>
        <tspan fill="#11284a">:</tspan>
        <tspan fill="#11284a">pm</tspan>
      </text>

      {/* LUNA - forma el paréntesis derecho ) */}
      <g transform="translate(284, 45)">
        <path
          d="M -8,-26 A 26,26 0 1,1 -8,26 A 18,18 0 1,0 -8,-26 Z"
          fill="#11284a"
        />
      </g>

      {/* TM */}
      <text
        x="300"
        y="22"
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
