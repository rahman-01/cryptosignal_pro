import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Zap, Waves, Newspaper, BellRing, LogOut, Menu,
  Brain, GraduationCap, ShieldAlert, ChevronDown, Search, BrainCircuit,
  Terminal // Icon tambahan untuk AiCryptoTerminal
} from 'lucide-react';

// 1. Import Komponen
import Market from '../components/dashboard/Market';
import AiSignal from '../components/dashboard/AiSignal';
import WhaleDetector from '../components/dashboard/WhaleDetector';
import PriceAlarm from '../components/dashboard/PriceAlarm';
import NewsCrypto from '../components/dashboard/NewsCrypto';
import SentimentRadar from '../components/dashboard/SentimentRadar';
import TechnicalGuru from '../components/dashboard/TechnicalGuru';
import RiskScore from '../components/dashboard/RiskScore';
import CommandCenter from '../components/dashboard/CommandCenter';
import AiSignalPro from '../components/dashboard/AiSignalPro';
import AiCryptoTerminal from '../components/dashboard/AiCryptoTerminal'; // <--- IMPORT BARU

// 2. Daftar 100 Koin Crypto Populer (Tetap sama)
const ALL_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'tron', symbol: 'TRX', name: 'TRON' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'tether', symbol: 'USDT', name: 'Tether' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USDC' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'monero', symbol: 'XMR', name: 'Monero' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { id: 'near-protocol', symbol: 'NEAR', name: 'NEAR Protocol' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  { id: 'klay-token', symbol: 'KLAY', name: 'Klaytn' },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom' },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph' },
  { id: 'immutable-x', symbol: 'IMX', name: 'Immutable X' },
  { id: 'maker', symbol: 'MKR', name: 'Maker' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave' },
  { id: 'eos', symbol: 'EOS', name: 'EOS' },
  { id: 'theta-network', symbol: 'THETA', name: 'Theta Network' },
  { id: 'multi-collateral-dai', symbol: 'DAI', name: 'Dai' },
  { id: 'helium', symbol: 'HNT', name: 'Helium' },
  { id: 'injective-protocol', symbol: 'INJ', name: 'Injective Protocol' },
  { id: 'tezos', symbol: 'XTZ', name: 'Tezos' },
  { id: 'iota', symbol: 'MIOTA', name: 'IOTA' },
  { id: 'neo', symbol: 'NEO', name: 'NEO' },
  { id: 'zcash', symbol: 'ZEC', name: 'Zcash' },
  { id: 'elrond-erd-2', symbol: 'EGLD', name: 'MultiversX' },
  { id: 'dash', symbol: 'DASH', name: 'Dash' },
  { id: 'flow', symbol: 'FLOW', name: 'Flow' },
  { id: 'quant-network', symbol: 'QNT', name: 'Quant' },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash' },
  { id: 'curve-dao-token', symbol: 'CRV', name: 'Curve DAO' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland' },
  { id: 'sandbox', symbol: 'SAND', name: 'The Sandbox' },
  { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity' },
  { id: 'gala', symbol: 'GALA', name: 'Gala' },
  { id: 'basic-attention-token', symbol: 'BAT', name: 'Basic Attention Token' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'render-token', symbol: 'RNDR', name: 'Render' },
  { id: 'thorchain', symbol: 'RUNE', name: 'THORChain' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe' },
  { id: 'sui', symbol: 'SUI', name: 'Sui' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos' },
  { id: 'pyth-network', symbol: 'PYTH', name: 'Pyth Network' }
];

// --- KONFIGURASI MENU (URUTAN DIPERBARUI) ---
const MENUS = [
  { id: 'market', name: 'Market', icon: TrendingUp, color: 'text-emerald-400', component: Market },
  { id: 'signal', name: 'Ai Signal', icon: Zap, color: 'text-indigo-400', component: AiSignal },
  { id: 'sentiment', name: 'Sentiment Radar', icon: Brain, color: 'text-pink-400', component: SentimentRadar },
  { id: 'technical', name: 'Technical Guru', icon: GraduationCap, color: 'text-purple-400', component: TechnicalGuru },
  { id: 'signal-pro', name: 'Ai Signal Pro', icon: BrainCircuit, color: 'text-indigo-500', component: AiSignalPro },
  { id: 'terminal', name: 'Ai Terminal', icon: Terminal, color: 'text-blue-500', component: AiCryptoTerminal }, // <--- POSISI DI ATAS RISK SCORE
  { id: 'risk', name: 'Risk Score', icon: ShieldAlert, color: 'text-orange-400', component: RiskScore }, 
  { id: 'whale', name: 'Whale Detector', icon: Waves, color: 'text-blue-400', component: WhaleDetector },
  { id: 'alarm', name: 'Price Alarm', icon: BellRing, color: 'text-rose-400', component: PriceAlarm },
  { id: 'news', name: 'News Crypto', icon: Newspaper, color: 'text-amber-400', component: NewsCrypto },
  { id: 'command', name: 'Command Center', icon: Search, color: 'text-cyan-400', component: CommandCenter },
];

const Dashboard = () => {
  const [activeMenuId, setActiveMenuId] = useState('market');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // STATE DINAMIS KOIN
  const [selectedCoin, setSelectedCoin] = useState('bitcoin'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Handlers
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const handleLogout = useCallback(() => navigate('/login'), [navigate]);

  // Active Menu
  const activeMenu = useMemo(
    () => MENUS.find(m => m.id === activeMenuId) || MENUS[0],
    [activeMenuId]
  );

  const ActiveComponent = activeMenu?.component;
  const currentCoinInfo = ALL_COINS.find(c => c.id === selectedCoin) || ALL_COINS[0];

  const handleSelectCustomCoin = (coinId) => {
    setSelectedCoin(coinId);
  };

  // Filter Koin untuk Dropdown
  const filteredCoins = ALL_COINS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">

      {/* SIDEBAR */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} fixed inset-y-0 left-0 
        bg-slate-900/60 backdrop-blur-2xl border-r border-slate-800/50 
        transition-all duration-300 z-50 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            {isSidebarOpen && (
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic tracking-tighter">
                SIGNALPRO
              </span>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar">
            {MENUS.map(({ id, name, icon: Icon, color }) => {
              const isActive = activeMenuId === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveMenuId(id)}
                  className={`w-full flex items-center p-3 rounded-xl transition-all
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : color} />
                  {isSidebarOpen && (
                    <span className="ml-4 font-bold text-[10px] uppercase tracking-widest truncate">
                      {name}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors group"
            >
              <LogOut size={20} />
              {isSidebarOpen && (
                <span className="ml-4 font-bold text-xs uppercase group-hover:text-rose-400">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8 max-w-7xl mx-auto">

          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3 mb-2 md:mb-0">
              <div className={`h-8 w-1.5 bg-gradient-to-b ${
                activeMenuId === 'signal-pro' || activeMenuId === 'terminal'
                  ? 'from-purple-400 to-blue-500' 
                  : activeMenuId === 'command' ? 'from-cyan-400 to-blue-500'
                  : 'from-indigo-400 to-purple-500'
              } rounded-full`} />
              <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                  {activeMenu.name}
                </h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest ml-4">
                  {activeMenu.id === 'command' 
                    ? 'Search globally...' 
                    : activeMenu.id === 'terminal'
                      ? 'Real-time Institutional Dashboard'
                      : `Current Asset: ${currentCoinInfo.symbol}`
                  }
                </p>
              </div>
            </div>

            {/* Dropdown Koin (Disembunyikan di menu tertentu) */}
            {activeMenu.id !== 'command' && activeMenu.id !== 'news' && (
              <div className="relative w-full md:w-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl transition-colors min-w-[220px] justify-between shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black">
                      {currentCoinInfo.symbol.substring(0,1)}
                    </div>
                    <span className="font-mono font-bold tracking-tighter">{currentCoinInfo.name}</span>
                  </div>
                  <ChevronDown size={16} className={isDropdownOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
                        <input
                          type="text"
                          placeholder="Search assets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-800 text-white pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto p-2 custom-scrollbar">
                      {filteredCoins.map((coin) => (
                        <button
                          key={coin.id}
                          onClick={() => {
                            setSelectedCoin(coin.id);
                            setIsDropdownOpen(false);
                            setSearchTerm("");
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-sm mb-1 last:mb-0 transition-all ${
                            selectedCoin === coin.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span className="font-bold">{coin.name}</span>
                          <span className="text-[10px] font-mono opacity-60 bg-black/20 px-2 py-1 rounded-md">{coin.symbol}</span>
                        </button>
                      ))}
                      {filteredCoins.length === 0 && (
                        <p className="text-center text-slate-600 py-4 text-xs font-bold">Asset not found.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </header>

          {/* DYNAMIC COMPONENT RENDER */}
          <div className="animate-in fade-in zoom-in-[0.99] duration-500">
            {ActiveComponent ? (
              <ActiveComponent 
                coin={selectedCoin} 
                onSelectCoin={handleSelectCustomCoin}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-slate-900/20 rounded-[3rem] border border-dashed border-slate-800">
                <BrainCircuit size={48} className="text-slate-700 mb-4 animate-pulse" />
                <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Initializing Component...</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;