
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-10 h-10", showText = true, textClassName = "text-2xl font-display font-black tracking-tighter" }) => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform">
      <div className={`${className} relative flex items-center justify-center`}>
        {/* Soft Modern Icon */}
        <div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-300"></div>
        <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center shadow-lg relative z-10">
          <i className="fa-solid fa-layer-group text-indigo-600 text-lg group-hover:scale-110 transition-transform"></i>
        </div>
      </div>
      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <span className="text-white leading-none">
            Social<span className="text-indigo-400">Stack</span>
          </span>
          <span className="text-[10px] uppercase font-sans font-bold tracking-[0.3em] text-slate-500 mt-1">
            Global Core
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
