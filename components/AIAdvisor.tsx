import React, { useState, useEffect } from 'react';
import { getMarketingInsights, generateSpeech } from '../services/geminiService';
import { PLATFORMS, ROI_DATA } from '../constants';

const AIAdvisor: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [useSearch, setUseSearch] = useState(true);
  const [useThinking, setUseThinking] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    const aggregatedData = { platforms: PLATFORMS, roi: ROI_DATA };
    const { results, sources: groundingSources } = await getMarketingInsights(aggregatedData, useSearch, useThinking);
    setInsights(results);
    setSources(groundingSources);
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Strategic Advisor Hub</h2>
          <p className="text-slate-400 text-sm font-medium">Deep reasoning analysis powered by Gemini 3 Pro & Grounding Engine.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/50">
             <button onClick={() => setUseSearch(!useSearch)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${useSearch ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                <i className="fa-brands fa-google"></i> Search Trends
             </button>
             <button onClick={() => setUseThinking(!useThinking)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${useThinking ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                <i className="fa-solid fa-microchip"></i> Reasoning
             </button>
          </div>
          <button onClick={fetchInsights} disabled={loading} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50">
            {loading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-bolt mr-2"></i>}
            Refresh Strategy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="glass-panel h-80 rounded-[2.5rem] animate-pulse bg-slate-800/20"></div>)
        ) : insights.length > 0 ? (
          insights.map((item, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 flex flex-col justify-between hover:border-indigo-500/50 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <i className={`fa-solid ${item.category.includes('Search') ? 'fa-magnifying-glass-chart' : item.category.includes('Viral') ? 'fa-video' : 'fa-hand-holding-dollar'} text-8xl text-indigo-400`}></i>
               </div>
               
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="px-3 py-1 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                        {item.category}
                     </span>
                     <button onClick={() => generateSpeech(`${item.insight}. Suggested step: ${item.action}`)} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-indigo-400 transition-all">
                        <i className="fa-solid fa-volume-high text-xs"></i>
                     </button>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-white leading-tight mb-3">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-4">{item.insight}</p>
                  </div>

                  <div className="p-5 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl">
                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-play text-[8px]"></i> Tactical Step
                     </p>
                     <p className="text-[11px] text-white font-bold leading-relaxed">{item.action}</p>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center glass-panel rounded-[3rem] border-dashed border-slate-800">
             <i className="fa-solid fa-brain-circuit text-6xl text-slate-800 mb-6"></i>
             <p className="text-slate-500 font-black uppercase tracking-widest">Execute AI Node for Strategy Manifest</p>
          </div>
        )}
      </div>

      {sources.length > 0 && !loading && (
        <div className="glass-panel p-8 rounded-[2.5rem] border-slate-700/50 space-y-6">
           <div className="flex items-center gap-3">
              <i className="fa-solid fa-link text-indigo-400"></i>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grounding Citations & Sources</h4>
           </div>
           <div className="flex flex-wrap gap-3">
              {sources.map((src, i) => src.web && (
                <a key={i} href={src.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 px-4 py-2.5 rounded-2xl hover:bg-slate-800 hover:border-indigo-500/30 transition-all text-xs font-bold text-slate-300">
                   <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center text-[10px]"><i className="fa-solid fa-link"></i></div>
                   {src.web.title || "External Source"}
                </a>
              ))}
           </div>
        </div>
      )}

      <div className="glass-panel p-10 rounded-[3rem] border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-transparent flex flex-col md:flex-row items-center gap-10">
         <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl text-white shadow-2xl flex-shrink-0">
            <i className="fa-solid fa-lightbulb"></i>
         </div>
         <div className="flex-1 space-y-2">
            <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tighter">Need a Custom Road Map?</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-2xl">Use the Strategic Command Hub on your dashboard for granular budget pivots and viral sound forecasting specifically for your connected nodes.</p>
         </div>
         <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 whitespace-nowrap">
            Back to Command
         </button>
      </div>
    </div>
  );
};

export default AIAdvisor;
