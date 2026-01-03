import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Fungsi untuk scroll ke atas atau ke section tertentu
  const handleScrollTo = (id) => {
    closeMenu();
    
    // Jika user sedang tidak di halaman beranda (misal di /login)
    if (location.pathname !== '/') {
        window.location.href = `/${id === 'top' ? '' : '#' + id}`;
        return;
    }

    // Jika di halaman beranda, lakukan smooth scroll
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 antialiased ${
      isScrolled 
      ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-4' 
      : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" onClick={() => handleScrollTo('top')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="text-white font-black italic tracking-tighter text-xl uppercase">
            CRYPTO<span className="text-indigo-500">SIGNAL</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          <div className="flex gap-8 items-center text-[13px] font-bold uppercase tracking-widest text-slate-400">
            {/* Tombol Beranda ditambahkan kembali */}
            <button onClick={() => handleScrollTo('top')} className="hover:text-white transition-colors">
              Beranda
            </button>
            <button onClick={() => handleScrollTo('features')} className="hover:text-white transition-colors">
              Fitur
            </button>
            <button onClick={() => handleScrollTo('pricing')} className="hover:text-white transition-colors">
              Harga
            </button>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-indigo-500 transition-all duration-300 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] active:scale-95"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/5 p-6 flex flex-col gap-6 md:hidden">
          <button onClick={() => handleScrollTo('top')} className="text-white font-bold text-lg text-left">
            Beranda
          </button>
          <button onClick={() => handleScrollTo('features')} className="text-white font-bold text-lg text-left">
            Fitur
          </button>
          <button onClick={() => handleScrollTo('pricing')} className="text-white font-bold text-lg text-left">
            Harga
          </button>
          <hr className="border-white/5" />
          <Link 
            to="/login" 
            onClick={closeMenu}
            className="bg-indigo-600 text-white p-4 rounded-xl text-center font-black uppercase tracking-widest"
          >
            Masuk
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;