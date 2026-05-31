import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* 🚀 GLOBAL HEADER: Ab ye har ek page par automatically dikhega */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
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

      {/* 🚀 DYNAMIC CONTENT GRID: Saare pages yahan render honge */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-600 operations">
        &copy; {new Date().getFullYear()} HostelHub System Architecture. All Rights Reserved.
      </footer>
    </div>
  );
};

export default MainLayout;