
import React, { useState, useEffect } from 'react';
import { getDailyNews, getXFeed } from '../services/geminiService';
import { GLOBAL_LANGUAGES } from '../constants';

const NewsHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'breaking' | 'x'>('breaking');
    const [news, setNews] = useState<any[]>([]);
    const [newsLocation, setNewsLocation] = useState('Global');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNews();
    }, [newsLocation, activeTab]);

    const loadNews = async () => {
        setLoading(true);
        if (activeTab === 'breaking') {
            const data = await getDailyNews(newsLocation, 'English');
            setNews(data);
        } else {
            const data = await getXFeed('Marketing Trends');
            setNews(data);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Global Intelligence Hub</h2>
                    <p className="text-slate-400 font-medium">Real-time market signals and industry velocity.</p>
                </div>
                <div className="flex gap-4">
                    <select 
                        value={newsLocation}
                        onChange={(e) => setNewsLocation(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold text-white"
                    >
                        <option value="Global">Global</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                    </select>
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700">
                        <button onClick={() => setActiveTab('breaking')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'breaking' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>World News</button>
                        <button onClick={() => setActiveTab('x')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'x' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>X Trends</button>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-[2.5rem] border-slate-700/50 overflow-hidden shadow-2xl">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 space-y-4">
                        <i className="fa-solid fa-satellite-dish fa-spin text-4xl text-indigo-500"></i>
                        <p className="font-black uppercase tracking-widest">Scanning Global Frequencies...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {news.map((item, i) => (
                            <div key={i} className="p-8 hover:bg-white/5 transition-all group flex gap-6 items-start">
                                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-500 text-xl font-bold border border-white/5 shadow-inner">
                                    {item.source ? item.source[0] : <i className="fa-regular fa-newspaper"></i>}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/10 px-2 py-0.5 rounded">{item.source || 'Global'}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{item.time || 'Live'}</span>
                                    </div>
                                    <h4 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">{item.headline || item.content?.substring(0, 80)}</h4>
                                    <p className="text-sm text-slate-400 leading-relaxed max-w-4xl">{item.summary || item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsHub;
