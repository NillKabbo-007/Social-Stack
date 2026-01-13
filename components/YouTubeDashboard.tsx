
import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid, 
  BarChart, Bar, YAxis, Legend 
} from 'recharts';
import { getYoutubeAnalytics } from '../services/geminiService';

const VIDEO_VIEWS_DATA = [
    { name: 'Mon', views: 42000 },
    { name: 'Tue', views: 38000 },
    { name: 'Wed', views: 65000 },
    { name: 'Thu', views: 51000 },
    { name: 'Fri', views: 72000 },
    { name: 'Sat', views: 84000 },
    { name: 'Sun', views: 91000 },
];

const YouTubeDashboard: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
        setIsConnected(savedApps.includes('youtube'));
        if (savedApps.includes('youtube')) loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const analytics = await getYoutubeAnalytics();
        setData(analytics);
        setLoading(false);
    };

    const handleDownloadReport = () => {
        alert("Generating channel growth report (PDF)...");
        setTimeout(() => alert("Channel_Growth_2026.pdf ready."), 1500);
    };

    const handleConnect = () => {
        const width = 600, height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open('', 'YouTube Auth', `width=${width},height=${height},top=${top},left=${left}`);
        if(popup) {
            popup.document.write(`
                <html><body style="background:#f9f9f9;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;">
                <i class="fa-brands fa-youtube" style="color:#FF0000;font-size:40px;margin-bottom:20px;"></i>
                <h2>Sign in with Google</h2><p>Authorize Social Stack to access channel metrics.</p>
                <div style="border:4px solid #f3f3f3;border-top-color:#FF0000;border-radius:50%;width:30px;height:30px;animation:spin 1s linear infinite;"></div>
                <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                </body></html>
            `);
            setTimeout(() => {
                popup.close();
                const savedApps = JSON.parse(localStorage.getItem('socialstack_connected_apps') || '[]');
                if(!savedApps.includes('youtube')) localStorage.setItem('socialstack_connected_apps', JSON.stringify([...savedApps, 'youtube']));
                setIsConnected(true);
                loadData();
            }, 2500);
        }
    };

    if (!isConnected) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-10 animate-in fade-in duration-500">
                <div className="w-32 h-32 bg-[#FF0000] rounded-[2.5rem] flex items-center justify-center text-7xl text-white shadow-2xl border-4 border-white/10"><i className="fa-brands fa-youtube"></i></div>
                <button onClick={handleConnect} className="px-10 py-5 bg-[#FF0000] text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-red-900/20 flex items-center gap-4 btn-3d"><i className="fa-solid fa-link"></i> Authorize Channel</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-r from-[#FF0000] to-[#990000] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-full p-1 bg-white">
                        <img src="https://ui-avatars.com/api/?name=Social+Stack+YT&background=000&color=fff" className="w-full h-full rounded-full border-4 border-red-600 object-cover" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-2">Studio Hub <i className="fa-solid fa-circle-check text-white text-lg"></i></h2>
                        <p className="text-red-200 font-bold uppercase text-xs tracking-widest mt-1">Global Node Active</p>
                    </div>
                </div>
                <div className="flex gap-3 relative z-10">
                    <button onClick={handleDownloadReport} className="px-5 py-3 bg-white text-red-600 rounded-xl font-bold uppercase text-xs flex items-center gap-2 shadow-lg">
                        <i className="fa-solid fa-file-pdf"></i> Download Report
                    </button>
                    <button onClick={() => loadData()} className="px-5 py-3 bg-red-800 text-white rounded-xl font-bold uppercase text-xs flex items-center gap-2 shadow-lg">
                        <i className="fa-solid fa-rotate"></i> Sync Data
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel p-8 rounded-3xl border-slate-700/50 h-[450px]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Growth Velocity</h3>
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={VIDEO_VIEWS_DATA}><XAxis dataKey="name" hide /><Tooltip /><Bar dataKey="views" fill="#FF0000" radius={[6, 6, 0, 0]} /></BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Content Nodes</h3>
                            <button onClick={() => alert("Downloading metadata export (XLSX) for all channel videos...")} className="text-[10px] font-black text-indigo-400 uppercase flex items-center gap-2"><i className="fa-solid fa-file-excel"></i> Export Video Data</button>
                        </div>
                        <div className="grid gap-4">
                            {data?.recentVideos.map((vid: any) => (
                                <div key={vid.id} className="glass-panel p-4 rounded-2xl border-slate-800 hover:border-red-600/50 transition-all group flex gap-6">
                                    <div className="w-40 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0 relative">
                                        <img src={vid.thumbnail} className="w-full h-full object-cover opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); alert("Downloading thumbnail as high-res PNG..."); }} className="w-8 h-8 bg-white text-red-600 rounded-full flex items-center justify-center"><i className="fa-solid fa-download text-xs"></i></button>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white mb-2">{vid.title}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">{vid.views} Views • {vid.likes} Likes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] border-red-500/20 bg-red-950/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Revenue Pulse</h3>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-5xl font-black text-white glowing-text">${data?.revenue.toLocaleString() || '...'}</span>
                        </div>
                        <button className="w-full mt-6 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 btn-3d">
                            <i className="fa-solid fa-chart-pie"></i> Detailed Monetization
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeDashboard;
