import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Search, TrendingUp, AlertCircle } from 'lucide-react';
// IMPORT SAFEFETCH & API CONFIG
import { safeFetch } from '../../safeFetch';

const Market = ({ coin }) => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fungsi mengambil data menggunakan SafeFetch
  const fetchMarketData = async () => {
    try {
      setError(null);
      
      // Kita menggunakan endpoint CoinGecko Standard
      // SafeFetch akan otomatis menangani error dan mencoba fallback
      const data = await safeFetch('coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
      
      if (!data) {
        throw new Error('Tidak dapat mengambil data. Silakan coba lagi.');
      }
      
      // CoinGecko mengembalikan array langsung, kita mapping agar sesuai struktur
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.name,
        symbol: item.symbol,
        image: item.image, 
        price_usd: item.current_price,
        percent_change_24h: item.price_change_percentage_24h,
        market_cap_usd: item.market_cap,
        volume24: item.total_volume
      }));
      
      setMarketData(formattedData);
      setLoading(false);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error("Error Fetching Data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  // Auto-refresh setiap 45 detik (Aman dari Rate Limit)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData();
    }, 45000); 
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '$0.00';

    const options = {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 1 ? 4 : 2,
      maximumFractionDigits: num < 1 ? 6 : 2,
    };
    return new Intl.NumberFormat('en-US', options).format(num);
  };

  const filteredData = useMemo(() => {
    if (!marketData) return [];
    return marketData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [marketData, searchTerm]);

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            Market Overview <TrendingUp className="text-indigo-500" size={24} />
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Live Data: Top 50 Crypto by Market Cap
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 pl-9 transition-all"
            />
          </div>

          {/* Status Info */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700">
            {loading ? (
              <RefreshCw className="animate-spin text-indigo-400" size={14} />
            ) : (
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
            <span>
              {loading ? 'Updating...' : `Updated: ${lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--'}`}
            </span>
          </div>
          
          {/* Manual Refresh Button */}
          <button 
            onClick={fetchMarketData}
            disabled={loading}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle size={32} />
          <div>
            <h3 className="font-bold text-lg">Error Loading Data</h3>
            <p className="text-sm">{error}. Coba refresh lagi dalam sebentar.</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden flex-1 flex flex-col">
          
          {/* Table */}
          <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 sticky top-0 z-10 shadow-lg">
                <tr>
                  <th scope="col" className="px-6 py-4">Asset</th>
                  <th scope="col" className="px-6 py-4 text-right">Price (USD)</th>
                  <th scope="col" className="px-6 py-4 text-right">24h Change</th>
                  <th scope="col" className="px-6 py-4 text-right hidden md:table-cell">Market Cap</th>
                  <th scope="col" className="px-6 py-4 text-center hidden lg:table-cell">Volume (24h)</th>
                </tr>
              </thead>
              <tbody>
                {loading && marketData.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-700/50">
                      <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-24"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-700 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-700 rounded w-12 ml-auto"></div></td>
                      <td className="px-6 py-4 text-right hidden md:table-cell"><div className="h-4 bg-slate-700 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredData.map((coin) => (
                    <tr 
                      key={coin.id} 
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={coin.image} 
                            alt={coin.name} 
                            className="w-8 h-8 rounded-full object-contain bg-white" 
                          />
                          <div>
                            <div className="font-bold text-base">{coin.name}</div>
                            <div className="text-xs text-slate-500 uppercase font-mono">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right font-mono text-white font-semibold">
                        {formatCurrency(coin.price_usd)}
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold px-2.5 py-1 rounded-lg text-xs flex items-center justify-end gap-1 ${
                          parseFloat(coin.percent_change_24h) >= 0 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {parseFloat(coin.percent_change_24h) >= 0 ? '+' : ''}
                          {parseFloat(coin.percent_change_24h).toFixed(2)}%
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 text-right text-slate-400 font-mono hidden md:table-cell">
                        ${parseInt(coin.market_cap_usd).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-right text-slate-400 font-mono text-xs hidden lg:table-cell">
                        ${parseInt(coin.volume24).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="bg-slate-900/50 px-6 py-3 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
            <span>
              Showing {loading ? '...' : filteredData.length} / {loading ? '...' : 50} assets
            </span>
            <span className="flex items-center gap-1">
              Powered by <span className="text-amber-500 font-bold">CoinGecko API</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;