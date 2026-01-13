
import React, { useState } from 'react';
import { GLOBAL_CURRENCIES } from '../constants';

const AddFund: React.FC<{ currency?: string }> = ({ currency = 'USD' }) => {
  const [amount, setAmount] = useState<number>(10);
  const [method, setMethod] = useState<'bkash' | 'nagad' | 'binance' | 'stripe' | 'bybit' | 'bitget' | 'base'>('binance');
  const [isProcessing, setIsProcessing] = useState(false);

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (val: number) => `${currData.symbol}${(val * currData.rate).toFixed(2)}`;
  
  // Hardcoded balance simulation in selected currency
  const balanceUSD = 245.80; 

  const handleDeposit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Success! ${formatPrice(amount)} added via ${method.charAt(0).toUpperCase() + method.slice(1)}. (Simulation)`);
    }, 2000);
  };

  const paymentMethods = [
    { id: 'binance', name: 'Binance Pay', icon: 'fa-bitcoin-sign', color: 'bg-[#F0B90B] text-black' },
    { id: 'bybit', name: 'Bybit', icon: 'fa-chart-line', color: 'bg-[#17181e] text-[#f7a600]' },
    { id: 'bitget', name: 'Bitget', icon: 'fa-right-left', color: 'bg-[#00f0ff] text-black' },
    { id: 'base', name: 'Base (ETH)', icon: 'fa-layer-group', color: 'bg-[#0052FF] text-white' },
    { id: 'stripe', name: 'Card / Stripe', icon: 'fa-credit-card', color: 'bg-[#635BFF] text-white' },
    { id: 'bkash', name: 'bKash', icon: 'fa-mobile-screen-button', color: 'bg-[#E2136E] text-white' },
    { id: 'nagad', name: 'Nagad', icon: 'fa-building-columns', color: 'bg-[#F7931A] text-white' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Add Funds</h2>
          <p className="text-slate-400">Top up your wallet to purchase SMM, OTP, and RDP services instantly.</p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-500/20 px-6 py-4 rounded-2xl text-center">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Available Balance</p>
          <p className="text-3xl font-extrabold text-indigo-400">{formatPrice(balanceUSD)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-indigo-500/20">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-wallet text-indigo-500"></i> Deposit Method
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {paymentMethods.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    method === m.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg scale-[1.02]' : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg ${m.color}`}>
                    <i className={`fa-solid ${m.icon}`}></i>
                  </div>
                  <span className="text-xs font-bold text-slate-300">{m.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Amount ({currency})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{currData.symbol}</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-lg font-bold focus:ring-1 focus:ring-indigo-500 text-white"
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors text-slate-300 hover:text-white"
                  >
                    +{formatPrice(val)}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleDeposit}
                  disabled={isProcessing || amount < 1}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-shield-check"></i>}
                  {isProcessing ? 'Connecting Gateway...' : `Pay ${formatPrice(amount)}`}
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-4">
              <i className="fa-solid fa-percent text-2xl text-emerald-500"></i>
              <div>
                <h4 className="font-bold text-white">Crypto Bonus: Extra 5%</h4>
                <p className="text-sm text-slate-400">Deposit using Binance, Bybit, Bitget, or Base to get a 5% instant bonus added to your wallet automatically.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl h-full border-slate-700/50">
            <h3 className="text-lg font-bold mb-6 text-white">Recent Transactions</h3>
            <div className="space-y-4">
              {[
                { id: 'TX-9902', method: 'Bybit', amount: 150, date: 'Just now', status: 'Completed' },
                { id: 'TX-9281', method: 'Binance', amount: 50, date: 'Oct 14', status: 'Completed' },
                { id: 'TX-9275', method: 'bKash', amount: 20, date: 'Oct 12', status: 'Completed' },
                { id: 'TX-9210', method: 'Stripe', amount: 100, date: 'Oct 08', status: 'Pending' }
              ].map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.method}</p>
                      <p className="text-[10px] text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">+{formatPrice(tx.amount)}</p>
                    <p className={`text-[9px] uppercase font-bold ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</p>
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
