import React from 'react';
import { Zap, Lock } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Standard",
      price: "0",
      description: "Cocok untuk pemula yang ingin memahami pergerakan harga jangka panjang.",
      features: [
        { text: "Top 5 Coins Only (BTC, ETH...)", active: true },
        { text: "Standard SMC Indicators", active: true },
        { text: "Timeframe H1 & D1", active: true },
        { text: "Institutional Hunt (Real-time)", active: false },
        { text: "Order Block Detector (Small TF)", active: false },
        { text: "Real-time Telegram Alerts", active: false },
        { text: "Update: Delay 15 Menit", active: true },
      ],
      recommended: false,
      buttonText: "Current Plan",
    },
    {
      name: "Pro AI",
      price: "29",
      promo: "Diskon 20% via Crypto",
      description: "Didesain untuk Scalper & Intraday Trader berburu jejak 'Smart Money'.",
      features: [
        { text: "All 500+ Coins Support", active: true },
        { text: "Ultra-Low Timeframe (M1 - M15)", active: true },
        { text: "Whale Netflow Deep Analysis", active: true },
        { text: "Real-time Spread Prediction", active: true },
        { text: "Institutional Hunt (Real-time)", active: true },
        { text: "Order Block Detector (M1, M5, M15)", active: true },
        { text: "Telegram Signal Bot Integration", active: true },
      ],
      recommended: true,
      buttonText: "Upgrade to Pro",
    }
  ];

  return (
    <section className="py-24 bg-slate-950 min-h-screen flex flex-col items-center justify-center font-sans">
      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tight uppercase">
            PILIH SENJATA ANDA <br/> 
            <span className="text-indigo-500 text-3xl md:text-4xl uppercase">DALAM MENGHADAPI MARKET</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Market kripto bergerak 24/7. Jangan hanya menebak—tradinglah dengan data institusi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-10 rounded-[3rem] border transition-all duration-500 relative flex flex-col backdrop-blur-md ${
                plan.recommended 
                ? 'border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_80px_rgba(79,70,229,0.15)] scale-105 z-10' 
                : 'border-white/5 bg-slate-900/20 opacity-90'
              }`}
            >
              {/* Badge Pro Eksklusif */}
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-indigo-400 animate-gradient text-[10px] font-black text-white px-8 py-2 rounded-bl-3xl uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="text-left">
                <h3 className="text-2xl font-black text-white mb-2 uppercase italic">
                  {plan.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed h-10">
                  {plan.description}
                </p>
                
                <div className="flex items-baseline gap-1 text-5xl font-black text-white mb-2">
                  <span className="text-3xl font-bold font-sans">$</span>
                  {plan.price}
                  <span className="text-lg text-slate-500 font-normal tracking-normal lowercase"> / month</span>
                </div>
                
                {plan.promo ? (
                  <p className="text-emerald-400 text-xs font-bold mb-8 uppercase tracking-wider">
                    ✨ {plan.promo}
                  </p>
                ) : (
                  <div className="mb-8 h-4"></div>
                )}
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature, i) => (
                  <FeatureItem 
                    key={i} 
                    text={feature.text} 
                    active={feature.active} 
                  />
                ))}
              </ul>

              <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] active:scale-95 ${
                plan.recommended 
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)]' 
                : 'border border-white/10 text-slate-400 hover:bg-white/5'
              }`}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

const FeatureItem = ({ text, active }) => (
  <li className={`flex items-center gap-3 text-sm transition-all ${!active ? 'text-slate-600' : 'text-slate-300'}`}>
    <div className="flex-shrink-0">
      {active ? (
        <Zap size={16} className="text-indigo-500 fill-indigo-500/30" />
      ) : (
        <Lock size={14} className="text-slate-700" />
      )}
    </div>
    <span className={!active ? "line-through opacity-40 italic font-light" : "font-medium"}>
      {text}
    </span>
  </li>
);

export default Pricing;