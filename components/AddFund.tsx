
import React, { useState } from 'react';
import { GLOBAL_CURRENCIES } from '../constants';

const AddFund: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  const [amount, setAmount] = useState<number>(10);
  const [method, setMethod] = useState<string>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (val: number) => `${currData.symbol}${(val * currData.rate).toFixed(2)}`;
  
  const balanceUSD = 245.80; 

  const handleDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Provision request accepted! ${formatPrice(amount)} will be synced via ${method.toUpperCase()}.`);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'paypal', name: 'PayPal', icon: 'fa-brands fa-paypal', color: 'bg-[#003087] text-white' },
    { id: 'payoneer', name: 'Payoneer', icon: 'fa-solid fa-p', color: 'bg-[#ff4800] text-white' },
    { id: 'wise', name: 'Wise', icon: 'fa-solid fa-w', color: 'bg-[#00b9ff] text-white' },
    { id: 'binance', name: 'Binance Pay', icon: 'fa-brands fa-bitcoin', color: 'bg-[#F0B90B] text-black' },
    { id: 'stripe', name: 'Visa / Mastercard', icon: 'fa-brands fa-stripe', color: 'bg-[#635BFF] text-white' },
    { id: 'perfect', name: 'Perfect Money', icon: 'fa-solid fa-money-bill-transfer', color: 'bg-[#ee1c25] text-white' },
    { id: 'bkash', name: 'bKash Mobile', icon: 'fa-solid fa-mobile-screen', color: 'bg-[#E2136E] text-white' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter">Wallet Node</h2>
          <p className="text-slate-400 font-medium">Provision fuel for your marketing automation engine.</p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-500/20 px-8 py-6 rounded-[2rem] text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-transparent"></div>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 relative z-10">Available Liquidity</p>
          <p className="text-4xl font-display font-black glowing-text animate-pulse-glow relative z-10">{formatPrice(balanceUSD)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] border-indigo-500/20">
            <h3 className="text-xl font-display font-black mb-8 text-white uppercase tracking-tighter">Gateway Selection</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all active:scale-95 ${
                    method === m.id ? 'border-indigo-500 bg-indigo-500/10 shadow-2xl' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${m.color}`}>
                    <i className={`${m.icon}`}></i>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{m.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Deposit Amount ({currency})</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-500">{currData.symbol}</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-3xl pl-12 pr-8 py-5 text-3xl font-display font-black focus:ring-2 focus:ring-indigo-500 text-white shadow-inner"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[10, 50, 100, 500].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="px-6 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                  >
                    +{currData.symbol}{val}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                <button 
                  onClick={handleDeposit}
                  disabled={isProcessing || amount < 1}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-display font-black text-xl hover:bg-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 transition-all disabled:opacity-50 btn-3d"
                >
                  {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
                  {isProcessing ? 'Verifying Node...' : `Authorize Provision`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[3rem] border-slate-700/50 flex flex-col h-full shadow-xl">
            <h3 className="text-lg font-display font-black mb-8 text-white uppercase tracking-tighter">Sync Log</h3>
            <div className="space-y-4 overflow-y-auto no-scrollbar">
              {[
                { id: 'TX-9902', method: 'Binance', amount: 150, date: 'Live', status: 'Completed' },
                { id: 'TX-9281', method: 'Wise', amount: 50, date: 'Oct 14', status: 'Completed' },
                { id: 'TX-9275', method: 'Paypal', amount: 20, date: 'Oct 12', status: 'Completed' },
                { id: 'TX-9210', method: 'Stripe', amount: 100, date: 'Oct 08', status: 'Pending' }
              ].map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-950/40 rounded-2xl border border-white/5 group hover:bg-slate-900/60 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-300 shadow-inner">
                      <i className="fa-solid fa-file-invoice-dollar"></i>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-tight">{tx.method}</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">+{formatPrice(tx.amount)}</p>
                    <p className={`text-[8px] uppercase font-black tracking-widest ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFund;
