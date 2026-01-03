import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    { 
      name: "Budi Santoso", 
      role: "Full-time Scalper", 
      text: "Fitur Order Block-nya sangat akurat. Saya bisa melihat area supply & demand institusi yang sebelumnya tidak terlihat di indikator standar. Akurasi trading saya naik drastis!", 
      stars: 5,
      avatar: "B"
    },
    { 
      name: "Andi Wijaya", 
      role: "Crypto Swing Trader", 
      text: "Telegram Alert-nya sangat membantu. Saya tidak perlu lagi menatap chart 24 jam. Begitu ada Institutional Hunt di koin low-cap, notifikasi langsung masuk!", 
      stars: 5,
      avatar: "A"
    },
    { 
      name: "Jessica Putri", 
      role: "SMC Enthusiast", 
      text: "Awalnya ragu, tapi setelah coba Tier Pro, analisis Whale Netflow-nya benar-benar gila. Kita bisa tahu kapan Whale mau dumping atau akumulasi.", 
      stars: 5,
      avatar: "J"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Glow Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tight mb-4">
            DIBUKTIKAN OLEH <span className="text-indigo-500">TRADER PROFESIONAL</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan trader yang telah mengubah strategi mereka menjadi lebih data-driven.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div 
              key={i} 
              className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1 text-indigo-500">
                  {[...Array(r.stars)].map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <Quote className="text-slate-800 group-hover:text-indigo-500/20 transition-colors" size={32} />
              </div>

              <p className="text-slate-300 italic mb-8 leading-relaxed relative z-10 text-sm">
                "{r.text}"
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
                  {r.avatar}
                </div>
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                    {r.name}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                    {r.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;