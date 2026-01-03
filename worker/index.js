export default {
  async fetch(request) {
    const url = new URL(request.url);

    // --- HANDLE CORS PREFLIGHT (Penting agar React bisa akses) ---
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // 1. Health Check
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "AI Signal API is alive 🚀" }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 2. Price List (CoinGecko Markets)
    // Endpoint: /api/price?limit=10
    if (url.pathname === "/api/price") {
      try {
        const limit = url.searchParams.get("limit") || "10";
        const page = url.searchParams.get("page") || "1";

        // Menggunakan endpoint markets CoinGecko untuk mendapatkan list harga terbaru
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`
        );
        
        const data = await res.json();

        return new Response(JSON.stringify(data), {
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({
          error: "internal error",
          info: "Gagal fetch data dari CoinGecko Markets",
          detail: err.message
        }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }});
      }
    }

    // 3. Single Coin Detail (CoinGecko Single Coin)
    // Endpoint: /api/coin?id=bitcoin
    if (url.pathname === "/api/coin") {
      try {
        const id = url.searchParams.get("id"); // ID harus berupa string (misal: 'bitcoin', 'ethereum')
        if (!id) {
          return new Response(JSON.stringify({ error: "missing coin id" }), { status: 400 });
        }

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
        );
        
        const data = await res.json();

        return new Response(JSON.stringify(data), {
          headers: { 
            "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*" 
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({
          error: "internal error",
          info: "Gagal fetch detail koin dari CoinGecko",
          detail: err.message
        }), { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }});
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};