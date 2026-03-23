import React from 'react';
interface AMPMLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
const AMPMLogo: React.FC<AMPMLogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: { width: 120, height: 48 },
    md: { width: 180, height: 72 },
    lg: { width: 240, height: 96 },
  };
  const { width, height } = sizes[size];
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 96"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="am:pm logo"
    >
      <g transform="translate(22, 48)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <line
            key={i}
            x1={Math.cos((angle * Math.PI) / 180) * 16}
            y1={Math.sin((angle * Math.PI) / 180) * 16}
            x2={Math.cos((angle * Math.PI) / 180) * 22}
            y2={Math.sin((angle * Math.PI) / 180) * 22}
            stroke="#ee2e24"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        <circle cx="0" cy="0" r="11" fill="#ee2e24" />
      </g>
      <text x="48" y="62" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="42" fill="#ee2e24" letterSpacing="-1">am</text>
      <text x="118" y="62" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="42" fill="#2b2d5b">:</text>
      <text x="134" y="62" fontFamily="'Arial Black', 'Arial', sans-serif" fontWeight="900" fontSize="42" fill="#2b2d5b" letterSpacing="-1">pm</text>
      <g transform="translate(218, 48)">
        <path d="M 0 -22 A 22 22 0 1 1 0 22 A 14 14 0 1 0 0 -22 Z" fill="#2b2d5b" />
      </g>
      <text x="228" y="30" fontFamily="Arial, sans-serif" fontSize="10" fill="#2b2d5b">™</text>
    </svg>
  );
};
export { AMPMLogo };
export default AMPMLogo;
