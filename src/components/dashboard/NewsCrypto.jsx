import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Newspaper, ExternalLink, Clock, TrendingUp, 
  RefreshCw, Flame, Globe, Zap, TrendingDown, Info, 
  AlertCircle, ChevronRight, Activity, Search
} from 'lucide-react';

// --- CONFIGURATION ---
const API_KEY = ''; 
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

const SENTIMENT_STYLE = {
  bullish: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', icon: TrendingUp, label: 'Bullish' },
  bearish: { color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10', icon: TrendingDown, label: 'Bearish' },
  neutral: { color: 'text-slate-400', border: 'border-slate-700/50', bg: 'bg-slate-800/50', icon: Info, label: 'Neutral' }
};

const NewsCrypto = ({ coin = 'BTC' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let rawData;
      if (API_KEY) {
        const targetUrl = `https://cryptopanic.com/api/v1/posts/?auth_token=${API_KEY}&currencies=${coin}&public=true`;
        const response = await fetch(PROXY_URL + encodeURIComponent(targetUrl));
        if (!response.ok) throw new Error("Terminal link failed");
        const json = await response.json();
        rawData = typeof json === 'string' ? JSON.parse(json) : json;
      } else {
        await new Promise(res => setTimeout(res, 1000));
        rawData = {
          results: [
            { id: 101, title: `${coin} Network Hashrate Hits All-Time High Amid Institutional Surge`, source: { domain: "bloomberg.com" }, url: "https://bloomberg.com", created_at: new Date().toISOString(), votes: { positive: 85, negative: 5, important: 15 } },
            { id: 102, title: "Global Central Banks Discussing New Digital Asset Reserve Standards", source: { domain: "reuters.com" }, url: "https://reuters.com", created_at: new Date().toISOString(), votes: { positive: 12, negative: 45, important: 25 } },
            { id: 103, title: `Whale Alert: 50,000 ${coin} Moved to Cold Storage in 10 Minutes`, source: { domain: "whale-alert.io" }, url: "https://whale-alert.io", created_at: new Date().toISOString(), votes: { positive: 30, negative: 30, important: 12 } },
            { id: 104, title: "Security Alert: Smart Contract Vulnerability Found in Top 10 Protocol", source: { domain: "rekt.news" }, url: "https://rekt.news", created_at: new Date().toISOString(), votes: { positive: 2, negative: 95, important: 42 } },
            { id: 105, title: "Market Update: Spot ETF Inflows Reach Record $2.5B Weekly", source: { domain: "coindesk.com" }, url: "https://coindesk.com", created_at: new Date().toISOString(), votes: { positive: 65, negative: 5, important: 8 } },
          ]
        };
      }

      const formatted = (rawData.results || []).map(item => ({
        id: item.id,
        title: String(item.title),
        source: typeof item.source === 'object' ? (item.source.domain || "Unknown") : String(item.source),
        url: item.url || "#",
        sentiment: (item.votes?.positive || 0) > (item.votes?.negative || 0) ? 'bullish' : 
                   (item.votes?.negative || 0) > (item.votes?.positive || 0) ? 'bearish' : 'neutral',
        isHighImpact: (item.votes?.important || 0) > 10,
        timeAgo: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

      setNews(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coin]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const filteredNews = useMemo(() => 
    news.filter(n => n.title.toLowerCase().includes(filter.toLowerCase())),
    [news, filter]
  );

  return (
    <div className="w-full min-h-screen bg-[#020617] text-slate-300 font-sans p-4 lg:p-10">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 40s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>

      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-[0_0_25px_rgba(79,70,229,0.5)]">
                <Activity size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Nexus<span className="text-indigo-500 not-italic">Terminal</span>
              </h1>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> LIVE_SYNC</span>
              <span>//</span>
              <span className="text-indigo-400">NODE: {coin}_PRIMARY</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:min-w-[350px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="Search headlines..."
                className="w-full bg-slate-900/40 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <button onClick={fetchNews} disabled={loading} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-lg active:scale-95 text-xs tracking-widest flex items-center gap-2">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> REFRESH
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        {error ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-rose-500/20 bg-rose-500/5 rounded-[2.5rem]">
            <AlertCircle size={48} className="text-rose-500 mb-4" />
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Connection Error</h2>
            <p className="text-slate-500 mt-2 italic">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* FEATURED ALERTS */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center gap-4">
                <Flame size={20} className="text-orange-500" />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Critical News</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? [...Array(4)].map((_, i) => (
                  <div key={i} className="h-[300px] bg-slate-900/50 rounded-[2.5rem] border border-slate-800 animate-pulse" />
                )) : filteredNews.slice(0, 4).map((item) => (
                  <div key={item.id} 
                       className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col justify-between h-[340px] shadow-2xl overflow-hidden ${item.isHighImpact ? 'bg-gradient-to-br from-indigo-900/30 to-slate-950 border-indigo-500/30' : 'bg-slate-900/30 border-slate-800 hover:border-slate-600'}`}>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${SENTIMENT_STYLE[item.sentiment].border} ${SENTIMENT_STYLE[item.sentiment].bg} ${SENTIMENT_STYLE[item.sentiment].color}`}>
                          {React.createElement(SENTIMENT_STYLE[item.sentiment].icon, { size: 14 })} {SENTIMENT_STYLE[item.sentiment].label}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 italic uppercase">{item.timeAgo}</div>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-[1.3] line-clamp-4">{item.title}</h3>
                    </div>
                    <div className="relative z-10 flex items-center justify-between pt-6 border-t border-slate-800/50 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-2"><Globe size={16} className="text-indigo-500" /> {item.source}</div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" 
                         className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] flex items-center gap-1 hover:bg-indigo-500 transition-all shadow-lg active:scale-95 uppercase tracking-tighter">
                        SOURCE <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE STREAM SIDEBAR */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-4 px-2">
                <Clock size={20} className="text-indigo-500" />
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Live Stream</h2>
              </div>
              <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-6 h-[720px] overflow-y-auto custom-scrollbar space-y-4 shadow-inner">
                {loading ? [...Array(6)].map((_, i) => (
                  <div key={i} className="h-28 bg-slate-800/30 rounded-3xl animate-pulse" />
                )) : filteredNews.slice(4).map(item => (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block p-5 bg-slate-950/40 border border-slate-800/50 hover:border-indigo-500/30 rounded-3xl transition-all group">
                    <div className="flex justify-between mb-2">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${SENTIMENT_STYLE[item.sentiment].bg} ${SENTIMENT_STYLE[item.sentiment].color}`}>{item.sentiment}</span>
                      <span className="text-[9px] font-mono text-slate-600 font-bold">{item.timeAgo}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-2 leading-relaxed">{item.title}</p>
                    <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>{item.source}</span>
                      <ExternalLink size={12} className="group-hover:text-indigo-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM TICKER */}
        <div className="bg-indigo-600 rounded-[1.5rem] p-0.5 shadow-2xl">
          <div className="bg-slate-950 rounded-[1.4rem] py-4 px-8 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <div className="flex gap-12 pr-12">
                {news.map(n => (
                  <span key={n.id} className="text-[11px] font-bold text-slate-500 flex items-center gap-3 uppercase tracking-[0.1em]">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {n.title}
                  </span>
                ))}
              </div>
              <div className="flex gap-12">
                {news.map(n => (
                  <span key={`dup-${n.id}`} className="text-[11px] font-bold text-slate-500 flex items-center gap-3 uppercase tracking-[0.1em]">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {n.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsCrypto;