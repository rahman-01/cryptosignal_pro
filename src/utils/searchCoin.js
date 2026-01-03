// src/utils/searchCoin.js

// 1. DATA LOKAL (WAJIB ADA AGAR SEARCH LOKAL JALAN)
const LOCAL_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'tron', symbol: 'TRX', name: 'TRON' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'tether', symbol: 'USDT', name: 'Tether' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USDC' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar' },
  { id: 'near-protocol', symbol: 'NEAR', name: 'NEAR' },
  { id: 'filecoin', symbol: 'FIL', name: 'Filecoin' },
  { id: 'ethereum-classic', symbol: 'ETC', name: 'Ethereum Classic' },
  { id: 'algorand', symbol: 'ALGO', name: 'Algorand' },
  { id: 'monero', symbol: 'XMR', name: 'Monero' },
  { id: 'internet-computer', symbol: 'ICP', name: 'Internet Computer' },
  { id: 'eos', symbol: 'EOS', name: 'EOS' },
  { id: 'zcash', symbol: 'ZEC', name: 'Zcash' },
  { id: 'elrond-erd-2', symbol: 'EGLD', name: 'MultiversX' },
  { id: 'the-graph', symbol: 'GRT', name: 'The Graph' },
  { id: 'fantom', symbol: 'FTM', name: 'Fantom' },
  { id: 'aave', symbol: 'AAVE', name: 'Aave' },
  { id: 'maker', symbol: 'MKR', name: 'Maker' },
  { id: 'theta-network', symbol: 'THETA', name: 'Theta Network' },
  { id: 'vechain', symbol: 'VET', name: 'VeChain' },
  { id: 'klay-token', symbol: 'KLAY', name: 'Klaytn' },
  { id: 'kucoin-shares', symbol: 'KCS', name: 'KuCoin Shares' },
  { id: 'okb', symbol: 'OKB', name: 'OKB' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'decentraland', symbol: 'MANA', name: 'Decentraland' },
  { id: 'axie-infinity', symbol: 'AXS', name: 'Axie Infinity' },
  { id: 'basic-attention-token', symbol: 'BAT', name: 'Basic Attention Token' },
  { id: 'waves', symbol: 'WAVES', name: 'Waves' },
  { id: 'nem', symbol: 'XEM', name: 'NEM' },
  { id: 'tezos', symbol: 'XTZ', name: 'Tezos' },
  { id: 'iota', symbol: 'MIOTA', name: 'IOTA' },
  { id: 'nano', symbol: 'NANO', name: 'Nano' },
  { id: 'arweave', symbol: 'AR', name: 'Arweave' },
  { id: 'kaspa', symbol: 'KAS', name: 'Kaspa' },
  { id: 'ordinals', symbol: 'ORDI', name: 'Ordinals' },
  { id: 'pepe', symbol: 'PEPE', name: 'Pepe' },
  { id: 'floki', symbol: 'FLOKI', name: 'FLOKI' },
  { id: 'bonk', symbol: 'BONK', name: 'Bonk' },
  { id: 'dogwifcoin', symbol: 'WIF', name: 'dogwifhat' },
  { id: 'aptos', symbol: 'APT', name: 'Aptos' },
  { id: 'sui', symbol: 'SUI', name: 'Sui' },
  { id: 'sei-network', symbol: 'SEI', name: 'Sei Network' },
  { id: 'core', symbol: 'CORE', name: 'Core' },
  { id: 'mantle', symbol: 'MNT', name: 'Mantle' }
];

// 2. FUNGSI SEARCH
export const searchCoin = async (query) => {
  const lowerQuery = query.toLowerCase();

  console.log("Searching for:", query); // DEBUG 1
  
  // A. SEARCH LOKAL (ANTI ERROR)
  const localResults = LOCAL_COINS.filter(coin => 
    coin.name.toLowerCase().includes(lowerQuery) || 
    coin.symbol.toLowerCase().includes(lowerQuery)
  );

  console.log("Local Results found:", localResults); // DEBUG 2

  // Jika local ada, KEMBALIKAN. JANGAN PAKAI API. (INI KUNCI SUPAYA JALAN)
  if (localResults.length > 0) {
    return localResults.slice(0, 5);
  }

  // B. SEARCH API (HANYA JIKA LOCAL GAGAL/EMPTY)
  console.warn("Local search empty, trying API Global..."); // DEBUG 3
  
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
    
    if (!response.ok) {
      console.error("API Response Not OK");
      return [];
    }

    const data = await response.json();
    const coins = data.coins || [];
    
    if (coins.length > 0) {
      return coins.map(coin => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name
      })).slice(0, 5);
    }
    
    return [];

  } catch (err) {
    console.error("API Search Error:", err);
    return [];
  }
};