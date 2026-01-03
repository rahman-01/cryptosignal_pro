// Di dalam CryptoContext.jsx
const fetchCoins = async () => {
  try {
    setLoading(true);
    // Mengambil top 50 koin berdasarkan kapitalisasi pasar
    const response = await fetch('https://api.coinpaprika.com/v1/tickers?quotes=USD');
    
    if (!response.ok) throw new Error("Gagal mengambil data Coinpaprika");

    const data = await response.json();
    
    // Normalisasi data agar sesuai dengan komponen AiSignal & Market
    const formattedData = data.slice(0, 50).map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      rank: coin.rank,
      price_usd: coin.quotes.USD.price,
      percent_change_24h: coin.quotes.USD.percent_change_24h,
      volume_24h: coin.quotes.USD.volume_24h,
      market_cap: coin.quotes.USD.market_cap
    }));

    setCoins(formattedData);
  } catch (err) {
    console.error("Error Coinpaprika:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};