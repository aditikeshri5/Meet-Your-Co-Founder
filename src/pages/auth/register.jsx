/**
 * register.jsx (Auth Page)
 
 * ──────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBackground from '../../components/heroBackground';
import GlowCard from '../../components/card';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    domain: '',
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert(`Login attempted for: ${loginData.email}`);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert(`Registration attempted for: ${registerData.name} (${registerData.email}) - Domain: ${registerData.domain}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-x-hidden">
      <HeroBackground />

      <div className="relative z-20 w-full max-w-md mb-6 flex justify-between items-center px-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Landing
        </button>

        {/* EIS Logo */}
        <img
          src="/eis-logo-raw.jpg"
          alt="EIS Logo"
          onClick={() => navigate('/')}
          className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
          style={{
            filter: 'invert(1) brightness(1.2) contrast(1.1)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      <GlowCard className="relative z-20 w-full max-w-md p-5 sm:p-8">
        <div className="flex border-b border-cyan-500/20 mb-6 relative">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`
              flex-1 py-3 text-center font-bold text-sm sm:text-base transition-all duration-300 relative z-10 cursor-pointer
              ${activeTab === 'login' ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}
            `}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`
              flex-1 py-3 text-center font-bold text-sm sm:text-base transition-all duration-300 relative z-10 cursor-pointer
              ${activeTab === 'register' ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}
            `}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Register
          </button>

          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300 rounded-full"
            style={{
              left: activeTab === 'login' ? '0%' : '50%',
              width: '50%',
              boxShadow: '0 0 10px rgba(56,189,248,0.8)',
            }}
          />
        </div>

        {/* LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@college.edu"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Password reset link sent!'); }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <button
              type="submit"
              className="
                w-full py-3.5 mt-2 rounded-xl font-bold text-white text-xs sm:text-sm uppercase tracking-wider
                bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700
                hover:from-cyan-500 hover:to-teal-500
                shadow-[0_0_20px_rgba(8,145,178,0.4)]
                active:scale-[0.98] transition-all duration-200 cursor-pointer
              "
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Login
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-fadeIn">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@college.edu"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                College
              </label>
              <input
                type="text"
                required
                placeholder="College / University Name"
                value={registerData.college}
                onChange={(e) => setRegisterData({ ...registerData, college: e.target.value })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Branch
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science, AI, Mechanical"
                value={registerData.branch}
                onChange={(e) => setRegisterData({ ...registerData, branch: e.target.value })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Domain / Area of Interest
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Web Dev, AI/ML, Design, Business, Marketing"
                value={registerData.domain}
                onChange={(e) => setRegisterData({ ...registerData, domain: e.target.value })}
                className="
                  w-full px-4 py-2.5 rounded-xl
                  bg-slate-950/60 text-white placeholder-slate-500 text-sm
                  border border-cyan-500/30 focus:border-cyan-400 focus:outline-none
                  focus:ring-2 focus:ring-cyan-500/20 transition-all
                "
              />
            </div>

            <button
              type="submit"
              className="
                w-full py-3.5 mt-3 rounded-xl font-bold text-white text-xs sm:text-sm uppercase tracking-wider
                bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700
                hover:from-cyan-500 hover:to-teal-500
                shadow-[0_0_20px_rgba(8,145,178,0.4)]
                active:scale-[0.98] transition-all duration-200 cursor-pointer
              "
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Register
            </button>
          </form>
        )}
      </GlowCard>
    </main>
  );
};

export default AuthPage;
