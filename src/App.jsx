import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

// --- STATIC IMPORTS ---
import Navbar from './components/Navbar';
// Impor Footer (Pastikan path filenya benar)
const Footer = lazy(() => import("./components/Footer"));

// --- LAZY LOADED COMPONENTS ---
const Hero         = lazy(() => import('./components/Hero'));
const Features     = lazy(() => import('./components/Features'));
const Pricing      = lazy(() => import('./components/Pricing'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const FAQ          = lazy(() => import('./components/FAQ'));
const CTA          = lazy(() => import('./components/CTA'));
const AuthForm     = lazy(() => import('./components/AuthForm'));
const Dashboard    = lazy(() => import('./page/Dashboard'));

// --- LOADING STATE ---
const Loading = () => (
  <div className="min-h-screen bg-[#020617] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
  </div>
);

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen font-sans text-slate-200 antialiased selection:bg-indigo-500/30">
      <Toaster position="top-right" />

      <Suspense fallback={<Loading />}>
        <Routes>
          {/* --- LANDING PAGE (DENGAN FOOTER) --- */}
          <Route path="/" element={
            <div className="flex flex-col">
              <Navbar />
              <main>
                <Hero />
                <section id="features">
                  <Features />
                </section>
                <section id="pricing">
                  <Pricing />
                </section>
                <Testimonials />
                <FAQ />
                <CTA />
              </main>
              {/* FOOTER HANYA MUNCUL DI SINI */}
              <Footer /> 
            </div>
          } />

          {/* --- AUTHENTICATION --- */}
          <Route 
            path="/login" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-slate-950">
                <AuthForm mode="login" />
              </div>
            } 
          />

          {/* --- PRIVATE DASHBOARD (Dashboard sudah punya footer internal) --- */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* --- FALLBACKS --- */}
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;