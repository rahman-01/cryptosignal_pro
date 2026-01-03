import React from 'react';
import { Target, ShieldCheck, Zap, BarChart3, Bell, Search } from 'lucide-react';

const Features = () => {
  const items = [
    { 
      title: "Institutional Hunt", 
      desc: "Lacak pergerakan akumulasi dan distribusi whale secara real-time sebelum harga bergerak signifikan.", 
      icon: <Target className="text-indigo-500" size={28} />,
      color: "from-indigo-500/20"
    },
    { 
      title: "Order Block Detector", 
      desc: "Mapping otomatis area Supply & Demand institusi pada timeframe rendah (M1-M15) untuk entry presisi.", 
      icon: <Search className="text-purple-500" size={28} />,
      color: "from-purple-500/20"
    },
    { 
      title: "Smart Money Signal", 
      desc: "Dapatkan notifikasi instan via Telegram saat sistem mendeteksi manipulasi market oleh institusi.", 
      icon: <Bell className="text-emerald-500" size={28} />,
      color: "from-emerald-500/20"
    },
    { 
      title: "Ultra-Low Latency", 
      desc: "Data diproses dalam milidetik langsung dari WebSocket exchange untuk memastikan Anda tidak ketinggalan momentum.", 
      icon: <Zap className="text-amber-500" size={28} />,
      color: "from-amber-500/20"
    },
    { 
      title: "Deep Netflow Analysis", 
      desc: "Analisis mendalam arus keluar-masuk koin (Netflow) pada lebih dari 500+ altcoins secara otomatis.", 
      icon: <BarChart3 className="text-blue-500" size={28} />,
      color: "from-blue-500/20"
    },
    { 
      title: "Safe & Encrypted", 
      desc: "Keamanan akun prioritas utama. Enkripsi tingkat tinggi untuk menjaga data strategi trading Anda tetap privat.", 
      icon: <ShieldCheck className="text-rose-500" size={28} />,
      color: "from-rose-500/20"
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tight mb-4">
            Keunggulan Sistem <span className="text-indigo-500">Analisis Kami</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Gunakan teknologi yang sama dengan yang digunakan oleh institusi besar untuk mendominasi pasar kripto.
          </p>
        </div>

        {/* Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              data-aos="fade-up" 
              data-aos-delay={idx * 100}
              className="group p-8 bg-slate-900/40 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Efek Hover Glow */}
              <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${item.color} to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="bg-slate-800/50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;