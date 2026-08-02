import React from 'react';

const Logo = ({ className = "w-32", ...props }) => {
  return (
    <svg 
      viewBox="0 0 300 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      {...props}
    >
      {/* Background Dark Green */}
      <rect width="300" height="200" rx="12" fill="#1b3d22" />
      
      {/* Stamp Outer Border (Cream) */}
      <rect x="40" y="30" width="220" height="100" rx="8" fill="#f3e9d2" />
      
      {/* Stamp Inner Dashed Cutouts (Simulating stamp edges) */}
      {/* Top Edge cutouts */}
      <circle cx="50" cy="30" r="4" fill="#1b3d22" />
      <circle cx="70" cy="30" r="4" fill="#1b3d22" />
      <circle cx="90" cy="30" r="4" fill="#1b3d22" />
      <circle cx="110" cy="30" r="4" fill="#1b3d22" />
      <circle cx="130" cy="30" r="4" fill="#1b3d22" />
      <circle cx="150" cy="30" r="4" fill="#1b3d22" />
      <circle cx="170" cy="30" r="4" fill="#1b3d22" />
      <circle cx="190" cy="30" r="4" fill="#1b3d22" />
      <circle cx="210" cy="30" r="4" fill="#1b3d22" />
      <circle cx="230" cy="30" r="4" fill="#1b3d22" />
      <circle cx="250" cy="30" r="4" fill="#1b3d22" />
      
      {/* Bottom Edge cutouts */}
      <circle cx="50" cy="130" r="4" fill="#1b3d22" />
      <circle cx="70" cy="130" r="4" fill="#1b3d22" />
      <circle cx="90" cy="130" r="4" fill="#1b3d22" />
      <circle cx="110" cy="130" r="4" fill="#1b3d22" />
      <circle cx="130" cy="130" r="4" fill="#1b3d22" />
      <circle cx="150" cy="130" r="4" fill="#1b3d22" />
      <circle cx="170" cy="130" r="4" fill="#1b3d22" />
      <circle cx="190" cy="130" r="4" fill="#1b3d22" />
      <circle cx="210" cy="130" r="4" fill="#1b3d22" />
      <circle cx="230" cy="130" r="4" fill="#1b3d22" />
      <circle cx="250" cy="130" r="4" fill="#1b3d22" />

      {/* Left Edge cutouts */}
      <circle cx="40" cy="40" r="4" fill="#1b3d22" />
      <circle cx="40" cy="60" r="4" fill="#1b3d22" />
      <circle cx="40" cy="80" r="4" fill="#1b3d22" />
      <circle cx="40" cy="100" r="4" fill="#1b3d22" />
      <circle cx="40" cy="120" r="4" fill="#1b3d22" />

      {/* Right Edge cutouts */}
      <circle cx="260" cy="40" r="4" fill="#1b3d22" />
      <circle cx="260" cy="60" r="4" fill="#1b3d22" />
      <circle cx="260" cy="80" r="4" fill="#1b3d22" />
      <circle cx="260" cy="100" r="4" fill="#1b3d22" />
      <circle cx="260" cy="120" r="4" fill="#1b3d22" />

      {/* Inner Green Rectangle inside stamp */}
      <rect x="50" y="40" width="200" height="80" rx="4" fill="#2d4f35" />

      {/* Storefront Awning (Orange/Rust and Cream Stripes) */}
      <path d="M 80 50 Q 150 30 220 50 L 230 70 L 70 70 Z" fill="#c4563a" />
      {/* Awning Scallops */}
      <path d="M 70 70 Q 80 80 90 70 Q 100 80 110 70 Q 120 80 130 70 Q 140 80 150 70 Q 160 80 170 70 Q 180 80 190 70 Q 200 80 210 70 Q 220 80 230 70" fill="none" stroke="#c4563a" strokeWidth="10" strokeLinecap="round" />
      {/* Cream Stripes on Awning */}
      <path d="M 95 48 L 100 70 M 125 43 L 130 70 M 155 40 L 155 70 M 185 43 L 180 70 M 215 48 L 210 70" stroke="#f3e9d2" strokeWidth="8" />

      {/* Storefront Windows & Door */}
      <rect x="100" y="85" width="25" height="25" rx="2" fill="#f3e9d2" />
      <rect x="175" y="85" width="25" height="25" rx="2" fill="#f3e9d2" />
      {/* Door */}
      <rect x="135" y="80" width="30" height="40" rx="2" fill="#f3e9d2" />
      {/* Door handles / details */}
      <line x1="150" y1="80" x2="150" y2="120" stroke="#2d4f35" strokeWidth="2" />
      <circle cx="145" cy="100" r="1.5" fill="#2d4f35" />
      <circle cx="155" cy="100" r="1.5" fill="#2d4f35" />

      {/* Window panes */}
      <line x1="112.5" y1="85" x2="112.5" y2="110" stroke="#2d4f35" strokeWidth="2" />
      <line x1="100" y1="97.5" x2="125" y2="97.5" stroke="#2d4f35" strokeWidth="2" />
      <line x1="187.5" y1="85" x2="187.5" y2="110" stroke="#2d4f35" strokeWidth="2" />
      <line x1="175" y1="97.5" x2="200" y2="97.5" stroke="#2d4f35" strokeWidth="2" />

      {/* Text: FLASHFOOD */}
      <text x="150" y="160" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="26" fill="#f3e9d2" textAnchor="middle" letterSpacing="2">
        FLASHFOOD
      </text>

      {/* Text: SINCE 2026 */}
      <text x="150" y="180" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="12" fill="#c4563a" textAnchor="middle" letterSpacing="4">
        SINCE 2026
      </text>
    </svg>
  );
};

export default Logo;
