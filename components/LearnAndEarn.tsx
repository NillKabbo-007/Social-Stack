
import React, { useState } from 'react';

const LearnAndEarn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'academy' | 'affiliate' | 'resell'>('academy');
  const [childPanelDomain, setChildPanelDomain] = useState('');

  const courses = [
    { id: 1, title: 'Mastering TikTok Ads 2026', author: 'Social Stack Academy', duration: '4h 20m', rating: 4.9, level: 'Advanced', image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=400' },
    { id: 2, title: 'Zero to Hero: Dropshipping', author: 'Ecom Expert', duration: '2h 15m', rating: 4.7, level: 'Beginner', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=400' },
    { id: 3, title: 'AI Copywriting Secrets', author: 'Gemini Pro', duration: '1h 30m', rating: 5.0, level: 'Intermediate', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-3xl font-extrabold text-white">Partner Ecosystem</h2>
                <p className="text-slate-400 mt-1">Upgrade your skills, earn from referrals, and launch your own business.</p>
            </div>
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-700 overflow-x-auto no-scrollbar max-w-full">
                <button onClick={() => setActiveTab('academy')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === 'academy' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>Academy</button>
                <button onClick={() => setActiveTab('affiliate')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === 'affiliate' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>Affiliate</button>
                <button onClick={() => setActiveTab('resell')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${activeTab === 'resell' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>White-Label Panel</button>
            </div>
        </div>

        {activeTab === 'academy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-300">
                {courses.map(course => (
                    <div key={course.id} className="glass-panel rounded-3xl overflow-hidden group cursor-pointer hover:border-amber-500/50 transition-all">
                        <div className="h-48 relative overflow-hidden">
                            <img src={course.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">{course.level}</div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center text-black text-xl shadow-xl hover:scale-110 transition-transform"><i className="fa-solid fa-play"></i></div>
                            </div>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                <span>{course.duration}</span>
                                <span className="flex items-center gap-1 text-amber-400"><i className="fa-solid fa-star"></i> {course.rating}</span>
                            </div>
                            <h3 className="font-bold text-white text-lg leading-tight">{course.title}</h3>
                            <p className="text-xs text-slate-400">By {course.author}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'affiliate' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-300">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-8 rounded-3xl border-emerald-500/30 bg-gradient-to-br from-emerald-900/10 to-transparent">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Revenue Dashboard</h3>
                                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mt-1">Affiliate & Creator Fund</p>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-black text-white">$1,240.50</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pending Payout</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                    <span>Referral Target</span>
                                    <span>45 / 100</span>
                                </div>
                                <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <div className="h-full bg-emerald-500 w-[45%] shadow-[0_0_15px_rgba(16,185,129,0.5)] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full animate-shimmer"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                                    <p className="text-2xl font-black text-white">12</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Active Referrals</p>
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                                    <p className="text-2xl font-black text-white">5.2%</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Conversion Rate</p>
                                </div>
                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                                    <p className="text-2xl font-black text-white">$850</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold">Lifetime Earned</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-3xl border-slate-700/50">
                        <h4 className="font-bold text-white mb-4 uppercase text-xs tracking-widest">Your Affiliate Link</h4>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
                            <code className="text-xs text-emerald-400 font-mono truncate">socialstack.io/ref/u/alex99</code>
                            <button className="text-slate-400 hover:text-white"><i className="fa-regular fa-copy"></i></button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">Share this link to earn 20% commission on every subscription purchase made by your referrals.</p>
                    </div>
                    
                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all shadow-lg">
                        Withdraw Funds
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'resell' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-300">
                <div className="glass-panel p-8 rounded-3xl border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-transparent flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-bold text-white">Start Your Own SMM Business</h3>
                      <div className="text-right">
                        <p className="text-3xl font-extrabold text-white">$25.00</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">per month</p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                        Get a fully automated white-label Child Panel. Connect your own domain, set your own prices, and keep 100% of the profits. We handle the technical heavy lifting.
                    </p>

                    <ul className="space-y-4">
                      {[
                        'Your Own Branding & Logo',
                        'Connect Your Custom Domain',
                        'Set Your Own Profit Margins',
                        'Automated API Syncing',
                        '24/7 Technical Support',
                        'Free SSL Certificate'
                      ].map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                          <i className="fa-solid fa-circle-check text-indigo-400"></i>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Your Domain Name</label>
                      <input 
                        type="text" 
                        value={childPanelDomain}
                        onChange={(e) => setChildPanelDomain(e.target.value)}
                        placeholder="www.yourpanel.com" 
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-600" 
                      />
                    </div>
                    <button className="w-full py-4 bg-indigo-600 rounded-xl font-extrabold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all uppercase text-xs tracking-widest">
                      Activate My Panel Now
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: 'fa-globe', title: 'Global Presence', desc: 'Accept users and orders from all over the world.' },
                      { icon: 'fa-gauge-high', title: 'Admin Tools', desc: 'Manage your users, orders, and pricing with ease.' },
                      { icon: 'fa-code-merge', title: 'API Support', desc: 'Your users can connect to your panel via API.' },
                      { icon: 'fa-vault', title: 'Secure Hosting', desc: 'Enterprise-grade security and 99.9% uptime.' }
                    ].map((box, i) => (
                      <div key={i} className="glass-panel p-6 rounded-2xl border-slate-700/50">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                          <i className={`fa-solid ${box.icon}`}></i>
                        </div>
                        <h4 className="font-bold text-sm mb-1 text-white">{box.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{box.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="glass-panel p-8 rounded-3xl border-dashed border-slate-700 flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl">
                      <i className="fa-solid fa-rocket"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-tight text-white">Ready to scale?</h4>
                      <p className="text-sm text-slate-400 mt-1">Child panels are the fastest way to start reselling SMM services without coding.</p>
                    </div>
                  </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default LearnAndEarn;
