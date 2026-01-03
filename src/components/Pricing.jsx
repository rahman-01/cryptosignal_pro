import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, X, Copy, CheckCircle2, Bitcoin, ArrowRight, Star, Clock, Tag } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const Pricing = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Data Pembayaran Pro AI
  const paymentDetails = {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 
    amount: "20.00", 
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
    } else {
      navigate('/login');
    }
  };

  const handleFinalStep = () => {
    window.open('https://t.me/+MRFIYI9Q1YRlZjll', '_blank');
    navigate('/login');
  };

  const plans = [
    {
      name: "Standard",
      price: "0",
      originalPrice: null,
      unit: "FREE",
      trialPeriod: "12 Days Trial",
      description: "Akses uji coba fitur dasar untuk pemula.",
      features: [
        { text: "12 Days Full Access Trial", active: true },
        { text: "Top 5 Coins Only", active: true },
        { text: "Standard Indicators", active: true },
        { text: "Real-time Telegram Alerts", active: false },
      ],
      recommended: false,
      buttonText: "Coba Gratis",
    },
    {
      name: "Pro AI",
      price: "20",
      originalPrice: "25", // Harga asli sebelum diskon
      unit: "USDT",
      trialPeriod: "Monthly Access",
      description: "Senjata lengkap para Institusi & Whale.",
      features: [
        { text: "All 500+ Coins Support", active: true },
        { text: "Ultra-Low Timeframe (M1)", active: true },
        { text: "Whale Netflow Analysis", active: true },
        { text: "Telegram Bot Integration", active: true },
      ],
      recommended: true,
      buttonText: "Buka Akses Pro",
    }
  ];

  return (
    <section className="py-32 bg-slate-950 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 text-center z-10">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
            PILIH <span className="text-indigo-500">SENJATA</span> ANDA
          </h2>
          <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-bold">Mulai dengan Trial atau langsung ke Pro.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[3rem] border transition-all duration-500 ${
                plan.recommended 
                ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-[0_0_80px_rgba(79,70,229,0.15)] ring-1 ring-indigo-400/50' 
                : 'border-white/5 bg-slate-900/40 opacity-80 hover:opacity-100'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap border border-white/20">
                  <Star size={12} className="fill-white" />
                  Recommended for Profit
                </div>
              )}

              {/* Tag Diskon 20% untuk Pro AI */}
              {plan.recommended && (
                <div className="flex justify-center mb-4">
                  <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-[10px] font-black text-emerald-400 uppercase tracking-wider animate-pulse">
                    <Tag size={12} /> Save 20% Early Bird
                  </span>
                </div>
              )}

              {/* Tag Trial untuk Standard */}
              {!plan.recommended && (
                <div className="flex justify-center mb-4">
                  <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    <Clock size={12} /> {plan.trialPeriod}
                  </span>
                </div>
              )}

              <h3 className={`text-2xl font-black mb-2 italic uppercase ${plan.recommended ? 'text-white' : 'text-slate-400'}`}>
                {plan.name}
              </h3>
              
              <div className="flex flex-col items-center mb-4">
                {/* Harga Asli Dicoret jika ada diskon */}
                {plan.originalPrice && (
                   <span className="text-slate-500 text-lg font-bold line-through decoration-rose-500/50 mb-[-8px]">
                     {plan.originalPrice} {plan.unit}
                   </span>
                )}
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-black text-white tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-xl font-bold text-indigo-500 italic uppercase">
                    {plan.unit}
                  </span>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-500 mb-8 font-medium leading-relaxed uppercase tracking-wide">
                {plan.recommended ? '/ Month (Special Price)' : '/ 12 Days Limited'}
              </p>
              
              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm font-medium ${f.active ? 'text-slate-200' : 'text-slate-600'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${f.active ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                      {f.active ? <Zap size={10} className="text-indigo-400 fill-indigo-400" /> : <Lock size={10} />}
                    </div>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleUpgradeClick(plan.name)}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  plan.recommended 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5'
                }`}
              >
                {plan.buttonText}
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal tetap sama seperti sebelumnya */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Bitcoin size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Checkout Pro AI</h3>
              <p className="text-slate-400 text-xs mt-1 italic font-bold text-emerald-400">🔥 Discount 20% Applied</p>
            </div>
            <div className="space-y-6 text-left">
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Bayar</p>
                <div className="flex items-center gap-2">
                   <p className="text-2xl font-black text-white">{paymentDetails.amount} <span className="text-indigo-500 text-sm italic font-bold">USDT</span></p>
                   <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded line-through">25 USDT</span>
                </div>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 font-mono">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-sans">Alamat Wallet ({paymentDetails.network})</p>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] text-indigo-300 break-all bg-indigo-500/5 p-2 rounded-lg flex-grow border border-indigo-500/10">
                    {paymentDetails.address}
                  </code>
                  <button onClick={handleCopy} className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-all shadow-lg shadow-indigo-600/20">
                    {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
                <p className="text-[10px] text-amber-200 leading-relaxed font-bold uppercase tracking-wide italic">
                  ⚠️ Pastikan jaringan BEP20. Kirim bukti transfer ke Admin setelah membayar.
                </p>
              </div>
              <button 
                onClick={handleFinalStep}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
              >
                Konfirmasi & Daftar Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;