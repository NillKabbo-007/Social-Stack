
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true, textClassName = "text-2xl font-heading font-black text-white tracking-tight" }) => {
  return (
    <div className="flex items-center gap-3 group select-none cursor-pointer">
      <div className={`${className} relative flex items-center justify-center transform group-hover:scale-110 transition-all duration-500 ease-out icon-4d rounded-xl bg-slate-900/20 backdrop-blur-sm p-1 border border-white/5`}>
        {/* 3D Isometric Stack Logo SVG */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Blue Layer Gradients */}
            <linearGradient id="blueSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#1e3a8a" /><stop offset="1" stopColor="#172554" /></linearGradient>
            <linearGradient id="blueTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3b82f6" /><stop offset="1" stopColor="#2563eb" /></linearGradient>
            <linearGradient id="blueLight" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#60a5fa" stopOpacity="0.5" /><stop offset="1" stopColor="#3b82f6" stopOpacity="0" /></linearGradient>

            {/* Green Layer Gradients */}
            <linearGradient id="greenSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#065f46" /><stop offset="1" stopColor="#064e3b" /></linearGradient>
            <linearGradient id="greenTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#10b981" /><stop offset="1" stopColor="#059669" /></linearGradient>
            <linearGradient id="greenLight" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#34d399" stopOpacity="0.5" /><stop offset="1" stopColor="#10b981" stopOpacity="0" /></linearGradient>

            {/* Rose/Pink Layer Gradients */}
            <linearGradient id="roseSide" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9f1239" /><stop offset="1" stopColor="#881337" /></linearGradient>
            <linearGradient id="roseTop" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f43f5e" /><stop offset="1" stopColor="#e11d48" /></linearGradient>
            <linearGradient id="roseLight" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fb7185" stopOpacity="0.5" /><stop offset="1" stopColor="#f43f5e" stopOpacity="0" /></linearGradient>
            
            {/* Global Shine */}
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.5" stopColor="white" stopOpacity="0.6" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Bottom Layer (Blue) */}
          <path d="M50 95 L15 75 L15 55 L50 75 Z" fill="url(#blueSide)" />
          <path d="M50 95 L85 75 L85 55 L50 75 Z" fill="#172554" />
          <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#blueTop)" />
          <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#blueLight)" style={{mixBlendMode: 'overlay'}} />

          {/* Middle Layer (Green) */}
          <g transform="translate(0, -20)">
            <path d="M50 95 L15 75 L15 55 L50 75 Z" fill="url(#greenSide)" />
            <path d="M50 95 L85 75 L85 55 L50 75 Z" fill="#064e3b" />
            <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#greenTop)" />
            <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#greenLight)" style={{mixBlendMode: 'overlay'}} />
          </g>

          {/* Top Layer (Rose) */}
          <g transform="translate(0, -40)">
            <path d="M50 95 L15 75 L15 55 L50 75 Z" fill="url(#roseSide)" />
            <path d="M50 95 L85 75 L85 55 L50 75 Z" fill="#881337" />
            <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#roseTop)" />
            <path d="M50 75 L15 55 L50 35 L85 55 Z" fill="url(#roseLight)" style={{mixBlendMode: 'overlay'}} />
            
            {/* Shine Overlay on Top Layer */}
            <rect x="0" y="0" width="100" height="100" fill="url(#shine)" className="animate-shimmer opacity-30" style={{ mixBlendMode: 'overlay' }} />
          </g>
        </svg>
      </div>
      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <span className="leading-none bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 animate-shimmer bg-[length:200%_auto]">
            Social
          </span>
          <span className="leading-none text-white drop-shadow-md tracking-widest text-[0.6em] opacity-80 uppercase font-sans">
            Stack
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
