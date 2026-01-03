import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Zap, Waves, Newspaper, BellRing, LogOut, Menu,
  Brain, GraduationCap, ShieldAlert, Search, BrainCircuit,
  Terminal, ShieldCheck, Clock, Lock, X, Copy, Bitcoin, CheckCircle2, Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- KOMPONEN DASHBOARD (Sub-menu) ---
const Market = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Market Analysis Feed</div>;
const AiSignal = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">AI Signal Basic</div>;
const WhaleDetector = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Whale Movements</div>;
const PriceAlarm = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Price Alerts</div>;
const NewsCrypto = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Crypto News</div>;
const SentimentRadar = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Sentiment Analysis</div>;
const TechnicalGuru = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Advanced Tech Analysis</div>;
const RiskScore = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Asset Risk Score</div>;
const CommandCenter = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Main Command Center</div>;
const AiSignalPro = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">AI Premium Signals</div>;
const AiCryptoTerminal = () => <div className="p-10 text-slate-500 border border-dashed border-slate-800 rounded-3xl text-center">Institutional Terminal</div>;

// --- KONFIGURASI DATA ---
const ALL_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' }
];

const MENUS = [
  { id: 'market', name: 'Market', icon: TrendingUp, color: 'text-emerald-400', component: Market, premium: false },
  { id: 'signal', name: 'Ai Signal', icon: Zap, color: 'text-indigo-400', component: AiSignal, premium: false },
  { id: 'sentiment', name: 'Sentiment Radar', icon: Brain, color: 'text-pink-400', component: SentimentRadar, premium: false },
  { id: 'technical', name: 'Technical Guru', icon: GraduationCap, color: 'text-purple-400', component: TechnicalGuru, premium: true }, 
  { id: 'signal-pro', name: 'Ai Signal Pro', icon: BrainCircuit, color: 'text-indigo-500', component: AiSignalPro, premium: true },
  { id: 'terminal', name: 'Ai Terminal', icon: Terminal, color: 'text-blue-500', component: AiCryptoTerminal, premium: true },
  { id: 'risk', name: 'Risk Score', icon: ShieldAlert, color: 'text-orange-400', component: RiskScore, premium: false }, 
  { id: 'whale', name: 'Whale Detector', icon: Waves, color: 'text-blue-400', component: WhaleDetector, premium: true },
  { id: 'alarm', name: 'Price Alarm', icon: BellRing, color: 'text-rose-400', component: PriceAlarm, premium: false },
  { id: 'news', name: 'News Crypto', icon: Newspaper, color: 'text-amber-400', component: NewsCrypto, premium: false },
  { id: 'command', name: 'Command Center', icon: Search, color: 'text-cyan-400', component: CommandCenter, premium: true },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [userStatus, setUserStatus] = useState('free'); // 'free' atau 'pro'
  const [activeMenuId, setActiveMenuId] = useState('market');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin'); 
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(12);

  // --- PAYMENT DETAILS ---
  const paymentDetails = {
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", 
    amount: "20.00", 
    network: "Binance Smart Chain (BEP20)"
  };

  // --- LOGIKA TRIAL ---
  useEffect(() => {
    let registrationDate = localStorage.getItem('registrationDate');
    if (!registrationDate) {
      registrationDate = new Date().toISOString();
      localStorage.setItem('registrationDate', registrationDate);
    }

    const start = new Date(registrationDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysRemaining(diffDays >= 12 ? 0 : 12 - diffDays);
    if (diffDays >= 12 && userStatus !== 'pro') {
      setIsTrialExpired(true);
    }
  }, [userStatus]);

  // --- HANDLERS ---
  const handleCopy = () => {
    navigator.clipboard.writeText(paymentDetails.address);
    setIsCopied(true);
    toast.success("Wallet Address Copied!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const activeMenu = useMemo(() => 
    MENUS.find(m => m.id === activeMenuId) || MENUS[0], 
  [activeMenuId]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const handleUpgrade = () => setIsPaymentModalOpen(true);
  const handleLogout = () => navigate('/login');
  const handleConfirmTransfer = () => window.open('https://t.me/+MRFIYI9Q1YRlZjll', '_blank');

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} fixed inset-y-0 left-0 bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/50 transition-all duration-300 z-50 shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic uppercase tracking-tighter">SIGNALPRO</span>}
            <button onClick={toggleSidebar} className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"><Menu size={18} /></button>
          </div>

          {/* STATUS BADGE */}
          <div className="px-4 mb-4">
             <div className={`p-4 rounded-2xl border ${userStatus === 'pro' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-white/5'}`}>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Account Status</p>
                <div className="flex items-center gap-2">
                   {userStatus === 'pro' ? (
                     <><ShieldCheck size={14} className="text-indigo-400"/><span className="text-[10px] font-bold text-white uppercase">PRO MEMBER</span></>
                   ) : (
                     <><Clock size={14} className={isTrialExpired ? "text-rose-500" : "text-amber-500"}/><span className="text-[10px] font-bold uppercase">{isTrialExpired ? 'Trial Expired' : `${daysRemaining} Days Trial`}</span></>
                   )}
                </div>
                {userStatus !== 'pro' && isSidebarOpen && (
                  <button onClick={handleUpgrade} className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase rounded-lg transition-all">Upgrade Pro</button>
                )}
             </div>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {MENUS.map((menu) => (
              <button key={menu.id} onClick={() => setActiveMenuId(menu.id)} className={`w-full flex items-center p-3 rounded-xl transition-all group ${activeMenuId === menu.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800/50'}`}>
                <menu.icon size={20} className={activeMenuId === menu.id ? 'text-white' : menu.color} />
                {isSidebarOpen && (
                  <div className="ml-4 flex justify-between items-center w-full">
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate">{menu.name}</span>
                    {menu.premium && userStatus !== 'pro' && <Lock size={12} className="text-slate-600" />}
                  </div>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/5 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl group transition-all">
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
          
          {/* HEADER */}
          <header className="mb-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-1.5 rounded-full ${activeMenu.premium ? 'bg-indigo-500' : 'bg-slate-700'}`} />
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                {activeMenu.name}
                {activeMenu.premium && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md border border-indigo-500/30">PRO</span>}
              </h1>
            </div>
          </header>

          {/* OVERLAY TRIAL EXPIRED */}
          {isTrialExpired && userStatus !== 'pro' && (
            <div className="absolute inset-0 z-[100] bg-[#020617]/90 backdrop-blur-xl flex items-center justify-center p-6 rounded-[3rem]">
              <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 p-10 rounded-[3rem] text-center shadow-2xl">
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                  <ShieldAlert size={40} className="text-rose-500" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Trial Ended!</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-bold uppercase tracking-wide">Analisis dashboard Anda sudah terkunci. Upgrade ke Pro sekarang untuk melanjutkan profit.</p>
                <button onClick={handleUpgrade} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-[0.2em] shadow-lg shadow-indigo-600/40">Open Pro Access</button>
              </div>
            </div>
          )}

          {/* CONTENT AREA */}
          <div className="relative">
            {activeMenu.premium && userStatus !== 'pro' && !isTrialExpired && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xl rounded-[3rem] border border-white/5 text-center">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-[1.5rem] flex items-center justify-center mb-4 border border-indigo-500/30">
                  <Lock size={32} className="text-indigo-500" />
                </div>
                <h2 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">Akses Terkunci</h2>
                <button onClick={handleUpgrade} className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 py-4 rounded-2xl uppercase text-[10px] tracking-[0.2em]">Upgrade Sekarang</button>
              </div>
            )}
            <div className={`${(activeMenu.premium && userStatus !== 'pro') || isTrialExpired ? 'blur-2xl opacity-20 pointer-events-none' : 'opacity-100'} transition-all duration-500`}>
               {activeMenu.component && <activeMenu.component coin={selectedCoin} onSelectCoin={(id) => setSelectedCoin(id)} />}
            </div>
          </div>
        </div>
      </main>

      {/* MODAL PEMBAYARAN */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                <Bitcoin size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Checkout Pro AI</h3>
              <p className="text-slate-400 text-xs mt-1">Gunakan USDT (BEP20) untuk aktivasi</p>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Bayar</p>
                <p className="text-2xl font-black text-white">{paymentDetails.amount} <span className="text-indigo-500 text-sm italic font-bold">USDT</span></p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Wallet Address ({paymentDetails.network})</p>
                <div className="flex items-center gap-2">
                  <code className="text-[11px] text-indigo-300 break-all p-2 bg-indigo-500/5 rounded flex-grow">{paymentDetails.address}</code>
                  <button onClick={handleCopy} className="p-3 bg-indigo-600 rounded-xl text-white">
                    {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <button onClick={handleConfirmTransfer} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-xl shadow-indigo-600/30">
                <Send size={18} /> Konfirmasi via Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;