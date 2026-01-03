// src/indicators.js

export const TechnicalIndicators = {
  // Simple Moving Average
  calculateSMA: (data, period) => {
    return data.map((_, i) => {
      if (i < period - 1) return null;
      const slice = data.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, val) => acc + val.close, 0);
      return sum / period;
    });
  },

  // Exponential Moving Average
  calculateEMA: (data, period) => {
    const k = 2 / (period + 1);
    let emaArray = [data[0].close];
    
    for (let i = 1; i < data.length; i++) {
      emaArray.push(data[i].close * k + emaArray[i - 1] * (1 - k));
    }
    // Adjust length to match input (prepend nulls)
    return new Array(data.length - emaArray.length).fill(null).concat(emaArray);
  },

  // Relative Strength Index
  calculateRSI: (data, period = 14) => {
    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
      const diff = data[i].close - data[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    let rsiArray = new Array(period).fill(null);

    for (let i = period; i < data.length; i++) {
      const diff = data[i].close - data[i - 1].close;
      const currentGain = diff > 0 ? diff : 0;
      const currentLoss = diff < 0 ? -diff : 0;

      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsiArray.push(100 - 100 / (1 + rs));
    }
    return rsiArray;
  },

  // MACD (Simplified)
  calculateMACD: (data, fast = 12, slow = 26, signal = 9) => {
    const emaFast = TechnicalIndicators.calculateEMA(data, fast);
    const emaSlow = TechnicalIndicators.calculateEMA(data, slow);
    
    const macdLine = emaFast.map((val, i) => (val && emaSlow[i] ? val - emaSlow[i] : null));
    // Signal line is EMA of MACD (simplified calculation logic here)
    return { macdLine, signalLine: macdLine }; // Returning simplified for demo
  },
  
  // Stochastic
  calculateStochastic: (data, period = 14) => {
     let stochArray = new Array(period).fill(null);
     for(let i = period; i < data.length; i++) {
        const slice = data.slice(i - period, i + 1);
        const high = Math.max(...slice.map(d => d.high));
        const low = Math.min(...slice.map(d => d.low));
        const k = ((data[i].close - low) / (high - low)) * 100;
        stochArray.push(k);
     }
     return stochArray;
  }
};