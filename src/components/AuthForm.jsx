import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight, X } from 'lucide-react';

const AuthInput = ({ label, type, placeholder, value, onChange, name, required, icon: Icon }) => (
  <div className="relative group">
    <label className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-2 group-focus-within:text-indigo-400 transition-colors text-left">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
        <Icon size={18} />
      </div>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-700"
      />
    </div>
  </div>
);

const AuthForm = ({ mode = "login" }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Sinkronisasi state jika prop mode berubah
  useEffect(() => {
    setIsLogin(mode === "login");
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLogin) {
      if (formData.email === "admin@test.com" && formData.password === "123456") {
        navigate('/dashboard');
      } else {
        alert("Akses Gagal: Gunakan admin@test.com / 123456");
      }
    } else {
      alert(`Selamat ${formData.name}, akun Anda berhasil dibuat! Silahkan Login.`);
      setIsLogin(true);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-transform hover:scale-110">
            <Zap size={28} className="text-white fill-white" />
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* --- TOMBOL CLOSE --- */}
          <button 
            onClick={() => navigate('/')}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90 z-20"
            title="Kembali ke Beranda"
          >
            <X size={20} />
          </button>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">
              {isLogin ? 'Trader Login' : 'Join the Hunt'}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {isLogin ? 'Masuk untuk akses data Smart Money' : 'Daftar sekarang untuk akses AI Dashboard'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {!isLogin && (
              <AuthInput 
                label="Trader Name" 
                type="text" 
                placeholder="Ex: John Trader" 
                name="name"
                icon={User}
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}

            <AuthInput 
              label="Email Address" 
              type="email" 
              placeholder="trader@market.com" 
              name="email"
              icon={Mail}
              required
              value={formData.email}
              onChange={handleChange}
            />

            <div className="text-left">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition tracking-widest outline-none">Forgot?</button>}
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="group w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-[0_15px_30px_-10px_rgba(79,70,229,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              {isLogin ? 'Authorize Access' : 'Create Trader Account'}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest">
              {isLogin ? 'New to the market?' : 'Already a hunter?'} 
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-500 hover:text-indigo-400 transition border-b border-indigo-500/20 outline-none"
              >
                {isLogin ? 'Register Here' : 'Login Access'}
              </button>
            </p>
          </div>

          <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] w-full bg-white/5"></div>
              <span className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">OR</span>
              <div className="h-[1px] w-full bg-white/5"></div>
          </div>

          <button 
            type="button"
            className="mt-8 w-full bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white py-4 rounded-2xl border border-white/5 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 opacity-80" alt="google" />
              <span className="text-xs font-black uppercase tracking-widest">Login with Google</span>
          </button>
        </div>

        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-[0.2em]">
          🔒 Secured by End-to-End Institutional Encryption
        </p>
      </div>
    </section>
  );
};

export default AuthForm;