
import React, { useState } from 'react';

const ChildPanel: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-4xl">
        <h2 className="text-3xl font-extrabold">Start Your Own SMM Business</h2>
        <p className="text-slate-400 mt-2">Get a white-label Child Panel with your own domain, branding, and customized rates. We handle the technical heavy lifting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-panel p-8 rounded-3xl border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-transparent flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl font-bold">White-Label Solution</h3>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-white">$25.00</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">per month</p>
              </div>
            </div>

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
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="www.yourpanel.com" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
            <button className="w-full py-4 bg-indigo-600 rounded-xl font-extrabold shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">
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
                <h4 className="font-bold text-sm mb-1">{box.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dashed border-slate-700 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 text-2xl">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <div>
              <h4 className="font-bold text-lg leading-tight">Ready to scale?</h4>
              <p className="text-sm text-slate-400">Child panels are the fastest way to start reselling SMM services without coding.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildPanel;
