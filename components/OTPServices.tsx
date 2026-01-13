
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { OTP_DATA } from '../constants';

const OTPServices: React.FC<{ onBuy: (item: any) => void }> = ({ onBuy }) => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryFilters, setSelectedCountryFilters] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5]); // Default range 0-5
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const allCountries = useMemo(() => {
    const countries = new Set<string>();
    OTP_DATA.forEach(item => item.countries.forEach(c => countries.add(c)));
    return Array.from(countries).sort();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOTP = useMemo(() => {
    let result = OTP_DATA.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = selectedCountryFilters.length === 0 || 
        item.countries.some(c => selectedCountryFilters.includes(c));
      const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
      return matchesSearch && matchesCountry && matchesPrice;
    });

    if (priceSort) {
      result.sort((a, b) => priceSort === 'asc' ? a.price - b.price : b.price - a.price);
    }

    return result;
  }, [searchQuery, selectedCountryFilters, priceSort, priceRange]);

  const toggleCountryFilter = (country: string) => {
    setSelectedCountryFilters(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  const clearFilters = () => {
    setSelectedCountryFilters([]);
    setSearchQuery('');
    setPriceSort(null);
    setPriceRange([0, 5]);
  };

  const QUICK_APPS = ['WhatsApp', 'Google', 'Facebook', 'TikTok', 'Instagram', 'Netflix'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold text-white">Global OTP Hub</h2>
          <p className="text-slate-400 mt-2">Instantly provision temporary numbers for any global application verification. 100% success rate or refund.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
            <input 
              type="text"
              placeholder="Filter by app (e.g. Netflix)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-1 focus:ring-indigo-500 w-full shadow-inner text-white font-medium"
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all w-full sm:w-auto min-w-[180px] ${
                selectedCountryFilters.length > 0 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
              }`}
            >
              <i className="fa-solid fa-earth-americas"></i>
              <span>
                {selectedCountryFilters.length === 0 
                  ? 'Worldwide / All' 
                  : `${selectedCountryFilters.length} Node${selectedCountryFilters.length > 1 ? 's' : ''}`}
              </span>
              <i className={`fa-solid fa-chevron-down ml-auto text-[10px] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-700 bg-slate-900/95 backdrop-blur-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Supply Nodes</span>
                  {selectedCountryFilters.length > 0 && (
                    <button onClick={() => setSelectedCountryFilters([])} className="text-[10px] text-indigo-400 font-black hover:text-white uppercase">Reset Worldwide</button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto p-3 space-y-1 no-scrollbar">
                  {allCountries.map(country => (
                    <label 
                      key={country}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                        selectedCountryFilters.includes(country) ? 'bg-indigo-600/20 text-indigo-300' : 'hover:bg-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <i className="fa-solid fa-location-dot text-[10px]"></i>
                         <span className="text-xs font-bold">{country}</span>
                      </div>
                      <input 
                        type="checkbox"
                        checked={selectedCountryFilters.includes(country)}
                        onChange={() => toggleCountryFilter(country)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-3xl border border-slate-800">
         <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
            {QUICK_APPS.map(app => (
              <button 
                key={app}
                onClick={() => setSearchQuery(app)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${searchQuery === app ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800/40 border-slate-800 text-slate-500 hover:text-slate-300'}`}
              >
                {app}
              </button>
            ))}
         </div>
         
         <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Price:</span>
               <select 
                 value={priceSort || ''} 
                 onChange={(e) => setPriceSort(e.target.value as any || null)}
                 className="bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold uppercase text-white px-2 py-1"
               >
                 <option value="">Default</option>
                 <option value="asc">Low to High</option>
                 <option value="desc">High to Low</option>
               </select>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-500 uppercase">Range: ${priceRange[0]} - ${priceRange[1]}</span>
               <input 
                 type="range" 
                 min="0" 
                 max="5" 
                 step="0.1" 
                 value={priceRange[1]} 
                 onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
                 className="w-24 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOTP.length > 0 ? filteredOTP.map(otp => (
              <button
                key={otp.id}
                onClick={() => {
                  setSelectedService(otp);
                  setSelectedCountry(otp.countries[0]);
                }}
                className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all group relative overflow-hidden ${
                  selectedService?.id === otp.id 
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl' 
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex-shrink-0 flex items-center justify-center text-2xl text-indigo-500 group-hover:text-white transition-all shadow-inner">
                      <i className={`fa-solid ${otp.icon}`}></i>
                   </div>
                   <div className="text-left">
                      <p className="font-black text-white text-sm leading-tight truncate">{otp.name}</p>
                      <p className="text-[9px] text-slate-600 font-black uppercase mt-1 tracking-widest">{otp.countries.length} Regions</p>
                   </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="font-black text-indigo-400 text-base">${otp.price.toFixed(2)}</p>
                </div>
                {selectedService?.id === otp.id && (
                  <div className="absolute top-0 right-0 p-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                )}
              </button>
            )) : (
              <div className="col-span-full py-24 text-center glass-panel rounded-3xl border-dashed border-slate-800 border-2">
                <i className="fa-solid fa-triangle-exclamation text-4xl text-slate-800 mb-6 animate-pulse"></i>
                <p className="text-slate-500 font-black uppercase tracking-widest text-sm">No supply nodes match your filters.</p>
                <button onClick={clearFilters} className="mt-6 text-indigo-400 font-black text-xs uppercase hover:underline decoration-2 underline-offset-8">Reset Deployment Filters</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-3xl border-indigo-500/30 sticky top-24 shadow-2xl bg-gradient-to-br from-indigo-900/20 to-transparent">
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-white uppercase tracking-tighter">
              <i className="fa-solid fa-satellite-dish text-indigo-500"></i> 
              Request Vector
            </h3>
            
            {selectedService ? (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-5 p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                    <i className={`fa-solid ${selectedService.icon} text-2xl`}></i>
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-white leading-none mb-2">{selectedService.name}</h4>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Authentication Node</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Node</label>
                    <span className="text-[10px] text-indigo-500 font-black">{selectedService.countries.length} Sources</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 no-scrollbar pb-2">
                    {selectedService.countries.map((country: string) => (
                      <button
                        key={country}
                        onClick={() => setSelectedCountry(country)}
                        className={`py-4 px-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all ${
                          selectedCountry === country 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl scale-[0.98]' 
                            : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-inner">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Provision Cost</p>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Pool</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-4xl font-black text-white">${selectedService.price.toFixed(2)}</p>
                    <p className="text-[9px] text-slate-600 mb-2 font-black uppercase tracking-widest">USD / Session</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <button 
                    onClick={() => onBuy({ name: `OTP: ${selectedService.name} (${selectedCountry})`, price: selectedService.price })}
                    disabled={!selectedCountry}
                    className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale group"
                  >
                    <i className="fa-solid fa-bolt-lightning group-hover:scale-125 transition-transform"></i>
                    Deploy Session
                  </button>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                      <span>Guaranteed session success</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i>
                      <span>20-minute active provision window</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center space-y-8">
                <div className="w-24 h-24 bg-slate-800/40 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-700 animate-pulse">
                  <i className="fa-solid fa-mobile-retro text-slate-800 text-4xl"></i>
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-black text-slate-700 uppercase tracking-widest italic">Vector Input Required</p>
                   <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">Select an authentication target from the hub to provision your temporary session node.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPServices;
