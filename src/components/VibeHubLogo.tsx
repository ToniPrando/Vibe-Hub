import React from 'react';
import { useApp } from '../context/AppContext';

interface VibeHubLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'horizontal' | 'mark';
  className?: string;
  onClick?: () => void;
}

export const VibeHubLogo: React.FC<VibeHubLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  variant = 'horizontal',
  className = '',
  onClick
}) => {
  let customLogoMedia = null;
  try {
    const ctx = useApp();
    customLogoMedia = ctx.customLogoMedia;
  } catch {
    // Fallback if rendered outside of AppProvider
  }

  // Dimension mapping
  const markDimensions = {
    sm: 36,
    md: 46,
    lg: 72,
    xl: 120
  };

  const currentMarkSize = markDimensions[size];

  // Custom photo or video element if configured in Admin Panel
  const CustomMediaElement = customLogoMedia ? (
    customLogoMedia.type === 'video' ? (
      <div
        className="relative shrink-0 rounded-full overflow-hidden border-2 border-sky-400 shadow-md transition-transform duration-300 hover:scale-105 bg-slate-900 group/media"
        style={{ width: currentMarkSize, height: currentMarkSize }}
      >
        <video
          src={customLogoMedia.url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div
        className="relative shrink-0 rounded-full overflow-hidden border-2 border-sky-400 shadow-md transition-transform duration-300 hover:scale-105 bg-slate-100 dark:bg-slate-800"
        style={{ width: currentMarkSize, height: currentMarkSize }}
      >
        <img
          src={customLogoMedia.url}
          alt="Logotipo personalizado Vibe Hub"
          className="w-full h-full object-cover"
        />
      </div>
    )
  ) : null;

  // SVG Mark that faithfully echoes the attached logo:
  // - Vibrant blue globe with continents
  // - Big bold 'V' in yellow-to-orange-red gradient
  // - Big bold 'H' in cyan-to-royal-blue gradient
  // - Glowing golden-amber orbital ring
  const DefaultLogoEmblem = (
    <svg
      width={currentMarkSize}
      height={currentMarkSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md transition-transform duration-300 hover:scale-105"
      role="img"
      aria-label="Vibe Hub Emblem"
    >
      <defs>
        {/* Globe Base Ocean Gradient */}
        <radialGradient id="oceanGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="30%" stopColor="#0284c7" />
          <stop offset="70%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c2340" />
        </radialGradient>

        {/* Globe Atmosphere Glow */}
        <radialGradient id="atmoGlow" cx="50%" cy="50%" r="50%">
          <stop offset="85%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="98%" stopColor="#67e8f9" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
        </radialGradient>

        {/* Continent Green Gradient */}
        <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Letter 'V' Warm Gradient (Yellow -> Orange -> Coral Red) */}
        <linearGradient id="vGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="18%" stopColor="#facc15" />
          <stop offset="65%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>

        {/* Letter 'H' Cool Gradient (Cyan -> Sky Blue -> Deep Blue) */}
        <linearGradient id="hGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="35%" stopColor="#38bdf8" />
          <stop offset="75%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Orbit Ring Gradient */}
        <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="45%" stopColor="#fb923c" />
          <stop offset="70%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Drop shadow filters */}
        <filter id="letterShadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#061226" floodOpacity="0.75" />
        </filter>
      </defs>

      {/* Globe Outer Border & Glow */}
      <circle cx="100" cy="100" r="92" fill="#0b1b36" stroke="#0284c7" strokeWidth="4" />
      <circle cx="100" cy="100" r="90" fill="url(#oceanGrad)" />

      {/* Continents / Land Masses (Vibrant Green) */}
      <path
        d="M 50 45 Q 65 30, 95 38 Q 110 42, 130 35 Q 155 30, 165 55 Q 160 75, 140 85 Q 125 90, 115 75 Q 95 65, 80 80 Q 60 85, 45 70 Z"
        fill="url(#landGrad)"
        opacity="0.95"
      />
      <path
        d="M 135 70 Q 160 80, 178 105 Q 185 130, 165 155 Q 150 170, 125 178 Q 110 160, 120 140 Q 130 115, 125 95 Z"
        fill="url(#landGrad)"
        opacity="0.92"
      />
      <path
        d="M 35 105 Q 48 115, 55 135 Q 60 165, 85 175 Q 75 185, 55 180 Q 30 165, 25 140 Q 22 120, 35 105 Z"
        fill="url(#landGrad)"
        opacity="0.95"
      />

      {/* Atmosphere overlay shine */}
      <circle cx="100" cy="100" r="90" fill="url(#atmoGlow)" />

      {/* The Dynamic Orbiting Ring (back segment) */}
      <path
        d="M 25 110 C 20 85, 150 45, 182 82"
        stroke="url(#orbitGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Group of 3D VH Monogram with shadow */}
      <g filter="url(#letterShadow)">
        {/* Left pillar of H */}
        <polygon
          points="88,52 118,52 108,138 78,138"
          fill="url(#hGrad)"
          stroke="#071b33"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right pillar of H */}
        <polygon
          points="132,52 162,52 152,138 122,138"
          fill="url(#hGrad)"
          stroke="#071b33"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Crossbar of H */}
        <polygon
          points="102,88 136,88 134,106 100,106"
          fill="url(#hGrad)"
          stroke="#071b33"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* The 'V' Letter in Warm Yellow / Orange / Red (interlocking in front) */}
        <polygon
          points="32,50 64,50 94,124 104,124 134,50 102,50 82,100"
          fill="url(#vGrad)"
          stroke="#071b33"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>

      {/* The Dynamic Orbiting Ring (front swoosh segment across VH) */}
      <path
        d="M 182 82 C 190 98, 140 142, 28 114"
        stroke="url(#orbitGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  const LogoEmblem = CustomMediaElement || DefaultLogoEmblem;

  // If mark only is requested
  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center cursor-pointer ${className}`} onClick={onClick}>
        {LogoEmblem}
      </div>
    );
  }

  // Full Badge Variant (like the round badge with ribbon)
  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center select-none text-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        <div className="relative">
          {LogoEmblem}
          {/* Circular glow backdrop */}
          <div className="absolute inset-0 rounded-full bg-sky-500/10 blur-xl -z-10 pointer-events-none" />
        </div>

        {/* Vibe Hub Wordmark */}
        <div className="mt-2 flex items-baseline justify-center tracking-tight font-extrabold font-display">
          <span className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm">
            Vibe
          </span>
          <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-amber-400 via-orange-500 to-sky-500 bg-clip-text text-transparent">
            Hub
          </span>
        </div>

        {/* Badge Ribbon */}
        {showSubtitle && (
          <div className="mt-1 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-950 border border-sky-500/40 shadow-sm flex items-center gap-1.5 text-[9px] font-semibold tracking-wider uppercase text-slate-200">
            <span>NOTÍCIAS</span>
            <span className="text-orange-400">●</span>
            <span>NOVIDADES</span>
            <span className="text-sky-400">●</span>
            <span>ASSUNTOS DO MOMENTO</span>
          </div>
        )}
      </div>
    );
  }

  // Default: Horizontal Header Lockup
  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      onClick={onClick}
    >
      {LogoEmblem}
      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className={`${textSizeMap[size]} font-black tracking-tight font-display text-slate-900 dark:text-white transition-colors group-hover:text-sky-600 dark:group-hover:text-sky-400`}>
            Vibe
          </span>
          <span className={`${textSizeMap[size]} font-black tracking-tight font-display bg-gradient-to-r from-amber-500 via-orange-500 to-sky-500 bg-clip-text text-transparent ml-0.5`}>
            Hub
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium mt-0.5 whitespace-nowrap">
            Notícias & Novidades
          </span>
        )}
      </div>
    </div>
  );
};
