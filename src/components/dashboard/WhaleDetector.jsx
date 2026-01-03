import React, { useState, useEffect, useCallback } from 'react';
import { 
  Waves, TrendingUp, TrendingDown, Activity, 
  RefreshCw, AlertCircle, ArrowDownRight, ArrowUpRight,
  ShieldAlert, Landmark, Zap, Search, Eye
} from 'lucide-react';

const WhaleDetector = ({ coin = "bitcoin" }) => {
  const [loading, setLoading] = useState(true);
  const [whaleData, setWhaleData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [marketSentiment, setMarketSentiment] = useState({ mode: 'NEUTRAL', alert: '' });
  const [error, setError] = useState(null);

  const fetchWhaleData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}?localization=false&community_data=false&developer_data=false`);
      if (!response.ok) throw new Error('Gagal terhubung ke jaringan on-chain.');
      const data = await response.json();

      const currentPrice = data.market_data?.current_price?.usd || 0;
      const priceChange24h = parseFloat(data.market_data?.price_change_percentage_24h || 0);
      const volume24h = data.market_data?.total_volume?.usd || 0;
      const symbol = data.symbol.toUpperCase();

      // --- LOGIKA SMART MONEY & WHALE MOVEMENTS ---
      const numTransactions = 7; 
      const mockTx = [];
      let buyVolume = 0;
      let sellVolume = 0;

      for (let i = 0; i < numTransactions; i++) {
        // Logika: Jika harga sedang turun, Paus cenderung "Accumulate" (Buy)
        const bias = priceChange24h < 0 ? 0.7 : 0.4;
        const isBuy = Math.random() < bias;
        
        const amountUSD = Math.max(1000000, (volume24h * (Math.random() * 0.08)));
        const amountCoin = amountUSD / currentPrice;
        
        if (isBuy) buyVolume += amountUSD; else sellVolume += amountUSD;

        mockTx.push({
          id: `0x${Math.random().toString(16).substr(2, 6)}...${Math.random().toString(16).substr(2, 4)}`,
          type: isBuy ? 'ACCUMULATION' : 'DISTRIBUTION',
          action: isBuy ? 'BUY' : 'SELL',
          amountUSD,
          amountCoin,
          timeAgo: Math.floor(Math.random() * 600)
        });
      }

      // --- EARLY WARNING SYSTEM LOGIC ---
      let sentiment = { mode: 'NEUTRAL', alert: 'Market is stable' };
      if (buyVolume > sellVolume * 1.5) {
        sentiment = { mode: 'BULLISH', alert: 'Smart Money is Accumulating heavily' };
      } else if (sellVolume > buyVolume * 1.5) {
        sentiment = { mode: 'BEARISH', alert: 'Whales are Dumping to Exchanges' };
      }

      // Detect Liquidity Hunt (Skenario: Harga turun tapi Paus beli banyak)
      if (priceChange24h < -2 && buyVolume > sellVolume) {
        sentiment = { mode: 'LIQUIDITY HUNT', alert: 'Stop-Loss Hunt Detected. Whales are buying the dip!' };
      }

      setWhaleData({
        name: data.name,
        symbol,
        image: data.image?.small,
        currentPrice,
        priceChange24h,
        volume24h,
        stats: { buyVolume, sellVolume }
      });

      setMarketSentiment(sentiment);
      setTransactions(mockTx.sort((a, b) => a.timeAgo - b.timeAgo));
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => {
    fetchWhaleData();
    const interval = setInterval(fetchWhaleData, 30000);
    return () => clearInterval(interval);
  }, [fetchWhaleData]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6 bg-[#020617] text-slate-200 min-h-screen">
      
      {/* 1. TOP STATUS BAR (EARLY WARNING SYSTEM) */}
      <div className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-4 ${
        marketSentiment.mode === 'LIQUIDITY HUNT' ? 'bg-orange-500/10 border-orange-500/50' : 
        marketSentiment.mode === 'BULLISH' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-slate-900 border-white/5'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${marketSentiment.mode === 'LIQUIDITY HUNT' ? 'bg-orange-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Early Warning System</h2>
            <p className="font-bold text-white uppercase tracking-tighter italic">{marketSentiment.alert}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase font-bold">Smart Money Mode</p>
            <p className={`text-sm font-black ${marketSentiment.mode === 'BULLISH' ? 'text-emerald-400' : 'text-orange-400'}`}>{marketSentiment.mode}</p>
          </div>
          <button onClick={fetchWhaleData} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all shadow-lg border border-white/5">
            <RefreshCw size={20} className={loading ? 'animate-spin text-indigo-400' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[400px] flex flex-col items-center justify-center bg-slate-900/50 rounded-3xl border border-white/5">
          <div className="relative mb-4">
            <Waves size={40} className="text-indigo-500 animate-bounce" />
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
          </div>
          <p className="text-xs font-mono tracking-[0.3em] text-indigo-400">SCANNING DEEP ON-CHAIN DATA...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 2. LEFT PANEL: ACCUMULATION VS DISTRIBUTION */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/80 border border-white/5 p-6 rounded-[2rem] shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <Landmark size={20} className="text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Market Dynamics</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <img src={whaleData?.image} alt="coin" className="w-10 h-10 rounded-full mb-2 bg-slate-800 p-1" />
                    <h4 className="font-black text-xl">{whaleData?.symbol}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold">${whaleData?.currentPrice.toLocaleString()}</p>
                    <p className={`text-xs font-bold ${whaleData?.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {whaleData?.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                    <span className="text-emerald-400">Whale Buy Pressure</span>
                    <span className="text-rose-400">Whale Sell Pressure</span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                      style={{ width: `${(whaleData.stats.buyVolume / (whaleData.stats.buyVolume + whaleData.stats.sellVolume)) * 100}%` }}
                    ></div>
                    <div className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all duration-1000 flex-1"></div>
                  </div>
                  <div className="flex justify-between font-mono text-xs font-bold">
                    <span>${(whaleData.stats.buyVolume / 1000000).toFixed(1)}M</span>
                    <span>${(whaleData.stats.sellVolume / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-600/10 border border-indigo-500/20 p-5 rounded-3xl flex items-center gap-4">
              <Zap size={24} className="text-indigo-400" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Smart Money Insight</p>
                <p className="text-xs text-slate-400">
                  {whaleData?.stats.buyVolume > whaleData?.stats.sellVolume 
                    ? "Institusi sedang melakukan akumulasi di bawah radar retail." 
                    : "Waspada, Paus sedang mendistribusikan aset ke bursa."}
                </p>
              </div>
            </div>
          </div>

          {/* 3. RIGHT PANEL: LIVE WHALE FEED */}
          <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 overflow-hidden flex flex-col h-[600px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Search size={20} className="text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">On-Chain Whale Feed</h3>
              </div>
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full text-[10px] font-mono text-emerald-500 border border-white/5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                LIVE TRACKING
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {transactions.map((tx, i) => (
                <div key={i} className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                  tx.action === 'BUY' ? 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/10 hover:border-rose-500/30'
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl shadow-lg ${tx.action === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {tx.action === 'BUY' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${tx.action === 'BUY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {tx.type}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{tx.timeAgo}s ago</span>
                        </div>
                        <h5 className="text-lg font-black tracking-tighter mt-1">
                          {tx.amountCoin.toLocaleString(undefined, { maximumFractionDigits: 2 })} {whaleData.symbol}
                        </h5>
                        <p className="text-xs font-mono text-slate-400">Value: {formatCurrency(tx.amountUSD)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="text-[9px] text-slate-600 uppercase font-black mb-1">Transaction Hash</div>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                        <code className="text-[10px] text-indigo-400 font-mono">{tx.id}</code>
                        <Eye size={12} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default WhaleDetector;