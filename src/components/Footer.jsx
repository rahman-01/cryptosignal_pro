import React from 'react';
import { Twitter, Send, Github, Globe, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5 relative overflow-hidden">
      {/* Dekorasi Cahaya Halus */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1 text-left">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
              </div>
              <span className="text-white font-black italic tracking-tighter text-xl uppercase">
                Crypto<span className="text-indigo-500 italic">Signal</span> PRO
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Platform analisis kripto berbasis AI yang berfokus pada Smart Money Concepts dan deteksi Whale secara real-time.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Send size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Globe size={18} />} href="#" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-left">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Produk</h4>
            <ul className="space-y-4 text-sm">
              <li><FooterLink text="Institutional Hunt" /></li>
              <li><FooterLink text="Order Block Detector" /></li>
              <li><FooterLink text="SMC Indicators" /></li>
              <li><FooterLink text="Pricing" /></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="text-left">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4 text-sm">
              <li><FooterLink text="Trading Academy" /></li>
              <li><FooterLink text="Market Updates" /></li>
              <li><FooterLink text="API Documentation" /></li>
              <li><FooterLink text="Community" /></li>
            </ul>
          </div>

          {/* Disclaimer / Legal */}
          <div className="text-left">
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><FooterLink text="Terms of Service" /></li>
              <li><FooterLink text="Privacy Policy" /></li>
              <li><FooterLink text="Risk Disclosure" /></li>
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-white/5 text-[10px] leading-tight">
              <span className="text-amber-500 font-bold uppercase block mb-1">Risk Warning:</span>
              Trading kripto memiliki risiko tinggi. Sinyal kami hanya alat bantu, bukan saran finansial investasi.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest uppercase font-medium">
          <p>© {currentYear} Crypto Signal PRO. All rights reserved.</p>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Powered by</span>
            <span className="text-indigo-500 font-bold tracking-normal">Veo AI Engines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
  >
    {icon}
  </a>
);

const FooterLink = ({ text }) => (
  <a href="#" className="flex items-center gap-1 group transition-colors hover:text-indigo-400">
    {text}
    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

export default Footer;