// src/safeFetch.js
import { getCoinGeckoUrl, getFallbackUrl } from './apiConfig';

export const safeFetch = async (endpoint) => {
  // 1. Coba API Utama
  try {
    const response = await fetch(getCoinGeckoUrl(endpoint));
    
    // Cek jika valid (jangan throw error jika 404 data kosong, hanya 500/429)
    if (response.status === 404) return null; // Data tidak ditemukan
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.warn("API Utama Gagal, mencoba Fallback...", error.message);
    
    // 2. Coba API Cadangan
    try {
      const fallbackResponse = await fetch(getFallbackUrl(endpoint));
      if (!fallbackResponse.ok) throw new Error("Fallback juga gagal");
      
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error("Semua API Gagal:", fallbackError);
      return null; // Kembalikan null agar komponen tidak crash
    }
  }
};