
import React from 'react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, trend, icon, color }) => {
  const isPositive = trend >= 0;

  return (
    <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between h-40 group hover:border-white/20 transition-all cursor-default select-none border-slate-700/40">
      <div className="flex justify-between items-start">
        <div>
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg border border-white/5" style={{ backgroundColor: `${color}15`, color }}>
          <i className={`${icon} text-xl`}></i>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-end justify-between">
            <h3 className="text-2xl font-display font-black text-white leading-none">{value}</h3>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
            <i className={`fa-solid ${isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
            <span>{Math.abs(trend)}%</span>
            </div>
        </div>
        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Real-time Node Status</p>
      </div>
    </div>
  );
};

export default SummaryCard;
