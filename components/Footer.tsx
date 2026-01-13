
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-700/50 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <Logo />
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            The unified command center for modern growth teams. Scale your digital empire with AI-driven intelligence.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all btn-3d"><i className="fa-brands fa-github"></i></a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Press Kit</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Analytics Node</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Gemini AI</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Bulk Publisher</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">API Docs</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-white uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-500 font-medium">
            <li><a href="/privacy.html" target="_blank" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            <li><a href="/cookies.html" target="_blank" className="hover:text-indigo-400 transition-colors">Cookies Policy</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 gap-4">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          © 2026 Social Stack Technologies. All rights reserved.
        </p>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
          Engineered in <span className="text-slate-400">Silicon Valley</span> & <span className="text-slate-400">Dhaka</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
