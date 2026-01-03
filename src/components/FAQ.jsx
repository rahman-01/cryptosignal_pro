import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    { 
      q: "Bagaimana cara upgrade ke Tier Pro menggunakan Kripto?", 
      a: "Sangat mudah! Klik tombol Upgrade, pilih metode pembayaran Kripto (USDT, BTC, atau ETH). Sistem kami menggunakan NOWPayments yang akan memproses aktivasi akun Anda secara otomatis segera setelah transaksi terkonfirmasi di blockchain." 
    },
    { 
      q: "Apa perbedaan utama indikator Standard dan Institutional Hunt?", 
      a: "Indikator standar hanya membaca data harga masa lalu. Institutional Hunt menganalisis volume transaksi besar (Whale) dan area likuiditas secara real-time untuk mendeteksi kapan institusi mulai masuk ke pasar." 
    },
    { 
      q: "Apakah sinyal Telegram tersedia untuk pengguna gratis?", 
      a: "Pengguna gratis mendapatkan akses ke grup publik dengan update terbatas pada BTC & ETH. Notifikasi instan untuk koin low-cap dan timeframe scalping (M1-M15) hanya tersedia eksklusif untuk member Pro AI." 
    },
    { 
      q: "Apakah saya bisa membatalkan langganan kapan saja?", 
      a: "Tentu. Karena kami menggunakan sistem pembayaran kripto, tidak ada auto-debit yang memaksa. Anda cukup tidak memperpanjang pembayaran untuk bulan berikutnya jika ingin kembali ke Tier Gratis." 
    },
    { 
      q: "Apakah sistem ini cocok untuk trader pemula?", 
      a: "Ya! Meskipun algoritmanya kompleks, visualisasi di dashboard kami (seperti Order Block) dibuat sangat intuitif agar trader pemula sekalipun bisa memahami area entry dan exit yang logis." 
    }
  ];

  const [open, setOpen] = useState(null);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Header FAQ */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
              <HelpCircle size={32} />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tight">
            Pertanyaan <span className="text-indigo-500">Umum</span>
          </h2>
          <p className="text-slate-500 mt-4 font-medium">
            Segala hal yang perlu Anda ketahui tentang sistem analisis kami.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className={`transition-all duration-300 rounded-[2rem] border ${
                open === i 
                ? 'border-indigo-500/50 bg-indigo-500/5' 
                : 'border-white/5 bg-slate-900/20 hover:border-white/10'
              }`}
            >
              <button 
                onClick={() => setOpen(open === i ? null : i)} 
                className="w-full flex justify-between items-center text-left p-6 md:p-8 outline-none"
              >
                <span className={`text-lg font-bold tracking-tight transition-colors ${
                  open === i ? 'text-indigo-400' : 'text-slate-200'
                }`}>
                  {f.q}
                </span>
                <div className={`transition-transform duration-300 text-slate-500 ${open === i ? 'rotate-180 text-indigo-400' : ''}`}>
                  <ChevronDown size={24} />
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-8 pb-8 text-slate-400 leading-relaxed border-t border-white/5 pt-4 font-medium">
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;