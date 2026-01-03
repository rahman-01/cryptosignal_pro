import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Activity, Zap, RefreshCw, Shield, Target, DollarSign, AlertCircle
} from 'lucide-react';

const TechnicalGuru = ({ coin = "bitcoin" }) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  // --- 1. LOGIKA INDIKATOR MATEMATIS ---
  const calculateSMA = (data, period) => {
    if (!data || data.length < period) return null;
    const subset = data.slice(-period);
    return subset.reduce((a, b) => a + b, 0) / period;
  };

  const calculateRSI = (prices, period = 14) => {
    if (!prices || prices.length <= period) return 50;
    let gains = [];
    let losses = [];
    for (let i = 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      gains.push(diff > 0 ? diff : 0);
      losses.push(diff < 0 ? Math.abs(diff) : 0);
    }
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
    for (let i = period; i < gains.length; i++) {
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  // --- 2. FETCH DATA ---
  const fetchAnalysis = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const coinId = coin.toLowerCase().trim();
      const targetUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=200&interval=daily`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

      let rawData;
      try {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error();
        rawData = await response.json();
      } catch (e) {
        const proxyRes = await fetch(proxyUrl);
        const proxyJson = await proxyRes.json();
        rawData = JSON.parse(proxyJson.contents);
      }

      if (!rawData || !rawData.prices) throw new Error('Data tidak valid atau API limit.');

      const prices = rawData.prices.map(p => p[1]);
      const currentPriceVal = prices[prices.length - 1];
      
      const rsi = calculateRSI(prices, 14);
      const sma7 = calculateSMA(prices, 7);
      const sma25 = calculateSMA(prices, 25);
      const sma50 = calculateSMA(prices, 50);
      const sma200 = calculateSMA(prices, 200);

      const shortTermStatus = rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : (currentPriceVal > sma7 ? 'BULLISH' : 'BEARISH');
      const mediumTermStatus = sma25 > sma50 ? 'UPTREND' : 'DOWNTREND';
      const longTermStatus = currentPriceVal > sma200 ? 'STRONG BULL' : 'MACRO BEAR';

      const last14Days = prices.slice(-14);
      const volatility = ((Math.max(...last14Days) - Math.min(...last14Days)) / Math.min(...last14Days)) * 100;

      setAnalysis({
        price: currentPriceVal,
        rsi,
        short: { status: shortTermStatus, val: sma7 },
        medium: { status: mediumTermStatus, val: sma50 },
        long: { status: longTermStatus, val: sma200 },
        volatility
      });

      setChartData(rawData.prices.slice(-30).map(p => ({
        date: new Date(p[0]).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        price: p[1]
      })));
      
    } catch (err) {
      setError(err.message.includes('Unexpected') ? 'ID Koin Salah atau API Limit.' : err.message);
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // FIX: Menggunakan analysis?.price sebagai dependensi dan fallback
  const formatPrice = useMemo(() => (val) => {
    const basePrice = analysis?.price || 0;
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: basePrice < 1 ? 4 : 2 
    }).format(val || 0);
  }, [analysis?.price]);

  if (loading) return (
    <div className="bg-slate-950 min-h-[400px] flex flex-col items-center justify-center rounded-3xl border border-slate-800">
      <RefreshCw className="animate-spin text-indigo-500 mb-4" size={40} />
      <div className="text-center animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">Scanning Blockchain Data...</div>
    </div>
  );

  if (error) return (
    <div className="bg-slate-950 p-10 flex flex-col items-center justify-center rounded-3xl border border-rose-900/30 text-center">
      <AlertCircle className="text-rose-500 mb-4" size={48} />
      <h2 className="text-white font-black mb-2 uppercase tracking-tighter">Connection Failed</h2>
      <p className="text-slate-400 text-sm mb-6 max-w-xs">{error}</p>
      <button onClick={fetchAnalysis} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all flex items-center gap-2">
        <RefreshCw size={16}/> Retry Node
      </button>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 bg-slate-950 text-slate-200 rounded-[2.5rem] border border-slate-800 shadow-2xl font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-slate-800/50 pb-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/30">
            <Activity size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent italic leading-tight uppercase">
              {coin} Guru
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
              <Shield size={12} className="text-indigo-500"/> Institutional Analytics
            </p>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md px-8 py-5 rounded-[2rem] border border-slate-800/50 flex flex-col items-end shadow-inner">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Market
          </div>
          <div className="text-4xl font-mono font-black text-white tracking-tighter">
            {formatPrice(analysis.price)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <StatusCard 
          time="Short Term" 
          title="SMA 7" 
          status={analysis.short.status} 
          priceVal={formatPrice(analysis.short.val)}
          icon={<Zap size={20}/>}
          color={analysis.short.status.includes('BULL') || analysis.short.status === 'OVERSOLD' ? 'text-emerald-400' : 'text-rose-400'}
        />
        <StatusCard 
          time="Medium Term" 
          title="SMA 50" 
          status={analysis.medium.status} 
          priceVal={formatPrice(analysis.medium.val)}
          icon={<TrendingUp size={20}/>}
          color={analysis.medium.status === 'UPTREND' ? 'text-indigo-400' : 'text-rose-400'}
        />
        <StatusCard 
          time="Long Term" 
          title="SMA 200" 
          status={analysis.long.status} 
          priceVal={formatPrice(analysis.long.val)}
          icon={<Shield size={20}/>}
          color={analysis.long.status === 'STRONG BULL' ? 'text-purple-400' : 'text-slate-500'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        <div className="lg:col-span-3 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl relative overflow-hidden group">
          <h3 className="text-[10px] font-black mb-10 flex items-center gap-3 text-slate-500 uppercase tracking-[0.2em]">
            <Target size={16} className="text-indigo-500"/> Price Trajectory (30D)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px' }} 
                  itemStyle={{ color: '#818cf8' }}
                />
                <Area type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/50 flex flex-col justify-center h-full backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 text-left border-b border-slate-800/50 pb-3">Oscillator</div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400">RSI (14)</span>
              <span className={`text-3xl font-mono font-black ${analysis.rsi > 70 ? 'text-rose-500' : analysis.rsi < 30 ? 'text-emerald-500' : 'text-indigo-400'}`}>
                {Math.round(analysis.rsi)}
              </span>
            </div>
            <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-slate-700/50 p-[2px]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-1000 rounded-full"
                style={{ width: `${analysis.rsi}%` }}
              />
            </div>
          </div>
          <div className="space-y-4">
            <IndicatorDetail label="Risk" value={analysis.volatility > 10 ? 'Aggressive' : 'Stable'} isAlert={analysis.volatility > 10} />
            <IndicatorDetail label="Volatility" value={`${analysis.volatility.toFixed(1)}%`} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusCard = React.memo(({ time, title, status, priceVal, icon, color }) => (
  <div className="group bg-slate-900/40 p-7 rounded-[2rem] border border-slate-800/50 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 ${color}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{time}</span>
    </div>
    <div className={`text-2xl font-black mb-1 tracking-tighter ${color} uppercase italic`}>{status}</div>
    <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-800/50">
      <DollarSign size={16} className="text-slate-600" />
      <div>
        <div className="text-white font-mono font-bold text-sm leading-none">{priceVal}</div>
        <div className="text-[9px] text-slate-600 font-bold uppercase mt-1.5">{title}</div>
      </div>
    </div>
  </div>
));

const IndicatorDetail = ({ label, value, isAlert }) => (
  <div className="flex justify-between items-center p-5 bg-slate-950/40 rounded-2xl border border-slate-800/50">
    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
    <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${isAlert ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
      {value}
    </div>
  </div>
);

export default TechnicalGuru;