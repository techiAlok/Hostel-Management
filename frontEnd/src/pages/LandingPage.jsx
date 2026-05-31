import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              H
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              HostelHub
            </span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 active:scale-95"
          >
            Portal Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
        {/* Left Copy Panel */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20">
            ✨ Next-Gen Hostel Ecosystem
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Automating Campus Living <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              With Absolute Precision.
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
            A real-time administrative matrix managing room allocation pipelines, structural vacancies, and residential data synchronization transparently.
          </p>
          
          {/* Action Button Grid Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3.5 rounded-xl font-bold shadow-xl shadow-indigo-600/20 transition-all duration-200 active:scale-98"
            >
              Enter Dashboard Portal
            </button>
            <button 
              onClick={() => navigate('/register?role=admin')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-purple-400 px-6 py-3.5 rounded-xl font-bold transition duration-200 active:scale-98"
            >
              Register as Admin
            </button>
            <button 
              onClick={() => navigate('/register?role=student')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-400 px-6 py-3.5 rounded-xl font-bold transition duration-200 active:scale-98"
            >
              Register as Student
            </button>
          </div>
        </div>

        {/* Right Preview Card Mesh Panel */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full"></div>
          
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Infrastructure Core</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            
            {/* Visual Analytics Representation */}
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Parallel Vacancy Aggregation</p>
                  <p className="text-2xl font-black text-white mt-1">Active Sync</p>
                </div>
                <div className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded text-sm">
                  MongoDB 
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Network Security Firewall</p>
                  <p className="text-2xl font-black text-white mt-1">JWT Guarded</p>
                </div>
                <div className="text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2.5 py-1 rounded text-sm">
                  Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section Grid */}
      <section id="features" className="border-t border-slate-900 bg-slate-950 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered Across the MERN Stack</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Modular design loops optimized for role isolation, rapid routing, and atomic operational pipelines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-2">
              <div className="text-indigo-400 font-bold text-xl">01</div>
              <h4 className="text-white font-bold">Admin Management Control</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Direct dynamic form submission channels mapping physical layout matrices straight into document storage structures instantly.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-2">
              <div className="text-purple-400 font-bold text-xl">02</div>
              <h4 className="text-white font-bold">Encrypted Token Security</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Bcrypt client side hashing handshaking with microservice JSON Web Tokens preventing route tampering parameters completely.</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-xl space-y-2">
              <div className="text-pink-400 font-bold text-xl">03</div>
              <h4 className="text-white font-bold">Tailwind v4 Aesthetics</h4>
              <p className="text-slate-400 text-sm leading-relaxed">High performance rendering utilizes clean modern CSS modules layout engines providing ultra-fast transitions across interfaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} HostelHub System Architecture. All Rights Reserved.
      </footer>
    </div>
  );
};

export default LandingPage;