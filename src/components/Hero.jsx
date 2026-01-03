import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ChevronRight, BarChart2, Zap } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate(); 

  // Fungsi tunggal untuk mengarahkan ke form login/auth
  const handleAuth = () => {
    navigate('/login');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Ornaments - Efek Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      
      <div className="max-w-5xl text-center z-10">
        {/* Badge Pro Signal */}
        <div 
          data-aos="fade-down"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <Zap size={14} className="fill-indigo-400" />
          Powered by AI Institutional Analysis
        </div>

        <h1 
          data-aos="fade-down" 
          data-aos-delay="100"
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
        >
          TRADING SEPERTI <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-indigo-400 italic">
            INSTITUSI BESAR
          </span>
        </h1>

        <p 
          data-aos="fade-up"
          data-aos-delay="300"
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Akses algoritma <span className="text-white font-bold">Institutional Hunt</span> dan <span className="text-white font-bold">Order Block</span> real-time. Deteksi pergerakan Whale sebelum pasar meledak.
        </p>

        <div 
          data-aos="fade-up"
          data-aos-delay="500"
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Tombol Mulai Berburu - Terkoneksi ke Login */}
          <button 
            onClick={handleAuth}
            className="group relative px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:bg-indigo-500 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 uppercase tracking-wider"
          >
            Mulai Berburu Sekarang
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          {/* Tombol Lihat Dashboard - Sekarang juga Terkoneksi ke Login */}
          <button 
            onClick={handleAuth}
            className="px-10 py-4 bg-slate-900/50 text-slate-200 font-bold rounded-2xl border border-white/10 hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <BarChart2 size={20} className="text-indigo-400" />
            Lihat Dashboard
          </button>
        </div>

        {/* Stats Minimalis */}
        <div 
          data-aos="fade-up"
          data-aos-delay="700"
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10"
        >
          {[
            { label: "Uptime Data", val: "99.9%" },
            { label: "Coins Tracked", val: "500+" },
            { label: "Win Rate AI", val: "84%" },
            { label: "Active Traders", val: "12K+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-black text-white">{stat.val}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;