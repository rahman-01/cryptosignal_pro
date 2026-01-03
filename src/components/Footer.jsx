import React from 'react';
import { Twitter, Send, Globe, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 pt-20 pb-10 border-t border-white/5 bg-[#020617]">
      {/* Efek Cahaya Dekoratif di Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Kolon 1: Brand & Info (Lebar 5/12) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <div className="w-5 h-5 bg-white rotate-45 rounded-sm"></div>
              </div>
              <span className="text-white font-black italic tracking-tighter uppercase text-xl">
                SIGNALPRO
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Analisis pasar crypto tingkat lanjut menggunakan teknologi AI untuk mendeteksi pergerakan <span className="text-indigo-400 font-bold italic">Smart Money</span> dan aktivitas Whale secara real-time.
            </p>
            <div className="flex gap-3">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Send size={18} />} href="#" />
              <SocialIcon icon={<Globe size={18} />} href="#" />
            </div>
          </div>

          {/* Kolon 2: Quick Links (Lebar 3/12) */}
          <div className="md:col-span-3">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-6">Navigation</h4>
            <ul className="space-y-4">
              <FooterLink text="AI Indicators" />
              <FooterLink text="Pricing Plan" />
              <FooterLink text="Risk Analysis" />
              <FooterLink text="Academy" />
            </ul>
          </div>

          {/* Kolon 3: Support & Disclaimer (Lebar 4/12) */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em] mb-6">Policy</h4>
            <ul className="space-y-4 mb-6">
              <FooterLink text="Terms of Service" />
              <FooterLink text="Privacy Policy" />
            </ul>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 shadow-inner">
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-wider italic">
                <strong className="text-amber-500">Risk Warning:</strong> Trading Crypto memiliki risiko tinggi. Sinyal AI kami adalah alat bantu analisis, bukan jaminan keuntungan.
              </p>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <p>© {currentYear} Crypto Signal PRO Hunter. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="text-white">SignalPro AI Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Link Sederhana dengan Hover Effect
const FooterLink = ({ text }) => (
  <li>
    <a href="#" className="group flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-all duration-300">
      <ChevronRight size={12} className="text-indigo-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
      <span className="group-hover:translate-x-1 transition-transform">{text}</span>
    </a>
  </li>
);

// Helper Icon dengan Styling Lebih Menarik
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;