import React from 'react';
import { Rocket, Wallet, ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Dekorasi Cahaya di Belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-slate-900/50 border border-indigo-500/30 rounded-[3rem] p-8 md:p-16 overflow-hidden relative group">
          
          {/* Efek Gradient pada Border saat Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="text-left lg:w-2/3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Rocket size={14} /> Ready to Hunt?
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 italic tracking-tight leading-none">
                BERHENTI MENEBAK, <br />
                <span className="text-indigo-500 uppercase">MULAI ANALISIS.</span>
              </h2>
              
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                Bergabunglah dengan <span className="text-white font-bold">12,000+ trader</span> yang sudah menggunakan data Smart Money. Dapatkan diskon <span className="text-emerald-400 font-bold italic">20% selamanya</span> jika membayar dengan Crypto.
              </p>
            </div>

            <div className="flex flex-col w-full lg:w-auto gap-4">
              <button className="group px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 uppercase tracking-tighter">
                Ambil Akses VIP Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-4 text-slate-500 text-sm font-medium italic">
                <div className="flex items-center gap-1.5 font-bold text-slate-400">
                  <Wallet size={16} /> Pay with BTC/USDT
                </div>
                <span>•</span>
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          {/* Aksesoris Visual: Angka Transparan di Background */}
          <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none italic">
            PRO
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;