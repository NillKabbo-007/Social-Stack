
import React, { useState } from 'react';

const MOCK_CONTENT = [
  { id: 1, type: 'video', platform: 'TikTok', title: 'Why 2024 is the year of organic video', source: 'ViralNode', likes: '1.2M', views: '15M', url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=400' },
  { id: 2, type: 'post', platform: 'Instagram', title: 'Top 10 minimalist desk setups for developers', source: 'DesignHub', likes: '45k', views: '200k', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400' },
  { id: 3, type: 'video', platform: 'YouTube', title: 'Gemini 2.5 vs GPT-5: The truth about LLMs', source: 'TechReview', likes: '120k', views: '2.5M', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400' },
  { id: 4, type: 'video', platform: 'Facebook', title: 'How this simple marketing trick doubled our revenue', source: 'SaaSGrowth', likes: '2k', views: '12k', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400' },
  { id: 5, type: 'video', platform: 'TikTok', title: 'The secret to hooking Gen Z in 3 seconds', source: 'MarketingGeek', likes: '800k', views: '4M', url: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=400' },
  { id: 6, type: 'post', platform: 'Instagram', title: 'AI-first workflow: My daily routine', source: 'ProductiveDev', likes: '12k', views: '80k', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
];

const EntertainmentHub: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const platforms = ['All', 'TikTok', 'Instagram', 'YouTube', 'Facebook'];

  const filteredContent = filter === 'All' 
    ? MOCK_CONTENT 
    : MOCK_CONTENT.filter(c => c.platform === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Content Discovery</h2>
          <p className="text-slate-400">Discover viral trends and entertainment ideas across the social graph.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all border ${
                filter === p 
                  ? 'bg-indigo-600 border-indigo-500 text-white' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => (
          <div key={item.id} className="glass-panel rounded-3xl overflow-hidden group hover:border-indigo-500/50 transition-all cursor-pointer">
            <div className="h-48 relative overflow-hidden">
               <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
               <div className="absolute top-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                  {item.platform}
               </div>
               {item.type === 'video' && (
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-white">
                       <i className="fa-solid fa-play"></i>
                    </div>
                 </div>
               )}
            </div>
            <div className="p-6 space-y-4">
               <h3 className="font-bold text-white line-clamp-2 leading-tight">{item.title}</h3>
               <div className="flex items-center justify-between border-t border-slate-700/50 pt-4 text-slate-500 text-[10px] font-bold">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><i className="fa-solid fa-heart text-rose-500"></i> {item.likes}</span>
                    <span className="flex items-center gap-1"><i className="fa-solid fa-eye text-indigo-400"></i> {item.views}</span>
                  </div>
                  <span className="uppercase tracking-widest">{item.source}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-10 rounded-3xl bg-gradient-to-br from-indigo-900/20 via-slate-900 to-transparent flex flex-col items-center text-center space-y-6">
         <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 text-2xl">
            <i className="fa-solid fa-lightbulb"></i>
         </div>
         <div className="space-y-2">
            <h3 className="text-xl font-bold">Need more inspiration?</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">Our AI can analyze current trending topics and suggest a viral content plan for your specific niche.</p>
         </div>
         <button className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
            Generate Strategy
         </button>
      </div>
    </div>
  );
};

export default EntertainmentHub;
