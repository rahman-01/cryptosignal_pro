// src/apiConfig.js

// 1. URL API UTAMA (CoinGecko Public)
export const API_BASE_URL = "https://api.coingecko.com/api/v3";

// 2. URL API CADANGAN (Jika utama error/blokir)
// Anda bisa mengganti ini dengan URL Proxy sendiri jika punya
export const FALLBACK_URL = "https://api.coingecko.com/api/v3"; 

// 3. URL API SENTIMEN (Fear & Greed)
export const API_SENTIMENT = "https://api.alternative.me/fng";

/**
 * Fungsi helper untuk membuat URL lengkap
 * Kamu bisa menyuntikkan API Key disini nantinya jika upgrade ke PRO
 */
export const getCoinGeckoUrl = (endpoint) => {
  // Catatan: Jika punya API Key Pro, tambahkan:
  // return `${API_BASE_URL}/${endpoint}&x_cg_pro_api_key=KEY_KAMU_DISINI`;
  
  return `${API_BASE_URL}/${endpoint}`;
};

/**
 * Fungsi Fallback untuk coba URL kedua jika yang pertama gagal
 */
export const getFallbackUrl = (endpoint) => {
  return `${FALLBACK_URL}/${endpoint}`;
};