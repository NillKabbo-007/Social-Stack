
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
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 hover:border-slate-500/50 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}22` }}>
          <i className={`fa-solid ${icon}`} style={{ color }}></i>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold">{value}</h3>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          <i className={`fa-solid ${isPositive ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
