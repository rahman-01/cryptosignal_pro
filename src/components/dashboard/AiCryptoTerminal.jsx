import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  BarChart3, Waves, Fingerprint, Terminal, Cpu, AlertTriangle, 
  CheckCircle2, Play, ShieldAlert, Wallet, Target, Info, TrendingUp,
  Loader2, Zap, BrainCircuit, Activity, History, FlaskConical
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  ReferenceLine, CartesianGrid, LineChart, Line
} from 'recharts';

const AiCryptoTerminal = ({ coin = "bitcoin" }) => {
  const [loading, setLoading] = useState(true);
  const [isexecuting, setIsExecuting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [userInputPrice, setUserInputPrice] = useState("");
  const [walletBalance, setWalletBalance] = useState("1000"); 
  const [coinInfo, setCoinInfo] = useState({ symbol: '', name: '', image: '', change24h: 0 });
  const [marketSentiment, setMarketSentiment] = useState({ mode: 'NEUTRAL', alert: '' });
  const [aiLogs, setAiLogs] = useState(["[SYS] Terminal Initialized...", "[AI] Backtest Engine Standby."]);
  
  // State Baru untuk Backtest
  const [backtestResult, setBacktestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);

  const addLog = (msg) => {
    setAiLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // --- FUNGSI BACKTEST ENGINE ---
  const runBacktest = () => {
    if (!userInputPrice || historicalData.length === 0) return;
    
    setIsTesting(true);
    addLog("STARTING BACKTEST SIMULATION...");
    
    setTimeout(() => {
      const entry = parseFloat(userInputPrice);
      const tp = entry * 1.10;
      const sl = entry * 0.95;
      
      let hitsTP = 0;
      let hitsSL = 0;
      const priceOnly = historicalData.map(d => d.price);
      
      priceOnly.forEach(p => {
        if (p >= tp) hitsTP++;
        if (p <= sl) hitsSL++;
      });

      const winRate = ((hitsTP / (hitsTP + hitsSL || 1)) * 100).toFixed(1);
      
      setBacktestResult({
        winRate,
        hitsTP,
        hitsSL,
        status: winRate > 50 ? 'PROFITABLE' : 'RISKY'
      });
      
      setIsTesting(false);
      addLog(`BACKTEST COMPLETE: ${winRate}% Success Probability.`);
    }, 2000);
  };

  const handleExecute = () => {
    if (tradingAnalysis.status !== 'EXECUTE') return;
    setIsExecuting(true);
    addLog("EXECUTING SMART ORDER...");
    
    setTimeout(() => {
      const cost = parseFloat(tradingAnalysis.suggestedLot);
      setWalletBalance(prev => (parseFloat(prev) - cost).toFixed(2));
      setIsExecuting(false);
      addLog(`ORDER SUCCESS: Entered at $${userInputPrice}`);
      setUserInputPrice("");
      setBacktestResult(null);
    }, 1500);
  };

  const tradingAnalysis = useMemo(() => {
    const target = parseFloat(userInputPrice);
    const balance = parseFloat(walletBalance);
    if (!target || !currentPrice) return { status: 'WAITING', score: 0, desc: "Awaiting Command..." };

    let score = 50;
    if (target < currentPrice) score += 20;
    if (backtestResult && backtestResult.winRate > 60) score += 20;

    const riskPercentage = score > 70 ? 10 : 2; 
    return {
      score: Math.min(score, 99),
      status: score >= 75 ? 'EXECUTE' : score < 45 ? 'ABORT' : 'WATCH',
      suggestedLot: (balance * (riskPercentage / 100)).toFixed(2),
      tp: (target * 1.10).toFixed(2),
      sl: (target * 0.95).toFixed(2),
      desc: score >= 75 ? "Neural Network confirms entry." : "Analyzing Market Fragments..."
    };
  }, [userInputPrice, currentPrice, walletBalance, backtestResult]);

  const fetchData = useCallback(async () => {
    try {
      // Ambil data historis untuk Backtest (24 jam terakhir)
      const histRes = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=1`);
      const histData = await histRes.json();
      
      const formattedHist = histData.prices.map(p => ({ time: p[0], price: p[1] }));
      setHistoricalData(formattedHist);

      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}?localization=false&tickers=false`);
      const data = await res.json();
      if (data?.market_data) {
        setCurrentPrice(data.market_data.current_price.usd);
        setCoinInfo({
          symbol: data.symbol.toUpperCase(),
          name: data.name,
          image: data.image.small,
          change24h: data.market_data.price_change_percentage_24h
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [coin]);

  useEffect(() => {
    fetchData();
    const inv = setInterval(fetchData, 60000);
    return () => clearInterval(inv);
  }, [fetchData]);

  if (loading) return <div className="h-screen bg-[#020617] flex flex-col items-center justify-center font-mono text-cyan-400"><Cpu className="animate-spin mb-4" size={40} /><p className="animate-pulse tracking-widest text-xs">CALIBRATING SYSTEMS...</p></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 p-4 font-mono">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ROW 1: HEADER & BACKTEST TRIGGER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row gap-6 items-center">
             <div className="flex items-center gap-4 border-r border-white/10 pr-6">
               <img src={coinInfo.image} className="w-12 h-12 rounded-full border border-cyan-500/30" alt="" />
               <div>
                 <h2 className="text-xl font-bold text-white italic">{coinInfo.name} Terminal</h2>
                 <p className="text-[9px] text-cyan-500 uppercase tracking-[3px]">Neural-Link Active</p>
               </div>
             </div>
             
             <div className="flex-1 flex gap-3 w-full">
               <input 
                 type="number" 
                 placeholder="ENTRY PRICE..." 
                 value={userInputPrice}
                 onChange={(e) => setUserInputPrice(e.target.value)}
                 className="flex-1 bg-black/60 border border-cyan-500/20 rounded-xl py-3 px-4 text-cyan-400 text-sm focus:border-cyan-500 outline-none"
               />
               <button 
                 onClick={runBacktest}
                 disabled={!userInputPrice || isTesting}
                 className="px-6 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 text-[10px] font-bold uppercase hover:bg-indigo-600/40 transition-all flex items-center gap-2"
               >
                 {isTesting ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />} Backtest
               </button>
               <button 
                 onClick={handleExecute}
                 disabled={tradingAnalysis.status !== 'EXECUTE' || isexecuting}
                 className={`px-8 rounded-xl font-black text-[10px] uppercase tracking-widest ${tradingAnalysis.status === 'EXECUTE' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-slate-800 text-slate-500'}`}
               >
                 Execute
               </button>
             </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-6 text-center">
            <p className="text-[10px] text-slate-500 uppercase mb-2">Backtest Success Rate</p>
            <div className={`text-4xl font-black ${backtestResult ? 'text-white' : 'text-slate-700'}`}>
              {backtestResult ? `${backtestResult.winRate}%` : '--'}
            </div>
            {backtestResult && <div className="text-[9px] mt-2 text-cyan-500 font-bold uppercase tracking-widest italic">{backtestResult.status}</div>}
          </div>
        </div>

        {/* ROW 2: CHART & BACKTEST DATA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 bg-black/40 border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black"><Activity size={14} className="text-cyan-500"/> Live Order Flow</div>
               <div className="text-xl font-bold text-white tracking-widest">${currentPrice.toLocaleString()}</div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData.slice(-40)}>
                  <defs>
                    <linearGradient id="colorBack" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#colorBack)" strokeWidth={2} />
                  {userInputPrice && <ReferenceLine y={parseFloat(userInputPrice)} stroke="#f59e0b" label={{value: 'ENTRY', fill: '#f59e0b', fontSize: 10}} />}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-black/60 p-4 rounded-xl font-mono text-[10px] space-y-1 border border-white/5">
               {aiLogs.map((log, i) => <div key={i} className={i === aiLogs.length -1 ? "text-cyan-400" : "text-slate-600"}>{log}</div>)}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Simulation Results Card */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-5"><History size={100} /></div>
              <h3 className="text-[10px] text-indigo-400 mb-4 font-black uppercase flex items-center gap-2"><Target size={14}/> Simulation Data</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500">TP HITS (24H)</span>
                  <span className="text-emerald-400 font-bold">{backtestResult?.hitsTP || 0}x</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-500">SL HITS (24H)</span>
                  <span className="text-rose-500 font-bold">{backtestResult?.hitsSL || 0}x</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 uppercase">Suggested Lot</span>
                  <span className="text-white font-bold">${tradingAnalysis.suggestedLot}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 uppercase">AI Score</span>
                  <span className="text-cyan-400 font-black">{tradingAnalysis.score}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 border border-white/10 rounded-2xl p-6">
              <p className="text-[10px] text-indigo-300 font-bold mb-2 uppercase">Neural Recommendation</p>
              <p className="text-sm text-white italic leading-relaxed">"{tradingAnalysis.desc}"</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AiCryptoTerminal;