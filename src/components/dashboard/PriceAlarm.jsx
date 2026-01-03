import React, { useState, useEffect, useCallback } from 'react';
import { 
  BellRing, Settings2, Lock, Cpu, Radio, Zap, XCircle, 
  RefreshCw, Clock, Target, BrainCircuit, ChevronRight, Layers
} from 'lucide-react';

const TelegramPriceAlarmUltimate = ({ coin = "bitcoin" }) => {
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [targets, setTargets] = useState([
    { id: 1, value: '', label: 'TP 1', triggered: false },
    { id: 2, value: '', label: 'TP 2', triggered: false },
    { id: 3, value: '', label: 'TP 3', triggered: false }
  ]);
  const [status, setStatus] = useState('IDLE'); // IDLE, ARMED
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({ botToken: '', chatId: '' });

  // --- MULTI-TARGET AI PREDICTOR ---
  const getAiInsight = (targetVal) => {
    if (!targetVal || price === 0) return null;
    const diff = ((targetVal - price) / price) * 100;
    const probability = Math.max(5, Math.min(95, 100 - Math.abs(diff * 4)));
    return {
      prob: probability.toFixed(0),
      side: diff > 0 ? "LONG" : "SHORT"
    };
  };

  const fetchMarketData = useCallback(async () => {
    try {
      const targetUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetch(proxyUrl);
      const json = await res.json();
      const data = JSON.parse(json.contents);
      const currentPrice = data[coin].usd;
      setPrice(currentPrice);

      // Cek Multi-Target
      if (status === 'ARMED') {
        targets.forEach((t, index) => {
          if (t.value && !t.triggered) {
            const targetNum = parseFloat(t.value);
            // Deteksi penembusan harga (atas maupun bawah)
            const isHit = (t.insight?.side === "LONG" && currentPrice >= targetNum) || 
                         (t.insight?.side === "SHORT" && currentPrice <= targetNum);

            if (isHit) {
              sendTelegramAlert(currentPrice, t.label);
              const newTargets = [...targets];
              newTargets[index].triggered = true;
              setTargets(newTargets);
            }
          }
        });
      }
    } catch (e) {
      console.error("Sync Error");
    } finally {
      setLoading(false);
    }
  }, [coin, status, targets]);

  const sendTelegramAlert = async (triggeredPrice, label) => {
    if (!config.botToken || !config.chatId) return;
    const message = `🎯 *TARGET REACHED: ${label}*\n\nAsset: #${coin.toUpperCase()}\nPrice: $${triggeredPrice.toLocaleString()}\nStatus: *EXECUTED*`;
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage?chat_id=${config.chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;
    try { await fetch(url); } catch (e) { console.error("Telegram Error"); }
  };

  useEffect(() => {
    const interval = setInterval(fetchMarketData, 10000);
    fetchMarketData();
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const updateTargetValue = (id, val) => {
    const newTargets = targets.map(t => {
      if (t.id === id) {
        return { ...t, value: val, insight: getAiInsight(parseFloat(val)), triggered: false };
      }
      return t;
    });
    setTargets(newTargets);
  };

  return (
    <div className="w-full bg-[#020617] border border-white/10 rounded-[3rem] p-8 font-mono text-slate-200 shadow-2xl relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${status === 'ARMED' ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}>
            <Layers size={20} className={status === 'ARMED' ? 'text-cyan-400' : 'text-slate-500'} />
          </div>
          <div>
            <h2 className="text-[10px] font-black tracking-[4px] text-white uppercase">Multi-Target Hub</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{coin} / USD</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsConfigOpen(!isConfigOpen)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
          <Settings2 size={18} />
        </button>
      </div>

      {/* PRICE MONITOR */}
      <div className="mb-10 text-center border-y border-white/5 py-6">
        <div className="text-5xl font-black text-white italic tracking-tighter">${price.toLocaleString()}</div>
        <div className="flex justify-center gap-4 mt-2">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-[3px]">Real-Time Data Feed</span>
        </div>
      </div>

      {/* CONFIG DRAWER */}
      {isConfigOpen && (
        <div className="mb-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl space-y-3 animate-in slide-in-from-top-4">
           <p className="text-[9px] font-black text-cyan-500 uppercase flex items-center gap-2 mb-2"><Lock size={12}/> Security Protocol</p>
           <input type="password" placeholder="BOT TOKEN" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] focus:border-cyan-500 outline-none" value={config.botToken} onChange={(e)=>setConfig({...config, botToken: e.target.value})} />
           <input type="text" placeholder="CHAT ID" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] focus:border-cyan-500 outline-none" value={config.chatId} onChange={(e)=>setConfig({...config, chatId: e.target.value})} />
        </div>
      )}

      {/* MULTI TARGET INPUTS */}
      <div className="space-y-4 mb-8">
        {targets.map((t) => (
          <div key={t.id} className={`relative group transition-all ${t.triggered ? 'opacity-40' : ''}`}>
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <Target size={16} className={t.value ? 'text-cyan-500' : 'text-slate-700'} />
              <span className="text-[9px] font-black text-slate-600">{t.label}</span>
            </div>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-24 pr-24 text-sm font-bold text-white focus:border-cyan-500/50 outline-none"
              value={t.value}
              onChange={(e) => updateTargetValue(t.id, e.target.value)}
            />
            {t.insight && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[7px] text-slate-500 font-black uppercase">Confidence</p>
                  <p className="text-[10px] text-cyan-400 font-black">{t.insight.prob}%</p>
                </div>
                <div className={`p-1.5 rounded-lg ${t.insight.side === 'LONG' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                  <TrendingUp size={12} className={t.insight.side === 'SHORT' ? 'rotate-180' : ''} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MASTER ACTION */}
      <button 
        onClick={() => setStatus(status === 'ARMED' ? 'IDLE' : 'ARMED')}
        disabled={!targets.some(t => t.value) || !config.botToken}
        className={`w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[6px] transition-all flex items-center justify-center gap-3 ${
          status === 'ARMED' 
          ? 'bg-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.4)]' 
          : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
        }`}
      >
        {status === 'ARMED' ? <XCircle size={20} /> : <Zap size={20} className="fill-current" />}
        {status === 'ARMED' ? 'Deactivate System' : 'Deploy All Targets'}
      </button>

      {/* FOOTER STATS */}
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Auto-Sync: 10s</span>
          <span className="flex items-center gap-1"><BrainCircuit size={10} /> AI Active</span>
        </div>
        <span>v3.0-ULTIMATE</span>
      </div>
    </div>
  );
};

export default TelegramPriceAlarmUltimate;