import React, { useState } from 'react';
import { 
  Search, TrendingUp, AlertCircle, ChevronRight
} from 'lucide-react';
import { searchCoin } from '../../utils/searchCoin';

const CommandCenter = ({ onSelectCoin }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Default array kosong
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Ketik nama koin...');

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    console.log("Input changed to:", value); // DEBUG: Cek apakah input kebaca

    if (value.length < 2) {
      setResults([]); // Kosongkan hasil jika input kurang dari 2
      setMessage('Ketik minimal 2 huruf...');
      return;
    }

    setLoading(true);
    setMessage('Mencari di Database...');

    const coins = await searchCoin(value);

    console.log("Coins received from searchCoin:", coins); // DEBUG: Cek data mentah

    if (coins && coins.length > 0) {
      setResults(coins);
      setMessage(`Ditemukan ${coins.length} koin.`);
    } else {
      setResults([]);
      setMessage('Koin tidak ditemukan di database lokal maupun global.');
    }

    setLoading(false);
  };

  const handleSelect = (coin) => {
    console.log("Selected Coin:", coin); // DEBUG: Cek apakah tombol diklik
    onSelectCoin(coin.id);
    setQuery('');
    setResults([]);
    setMessage('Koin dipilih. Silakan menganalisa.');
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500 bg-slate-900/40 rounded-xl border border-slate-700/50 p-6">
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-lg text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Command Center</h2>
            <p className="text-xs text-slate-400">Global & Local Search Engine</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 relative shadow-inner">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="CARI COIN... (Cth: Bitcoin, SOL, PEPE)"
            className="w-full bg-slate-900 border-2 border-slate-700 text-white rounded-2xl py-4 pl-16 pr-4 text-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
            autoFocus
          />
        </div>
        {loading && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* STATUS MESSAGE */}
      <div className="text-xs font-mono text-slate-400 text-center min-h-[20px]">
        {message}
      </div>

      {/* RESULTS LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-800/20 rounded-xl border border-slate-700/50">
        {query === '' ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <TrendingUp size={64} className="mb-4 opacity-10" />
            <p className="text-sm font-bold">Ketik nama koin di atas.</p>
            <p className="text-xs">Pencarian didukung: Local Database + CoinGecko Global.</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {results.map((coin, index) => (
              <button
                key={index} // Gunakan index sebagai key agar aman dari undefined
                onClick={() => handleSelect(coin)}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-700/40 hover:bg-cyan-500/10 border border-slate-600 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {coin.symbol.substring(0,1)}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-slate-200 group-hover:text-cyan-400 transition-colors">
                      {coin.name}
                    </div>
                    <div className="text-xs text-slate-500 uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
            
            {!loading && results.length === 0 && query !== '' && (
              <div className="text-center py-10 text-rose-400">
                <AlertCircle size={32} className="mb-2 opacity-50" />
                <p className="font-bold">KOIN TIDAK DITEMUKAN</p>
                <p className="text-xs">Pastikan ejaan koin benar.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenter;