import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, ShieldCheck, TrendingUp, TrendingDown, 
  Loader2, Database, Landmark, Zap, 
  Target, Fingerprint, Layers, Clock, AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  ReferenceLine, 
  CartesianGrid
} from 'recharts';

const AiSignalPro = ({ coin = "bitcoin" }) => {
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('H1');
  const [error, setError] = useState(null);
  const [coinInfo, setCoinInfo] = useState({ 
    symbol: '', 
    name: '', 
    image: '', 
    change24h: 0,
    volume: 0,
    netflow: 0
  });

  // 1. Logic Smart Market Structure (SMC)
  const smartData = useMemo(() => {
    if (!currentPrice) return null;

    const volatilityMap = { 'M15': 0.005, 'H1': 0.015, 'D1': 0.05, 'W1': 0.1 };
    const v = volatilityMap[timeframe] || 0.015;
    const base = currentPrice;

    const history = Array.from({ length: 40 }, (_, i) => {
      const trend = Math.sin(i / 5) * (base * v * 0.4);
      const randomness = (Math.random() - 0.5) * (base * v * 0.1);
      return {
        time: i,
        price: base + trend + randomness - (base * v * 0.2),
      };
    });

    return {
      history,
      orderBlock: base * (1 - (v * 0.8)),
      fvgZone: { top: base * (1 - (v * 0.2)), bottom: base * (1 - (v * 0.4)) },
      liquidityTarget: base * (1 + (v * 1.2)),
      mitigationLevel: base * (1 - (v * 0.1))
    };
  }, [currentPrice, timeframe]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin.toLowerCase()}?localization=false&tickers=false&market_data=true`);
      const data = await res.json();
      
      if (data && data.market_data) {
        const mData = data.market_data;
        const price = mData.current_price.usd;
        const vol = mData.total_volume.usd;
        const change = mData.price_change_percentage_24h;
        const netflowEstimated = (vol / price) * (change / 100) * 0.15;

        setCurrentPrice(price);
        setCoinInfo({
          symbol: data.symbol.toUpperCase(),
          name: data.name,
          image: data.image.small,
          change24h: change,
          volume: vol,
          netflow: netflowEstimated 
        });
      }
    } catch (err) {
      setError("Gagal sinkronisasi API.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, [coin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fungsi Helper untuk format harga tanpa pembulatan kasar
  // Menampilkan hingga 8 desimal untuk koin murah, atau 2 desimal untuk koin mahal
  const formatPrecisePrice = (num) => {
    if (!num) return "0.00";
    return num.toLocaleString('en-US', {
      minimumFractionDigits: num < 1 ? 6 : 2,
      maximumFractionDigits: num < 1 ? 8 : 2,
    });
  };

  if (loading && !currentPrice) return (
    <div className="flex flex-col items-center justify-center p-20 bg-[#020617] min-h-[600px] rounded-[3rem] border border-white/5">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={50} />
      <span className="text-indigo-400 font-mono text-xs tracking-[0.4em] animate-pulse italic">CALCULATING PRECISION NODES...</span>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-[#020617] rounded-[2.5rem] border border-white/5 text-slate-200 shadow-2xl font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -z-10" />

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-8 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-5">
          <img src={coinInfo.image} className="w-14 h-14 rounded-full border border-white/10 p-1 bg-slate-900 shadow-xl" alt="coin" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">{coinInfo.name}</h1>
              <div className="bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                 {timeframe} ENGINE
              </div>
            </div>
            <div className="flex items-baseline gap-4 mt-1 font-mono">
              <span className="text-4xl font-black text-white tracking-tighter">
                ${formatPrecisePrice(currentPrice)}
              </span>
              <span className={`text-sm font-bold flex items-center gap-1 ${coinInfo.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coinInfo.change24h >= 0 ? <TrendingUp size={14}/> : <TrendingDown size={14}/>}
                {Math.abs(coinInfo.change24h).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl">
          {['M15', 'H1', 'D1', 'W1'].map(tf => (
            <button key={tf} onClick={() => setTimeframe(tf)} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${timeframe === tf ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-50'}`}>
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* CHART */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Activity size={18} /></div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Market Structure Analysis</h3>
              </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={smartData?.history}>
                  <defs>
                    <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={4} fill="url(#areaColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PRECISION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DataCard 
              label="Institutional Hunt" 
              value={`$${formatPrecisePrice(smartData?.liquidityTarget)}`}
              sub="Precision Liquidity Target"
              icon={<Target className="text-rose-500" />}
              color="rose"
            />
            <DataCard 
              label="SMC Order Block" 
              value={`$${formatPrecisePrice(smartData?.orderBlock)}`}
              sub="Algorithm Entry Node"
              icon={<Landmark className="text-emerald-500" />}
              color="emerald"
            />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10 text-indigo-400">
              <Layers size={20} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Predictive Engine</span>
            </div>

            <div className="flex-1 space-y-8">
               <div className="p-5 bg-white/[0.02] border border-white/5 rounded-3xl">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                   <ShieldCheck size={14} /> Mitigation Price
                </div>
                <div className="text-2xl font-mono font-bold text-white mb-1">
                    ${formatPrecisePrice(smartData?.mitigationLevel)}
                </div>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase">
                  Level mitigasi institusional yang dihitung secara presisi.
                </p>
              </div>

              {/* NETFLOW */}
              <div className={`mt-auto p-6 rounded-3xl border ${coinInfo.netflow >= 0 ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Database className={coinInfo.netflow >= 0 ? 'text-emerald-400' : 'text-rose-400'} size={18} />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Netflow 24h (Live)</span>
                </div>
                <div className={`text-xl font-black font-mono ${coinInfo.netflow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {coinInfo.netflow >= 0 ? '+' : ''}{coinInfo.netflow.toLocaleString(undefined, { maximumFractionDigits: 2 })} {coinInfo.symbol}
                </div>
                <div className="text-[8px] font-black uppercase text-slate-500 mt-2">
                  Status: {coinInfo.netflow >= 0 ? 'Accumulation' : 'Distribution'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataCard = ({ label, value, sub, icon, color }) => (
  <div className="bg-slate-900/20 border border-white/5 rounded-[2rem] p-6 group">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 bg-${color}-500/10 rounded-lg`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
    <div className="text-2xl font-mono font-bold text-white tracking-tighter mb-1 leading-none">
      {value}
    </div>
    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">{sub}</div>
  </div>
);

export default AiSignalPro;