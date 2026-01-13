
import React, { useState, useEffect } from 'react';
import { PricingPlan } from '../types';
import { GLOBAL_CURRENCIES } from '../constants';

const PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    currency: 'USD',
    features: ['2 Social Channels', 'Basic Analytics', 'Standard AI Insights', 'Email Support']
  },
  {
    id: 'pro',
    name: 'Growth Pro',
    price: 49,
    currency: 'USD',
    recommended: true,
    features: ['All Channels (Meta, TikTok, etc.)', 'Real-time Trends (Search AI)', 'Bulk Publishing', 'AI Strategy Bot', 'Priority Support']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    features: ['Unlimited Everything', 'Custom AI Training', 'Dedicated Account Manager', 'API Access', 'White-label Reports']
  }
];

interface BillingProps {
  externalItem?: { name: string; price: number } | null;
  onClearItem?: () => void;
  currency?: string;
}

const Billing: React.FC<BillingProps> = ({ externalItem, onClearItem, currency = 'USD' }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'selection' | 'method' | 'success'>('selection');
  const [activeMethod, setActiveMethod] = useState<'card' | 'local' | 'crypto'>('card');

  const currData = GLOBAL_CURRENCIES[currency] || GLOBAL_CURRENCIES['USD'];
  const formatPrice = (amount: number) => `${currData.symbol}${(amount * currData.rate).toFixed(2)}`;

  useEffect(() => {
    if (externalItem) {
      setSelectedPlan(externalItem);
      setPaymentStep('method');
    }
  }, [externalItem]);

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setPaymentStep('method');
  };

  const handleBack = () => {
    if (externalItem && onClearItem) {
      onClearItem();
    }
    setPaymentStep('selection');
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
      if (onClearItem) onClearItem();
    }, 2500);
  };

  if (paymentStep === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-700">
        
        {/* Subscriber Video Placeholder */}
        <div className="relative w-64 h-36 bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-600 group mb-6">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-2">
                    <i className="fa-solid fa-play text-white"></i>
                </div>
                <p className="text-[10px] text-white font-bold uppercase tracking-widest text-shadow">Thank You Subscriber</p>
            </div>
        </div>

        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 text-4xl animate-bounce">
          <i className="fa-solid fa-check"></i>
        </div>
        <h2 className="text-3xl font-bold">Transaction Successful!</h2>
        <p className="text-slate-400 max-w-md">Your order for {selectedPlan?.name} has been processed successfully. Check your email for details.</p>
        <button 
          onClick={() => setPaymentStep('selection')}
          className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-colors"
        >
          Return to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Choose Your Path to Growth</h2>
        <p className="text-slate-400 max-w-2xl mx-auto italic">"Invest in intelligence. Scaling your brand shouldn't be restricted by tools."</p>
      </div>

      {paymentStep === 'selection' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`glass-panel p-8 rounded-3xl relative transition-all hover:scale-105 ${plan.recommended ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10 scale-105 z-10' : 'border-slate-700/50'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">{formatPrice(plan.price)}</span>
                <span className="text-slate-400 text-sm">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <i className="fa-solid fa-circle-check text-indigo-500"></i>
                    {f}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.recommended ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg' : 'bg-slate-800 hover:bg-slate-700'}`}
              >
                {plan.price === 0 ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto glass-panel p-8 rounded-3xl border-indigo-500/30">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-6">
              <button onClick={handleBack} className="text-slate-400 hover:text-white text-sm">
                <i className="fa-solid fa-arrow-left mr-2"></i> Back to Plans
              </button>
              <h3 className="text-2xl font-bold">Secure Checkout</h3>
              <div className="p-4 bg-slate-800/50 rounded-2xl flex justify-between items-center border border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Order Details</p>
                  <p className="font-bold text-lg">{selectedPlan?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatPrice(selectedPlan?.price)}</p>
                  <p className="text-xs text-slate-500">Secure Payment</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-400">Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setActiveMethod('card')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeMethod === 'card' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50 grayscale'}`}
                  >
                    <i className="fa-solid fa-credit-card"></i>
                    <span className="text-[10px] font-bold uppercase">International</span>
                  </button>
                  <button 
                    onClick={() => setActiveMethod('local')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeMethod === 'local' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/50 grayscale'}`}
                  >
                    <i className="fa-solid fa-building-columns"></i>
                    <span className="text-[10px] font-bold uppercase">Bangladesh</span>
                  </button>
                  <button 
                    onClick={() => setActiveMethod('crypto')}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${activeMethod === 'crypto' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800/50 grayscale'}`}
                  >
                    <i className="fa-brands fa-bitcoin"></i>
                    <span className="text-[10px] font-bold uppercase">USDT / Crypto</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
              {activeMethod === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 uppercase font-bold">Card Number</label>
                    <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 uppercase font-bold">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 uppercase font-bold">CVC</label>
                      <input type="text" placeholder="•••" className="w-full bg-slate-800 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              )}

              {activeMethod === 'local' && (
                <div className="space-y-4">
                   <p className="text-xs text-slate-400 leading-relaxed">Pay via SSLCommerz gateway. Supports bKash, Nagad, Rocket, and all Bangladeshi bank cards.</p>
                   <div className="flex flex-wrap gap-2">
                     <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center grayscale text-[8px] font-bold">bKash</div>
                     <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center grayscale text-[8px] font-bold">Nagad</div>
                     <div className="h-8 w-12 bg-white/10 rounded flex items-center justify-center grayscale text-[8px] font-bold">Rocket</div>
                   </div>
                </div>
              )}

              {activeMethod === 'crypto' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-400">Send USDT (BEP-20 / TRC-20)</p>
                  <div className="bg-white p-2 rounded-lg inline-block">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=usdt-address-mock" alt="QR Code" className="w-32 h-32" />
                  </div>
                  <p className="text-[10px] font-mono break-all text-slate-500">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                </div>
              )}

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 mt-6 bg-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-shield-halved"></i>}
                {isProcessing ? 'Verifying Transaction...' : `Pay ${formatPrice(selectedPlan?.price)} Now`}
              </button>
              <p className="text-[10px] text-center text-slate-500 mt-4">
                Secure SSL Encrypted Payment. Powered by OmniPay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
