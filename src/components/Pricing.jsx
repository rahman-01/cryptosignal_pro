import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, X, Copy, CheckCircle2, Bitcoin } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Data Pembayaran
  const paymentDetails = {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Ganti dengan wallet Anda
    amount: "23.20", // Harga setelah diskon 20% ($29 - 20%)
    network: "Binance Smart Chain (BEP20)"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails.address);
    setIsCopied(true);
    toast.success("Alamat Wallet disalin!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUpgradeClick = (planName) => {
    if (planName === "Pro AI") {
      setIsModalOpen(true);
    }
  };

  const plans = [
    {
      name: "Standard",
      price: "0",
      description: "Cocok untuk pemula yang ingin memahami pergerakan harga.",
      features: [
        { text: "Top 5 Coins Only", active: true },
        { text: "Standard Indicators", active: true },
        { text: "Timeframe H1 & D1", active: true },
        { text: "Real-time Telegram Alerts", active: false },
      ],
      recommended: false,
      buttonText: "Current Plan",
    },
    {
      name: "Pro AI",
      price: "29",
      promo: "Diskon 20% via Crypto",
      description: "Didesain untuk Scalper berburu jejak 'Smart Money'.",
      features: [
        { text: "All 500+ Coins Support", active: true },
        { text: "Ultra-Low Timeframe (M1)", active: true },
        { text: "Whale Netflow Analysis", active: true },
        { text: "Telegram Bot Integration", active: true },
      ],
      recommended: true,
      buttonText: "Upgrade to Pro",
    }
  ];

  return (
    <section className="py-24 bg-slate-950 min-h-screen flex flex-col items-center justify-center relative">
      
      {/* --- PRICING CARDS --- */}
      <div className="max-w-6xl mx-auto px-4 text-center z-10">
        <h2 className="text-4xl font-black text-white mb-16 italic uppercase tracking-tighter">
          PILIH <span className="text-indigo-500">SENJATA</span> ANDA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div key={idx} className={`p-10 rounded-[3rem] border transition-all ${plan.recommended ? 'border-indigo-500 bg-indigo-500/5 scale-105' : 'border-white/5 bg-slate-900/20'}`}>
              <h3 className="text-2xl font-black text-white mb-2 italic uppercase">{plan.name}</h3>
              <div className="text-4xl font-black text-white mb-8">${plan.price} <span className="text-sm text-slate-500">/mo</span></div>
              
              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${f.active ? 'text-slate-300' : 'text-slate-600'}`}>
                    {f.active ? <Zap size={14} className="text-indigo-500" /> : <Lock size={14} />}
                    {f.text}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleUpgradeClick(plan.name)}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${plan.recommended ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' : 'border border-white/10 text-slate-500'}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* --- CRYPTO PAYMENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white">
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bitcoin size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Crypto Checkout</h3>
              <p className="text-slate-400 text-sm">Selesaikan pembayaran untuk akses Pro AI</p>
            </div>

            <div className="space-y-6">
              {/* Amount */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Bayar (Estimasi)</p>
                <p className="text-2xl font-black text-white">{paymentDetails.amount} <span className="text-indigo-500 text-sm italic">USDT / BUSD</span></p>
              </div>

              {/* Wallet Address */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Alamat Wallet ({paymentDetails.network})</p>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] text-indigo-300 break-all bg-indigo-500/5 p-2 rounded-lg flex-grow">
                    {paymentDetails.address}
                  </code>
                  <button onClick={handleCopy} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl text-white transition-all">
                    {isCopied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                <p className="text-[10px] text-amber-200 leading-relaxed font-medium">
                  ⚠️ Pastikan mengirim melalui jaringan <strong>{paymentDetails.network}</strong>. 
                  Setelah transfer, kirim bukti ke Telegram Admin untuk aktivasi instan.
                </p>
              </div>

              <button 
                onClick={() => window.open('https://t.me/+MRFIYI9Q1YRlZjll', '_blank')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all"
              >
                Konfirmasi via Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;