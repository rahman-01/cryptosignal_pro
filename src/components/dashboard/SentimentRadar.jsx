import React, { useState, useEffect } from 'react';
import { 
  Activity, RefreshCw, Skull, Meh, Smile, 
  Flame, Droplets
} from 'lucide-react';

const SentimentRadar = ({ coin }) => {
  const [loading, setLoading] = useState(true);
  const [fearGreedData, setFearGreedData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Data Fear & Greed Index
  const fetchFearGreed = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Menggunakan API Fear & Greed dari Alternative.me
      const response = await fetch('https://api.alternative.me/fng/?limit=1');
      
      if (!response.ok) throw new Error('Gagal mengambil indeks sentimen.');

      const json = await response.json();
      const data = json.data[0]; 

      setFearGreedData({
        value: parseInt(data.value),
        valueClassification: data.value_classification,
        timestamp: data.timestamp
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFearGreed();
  }, [coin]); 

  // Helper: Tentukan warna, status, dan icon berdasarkan nilai
  const getFearGreedStatus = (value) => {
    if (value >= 75) return { 
      text: 'Extreme Greed', 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10', 
      border: 'border-emerald-500/30',
      barColor: '#34d399',
      icon: <Flame size={28} /> 
    };
    if (value >= 55) return { 
      text: 'Greed', 
      color: 'text-emerald-300', 
      bg: 'bg-emerald-300/10', 
      border: 'border-emerald-400/30',
      barColor: '#6ee7b7',
      icon: <Smile size={28} /> 
    };
    if (value >= 45) return { 
      text: 'Neutral', 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10', 
      border: 'border-blue-500/30',
      barColor: '#60a5fa',
      icon: <Meh size={28} /> 
    };
    if (value >= 25) return { 
      text: 'Fear', 
      color: 'text-orange-400', 
      bg: 'bg-orange-400/10', 
      border: 'border-orange-500/30',
      barColor: '#fb923c',
      icon: <Droplets size={28} /> 
    };
    return { 
      text: 'Extreme Fear', 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/30',
      barColor: '#f43f5e',
      icon: <Skull size={28} /> 
    };
  };

  // Helper: Format Waktu
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Fear & Greed Index</h2>
            <p className="text-xs text-slate-400">Market Sentiment Analysis</p>
          </div>
        </div>
        <button 
          onClick={fetchFearGreed}
          disabled={loading}
          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Content */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl text-center">
          {error}
        </div>
      ) : loading ? (
        <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-12 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 animate-pulse">Analyzing Market Sentiment...</p>
        </div>
      ) : fearGreedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kiri: Visual Meteran Besar */}
          <div className="md:col-span-1 bg-slate-800/40 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center relative">
            
            <h3 className="text-slate-400 font-bold uppercase text-xs mb-6 tracking-widest">Current Index</h3>
            
            {/* Gauge Visualization */}
            <div className="relative w-64 h-32 overflow-hidden mb-6">
              {/* Background Track */}
              <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                />
                {/* Colored Bar */}
                <path d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke="url(#gradientFear)" 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  strokeDasharray="126"
                  strokeDashoffset={(126 - (126 * fearGreedData.value / 100))}
                  className="transition-all duration-1000 ease-out drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="gradientFear">
                    <stop offset="0%" stopColor="#ef4444" />    
                    <stop offset="50%" stopColor="#facc15" />   
                    <stop offset="100%" stopColor="#22c55e" />   
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Number */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                <div className={`text-6xl font-black transition-colors duration-500 ${getFearGreedStatus(fearGreedData.value).color}`}>
                  {fearGreedData.value}
                </div>
                <div className="text-xs text-slate-400 uppercase font-bold mt-1">Index Value</div>
              </div>
            </div>

            {/* Status Text */}
            <div className={`px-8 py-3 rounded-full border-2 ${getFearGreedStatus(fearGreedData.value).bg} ${getFearGreedStatus(fearGreedData.value).border} flex items-center gap-3 mb-6`}>
              <div className={getFearGreedStatus(fearGreedData.value).color}>
                {getFearGreedStatus(fearGreedData.value).icon}
              </div>
              <span className={`text-xl font-black uppercase tracking-wider ${getFearGreedStatus(fearGreedData.value).color}`}>
                {getFearGreedStatus(fearGreedData.value).text}
              </span>
            </div>

            <p className="text-center text-slate-500 text-xs max-w-[250px] leading-relaxed">
              {fearGreedData.value >= 75 
                ? "Pasarnya terlalu serakah. Saatnya waspada dan pertimbangkan untuk menjual." 
                : fearGreedData.value <= 25 
                ? "Pasarnya ketakutan ekstrem. Investor mungkin menjual terlalu banyak. Waktu bagus untuk mengumpulkan." 
                : "Pasar sedang berkonsolidasi. Tidak ada tren ekstrem yang terdeteksi."}
            </p>

          </div>

          {/* Kanan: Details & Interpretation */}
          <div className="flex flex-col gap-4">
            
            {/* Interpretation Card */}
            <div className={`bg-slate-800/40 border ${getFearGreedStatus(fearGreedData.value).border} rounded-xl p-6 flex-1 flex flex-col justify-center`}>
              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                <Activity size={18} className="text-indigo-400" />
                Interpretasi
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Tanggal Update</span>
                  <span className="text-white font-mono">{formatTime(fearGreedData.timestamp)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Sumber Data</span>
                  <span className="text-white font-bold">Alternative.me</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-1">
                  <span className="text-slate-400">Analisa Sentimen</span>
                  <span className={`font-bold uppercase ${getFearGreedStatus(fearGreedData.value).color}`}>
                    {getFearGreedStatus(fearGreedData.value).text}
                  </span>
                </div>
              </div>
            </div>

            {/* Scale Reference */}
            <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
              <h4 className="text-slate-400 font-bold text-xs uppercase mb-4 tracking-wider">Skala Indeks</h4>
              
              <div className="space-y-3">
                {/* 0-25 */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-xs text-slate-300 flex-1">0 - 25 <span className="text-slate-500 ml-1">Extreme Fear</span></span>
                  <span className="text-[10px] text-slate-500 uppercase">Sell</span>
                </div>
                {/* 25-45 */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-xs text-slate-300 flex-1">25 - 45 <span className="text-slate-500 ml-1">Fear</span></span>
                </div>
                {/* 45-55 */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-xs text-slate-300 flex-1">45 - 55 <span className="text-slate-500 ml-1">Neutral</span></span>
                </div>
                {/* 55-75 */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
                  <span className="text-xs text-slate-300 flex-1">55 - 75 <span className="text-slate-500 ml-1">Greed</span></span>
                </div>
                {/* 75-100 */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-300 flex-1">75 - 100 <span className="text-slate-500 ml-1">Extreme Greed</span></span>
                  <span className="text-[10px] text-slate-500 uppercase">Buy</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default SentimentRadar;