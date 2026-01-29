
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-700/50 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <Logo />
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            The unified command center for performance-driven growth teams. Orchestrate your digital ecosystem with proprietary intelligence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Infrastructure</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Network Nodes</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Cloud Compute</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">API Services</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Intelligence Hub</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Strategy Lab</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">API Documentation</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Governance</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="/privacy.html" target="_blank" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/cookies.html" target="_blank" className="hover:text-indigo-400 transition-colors">Cookie Manifesto</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-4">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          © 2026 Social Stack Global. All system protocols active.
        </p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            Status: <span className="text-emerald-500">Operational Node</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
