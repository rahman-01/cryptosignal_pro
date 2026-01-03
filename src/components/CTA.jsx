import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Wallet, ArrowRight } from 'lucide-react';

const CTA = () => {
  const navigate = useNavigate();

  const handleProAccess = () => {
    // Navigasi ke Dashboard dengan state untuk membuka modal pembayaran otomatis
    navigate('/login', { state: { openPayment: true } });
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-slate-900/50 border border-indigo-500/30 rounded-[3rem] p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 italic leading-none uppercase">
              Berhenti Menebak, <br />
              <span className="text-indigo-500">Mulai Analisis.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl">Dapatkan data Smart Money & Whale Netflow. Diskon 20% pembayaran Crypto.</p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={handleProAccess}
              className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase shadow-xl shadow-indigo-600/40"
            >
              Ambil Akses Pro Sekarang <ArrowRight />
            </button>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase italic">
              <Wallet size={14} /> USDT BEP20 Accepted
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;