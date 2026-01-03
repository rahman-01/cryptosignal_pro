import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, AlertOctagon, Zap, Timer, 
  ArrowRightLeft, TrendingUp, Info, AlertTriangle,
  Scale, RefreshCw, Cpu, Fingerprint
} from 'lucide-react';

const QuickSwapAdvisor = ({ coin = "bitcoin" }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState(null);

  const analyzeHoldingStrategy = (score, turnover, mCap) => {
    if (score >= 85 && mCap > 1000000000) {
      return {
        strategy: "LONG TERM HOLD",
        duration: "7+ Days",
        action: "ACCUMULATE",
        color: "text-emerald-400",
        glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        note: "Aset Blue Chip. Resiko rug-pull hampir nol."
      };
    } else if (score >= 60 && turnover > 5) {
      return {
        strategy: "SWING TRADE",
        duration: "24 - 48 Hours",
        action: "MONITOR",
        color: "text-cyan-400",
        glow: "shadow-[0_0_40px_rgba(6,182,212,0.2)]",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5",
        note: "Likuiditas bagus. Aman untuk hold jangka pendek."
      };
    } else if (score >= 40 && turnover > 15) {
      return {
        strategy: "SCALPING ONLY",
        duration: "Under 1 Hour",
        action: "QUICK SWAP",
        color: "text-amber-400",
        glow: "shadow-[0_0_40px_rgba(245,158,11,0.2)]",
        border: "border-amber-500/30",
        bg: "bg-amber-500/5",
        note: "Sangat volatil. Ambil profit segera."
      };
    } else {
      return {
        strategy: "IMMEDIATE EXIT",
        duration: "0 Minutes",
        action: "SELL / AVOID",
        color: "text-rose-500",
        glow: "shadow-[0_0_40px_rgba(244,63,94,0.3)]",
        border: "border-rose-500/30",
        bg: "bg-rose-500/5",
        note: "Indikasi manipulasi atau likuiditas mati."
      };
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Gunakan ID koin yang valid (lowercase)
    const coinId = coin.toLowerCase().trim();
    const targetUrl = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true`;
    
    // Proxy AllOrigins untuk menembus CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
      let finalData;
      
      try {
        // Percobaan 1: Direct Fetch
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error("Blocked by CORS/RateLimit");
        finalData = await response.json();
      } catch (err) {
        // Percobaan 2: Proxy Fetch (Solusi CORS)
        console.log("CORS/Direct link failed. Retrying via Proxy...");
        const proxyRes = await fetch(proxyUrl);
        if (!proxyRes.ok) throw new Error("Proxy server unreachable");
        const proxyJson = await proxyRes.json();
        
        // Penting: AllOrigins membungkus data di properti 'contents' sebagai String
        finalData = JSON.parse(proxyJson.contents);
      }

      if (!finalData || !finalData.market_data) {
        throw new Error("Coin not found or API limit reached");
      }

      const mCap = finalData.market_data.market_cap?.usd || 0;
      const vol = finalData.market_data.total_volume?.usd || 0;
      const turnover = mCap > 0 ? (vol / mCap) * 100 : 0;
      
      let score = 30;
      if (mCap > 10000000) score += 20;
      if (mCap > 500000000) score += 40;
      if (turnover > 3) score += 10;

      setData({ 
        score, 
        mCap, 
        turnover, 
        symbol: finalData.symbol?.toUpperCase() || '???' 
      });
      setAdvice(analyzeHoldingStrategy(score, turnover, mCap));
    } catch (err) {
      setError(err.message === "Unexpected token 'O', \"Object not \"... is not valid JSON" 
        ? "Coin ID Invalid" 
        : "Node Error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return (
    <div className="p-12 rounded-[2.5rem] bg-slate-950/80 border border-indigo-500/20 flex flex-col items-center justify-center space-y-4 backdrop-blur-xl">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="font-mono text-[10px] tracking-[0.4em] text-indigo-400 animate-pulse uppercase text-center">Bypassing_Cors_Node...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-rose-950/20 backdrop-blur-3xl border border-rose-500/30 rounded-[2.5rem] text-center space-y-4">
      <AlertOctagon className="text-rose-500 mx-auto" size={32} />
      <p className="font-mono text-[10px] text-rose-300 tracking-widest uppercase">{error}</p>
      <button onClick={fetchData} className="px-6 py-2 bg-rose-500/20 hover:bg-rose-500/40 rounded-xl text-[9px] text-white font-black transition-all border border-rose-500/30">RE-INITIALIZE</button>
    </div>
  );

  return (
    <div className="w-full space-y-4 font-mono">
      {/* HEADER CARD */}
      <div className={`relative overflow-hidden p-6 rounded-[2.5rem] border ${advice.border} ${advice.bg} backdrop-blur-md ${advice.glow} transition-all duration-700`}>
        <div className="absolute top-0 right-0 p-6 opacity-5 text-white pointer-events-none">
          <Cpu size={80} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black/50 rounded-xl border border-white/10">
                <Fingerprint className={advice.color} size={24} />
              </div>
              <div>
                <p className="text-[8px] text-slate-500 font-black tracking-widest uppercase">Asset Protocol</p>
                <h2 className="text-xl font-black text-white">{data.symbol}/USD</h2>
              </div>
            </div>
            <div className={`px-4 py-1 rounded-full border ${advice.border} bg-black/40 text-[9px] font-black ${advice.color}`}>
              {advice.action}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Vector</p>
              <p className="text-sm font-black text-white uppercase italic">{advice.strategy}</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Max Duration</p>
              <div className={`text-sm font-black flex items-center justify-end gap-1 ${advice.color}`}>
                <Timer size={14} /> {advice.duration}
              </div>
            </div>
          </div>

          <div className="p-4 bg-black/30 border border-white/5 rounded-2xl">
            <p className="text-[10px] text-slate-400 leading-relaxed italic">
              "System Note: {advice.note}"
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-500 uppercase font-black text-[8px]">
            <Scale size={12} /> Market Cap
          </div>
          <div className="text-sm font-black text-white">${(data.mCap / 1e6).toFixed(1)}M</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2 text-slate-500 uppercase font-black text-[8px]">
            <Zap size={12} /> Liquidity
          </div>
          <div className="text-sm font-black text-cyan-400">{data.turnover.toFixed(2)}%</div>
        </div>
      </div>

      <button onClick={fetchData} className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-[9px] font-black tracking-[0.3em] text-slate-500 hover:text-white transition-all">
        EXECUTE_RE_SCAN
      </button>
    </div>
  );
};

export default QuickSwapAdvisor;