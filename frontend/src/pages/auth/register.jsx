/**
 * register.jsx (Auth Page)
 * Handles both Login and Register (Participant / Founder) with backend integration.
 * ──────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeroBackground from '../../components/heroBackground';
import { authAPI, tokenStore } from '../../services/api';

// ─── Reusable Input ───────────────────────────────────────────────────────────
const Field = ({ label, type = 'text', placeholder, value, onChange, error, id, required = true }) => (
  <div>
    <label htmlFor={id} className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </label>
    <input
      id={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500
        bg-slate-950/60 backdrop-blur-sm
        border transition-all duration-200 outline-none
        focus:ring-2 focus:ring-cyan-500/25
        ${error
          ? 'border-red-500/70 focus:border-red-400'
          : 'border-cyan-500/25 focus:border-cyan-400'
        }
      `}
    />
    {error && (
      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
        <span>⚠</span> {error}
      </p>
    )}
  </div>
);

// ─── Submit Button ────────────────────────────────────────────────────────────
const SubmitBtn = ({ loading, label }) => (
  <button
    type="submit"
    disabled={loading}
    className="
      w-full py-3.5 mt-2 rounded-xl font-bold text-white text-sm uppercase tracking-wider
      bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700
      hover:from-cyan-500 hover:to-teal-500
      shadow-[0_0_20px_rgba(8,145,178,0.35)]
      active:scale-[0.98] transition-all duration-200
      disabled:opacity-60 disabled:cursor-not-allowed
      flex items-center justify-center gap-2 cursor-pointer
    "
    style={{ fontFamily: "'Outfit', sans-serif" }}
  >
    {loading ? (
      <>
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
        Processing…
      </>
    ) : label}
  </button>
);

// ─── Login Form ───────────────────────────────────────────────────────────────
const LoginForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await authAPI.login({ email: form.email, password: form.password });
      // Backend returns { token: '...' } (not access_token)
      tokenStore.set(data.token || data.access_token);
      onSuccess();
    } catch (err) {
      setApiError(err.message || err.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
      {apiError && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {apiError}
        </div>
      )}
      <Field
        id="login-email" label="Email" type="email"
        placeholder="you@example.com"
        value={form.email} onChange={set('email')} error={errors.email}
      />
      <Field
        id="login-password" label="Password" type="password"
        placeholder="••••••••"
        value={form.password} onChange={set('password')} error={errors.password}
      />
      <SubmitBtn loading={loading} label="Login" />
    </form>
  );
};

// ─── Register Form ────────────────────────────────────────────────────────────
const RegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10,15}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid phone number';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      // API only accepts: name, email, phone, password
      await authAPI.register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      // Save participant role locally
      localStorage.setItem('founder_profile', JSON.stringify({ role: 'participant' }));

      // Auto-login after successful registration
      const loginData = await authAPI.login({ email: form.email, password: form.password });
      // Backend returns { token: '...' } (not access_token)
      tokenStore.set(loginData.token || loginData.access_token);
      onSuccess();
    } catch (err) {
      setApiError(err.message || err.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 animate-fadeIn">
      {apiError && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          {apiError}
        </div>
      )}

      <Field id="reg-name" label="Full Name" placeholder="Your full name"
        value={form.name} onChange={set('name')} error={errors.name} />
      <Field id="reg-email" label="Email" type="email" placeholder="you@example.com"
        value={form.email} onChange={set('email')} error={errors.email} />
      <Field id="reg-phone" label="Phone Number" type="tel" placeholder="10-digit mobile number"
        value={form.phone} onChange={set('phone')} error={errors.phone} />
      <Field id="reg-password" label="Password" type="password" placeholder="Min. 6 characters"
        value={form.password} onChange={set('password')} error={errors.password} />

      <SubmitBtn loading={loading} label="Create Account" />
    </form>
  );
};

// ─── Auth Page ────────────────────────────────────────────────────────────────
const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login');

  const handleRedirect = () => {
    const pendingRoom = sessionStorage.getItem('pending_checkin_room');
    if (pendingRoom) {
      navigate(`/checkin?room_id=${pendingRoom}`, { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  useEffect(() => {
    // If already logged in, redirect to intent or dashboard
    if (tokenStore.get() && tokenStore.get() !== 'undefined' && tokenStore.get() !== 'null') {
      handleRedirect();
    }
  }, [navigate]);

  const handleSuccess = () => handleRedirect();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-x-hidden">
      <HeroBackground />

      {/* Top bar */}
      <div className="relative z-20 w-full max-w-md mb-6 flex justify-between items-center px-1">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <img
          src="/logo.png"
          alt="EIS Logo"
          onClick={() => navigate('/')}
          className="h-8 w-auto object-contain cursor-pointer"
          style={{ filter: 'brightness(1.15) contrast(1.05)', mixBlendMode: 'screen' }}
        />
      </div>

      {/* Card */}
      <div className="
        relative z-20 w-full max-w-md
        rounded-2xl p-6 sm:p-8
        bg-[rgba(5,12,35,0.75)] backdrop-blur-2xl
        border border-cyan-500/20
        shadow-[0_0_40px_rgba(8,145,178,0.15)]
      ">
        {/* Tab switcher */}
        <div className="flex border-b border-cyan-500/15 mb-6 relative">
          {['login', 'register'].map((tab) => (
            <button
              key={tab} type="button"
              onClick={() => setActiveTab(tab)}
              id={`auth-tab-${tab}`}
              className={`
                flex-1 py-3 text-center font-bold text-sm transition-all duration-300 relative z-10 cursor-pointer capitalize
                ${activeTab === tab ? 'text-cyan-300' : 'text-slate-400 hover:text-white'}
              `}
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {tab}
            </button>
          ))}
          <div
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300 rounded-full"
            style={{
              left: activeTab === 'login' ? '0%' : '50%',
              width: '50%',
              boxShadow: '0 0 10px rgba(56,189,248,0.7)',
            }}
          />
        </div>

        {/* Forms */}
        {activeTab === 'login'
          ? <LoginForm onSuccess={handleSuccess} />
          : <RegisterForm onSuccess={handleSuccess} />
        }

        {/* Switch link */}
        <p className="mt-5 text-center text-xs text-slate-500">
          {activeTab === 'login' ? "Don't have an account? " : 'Already registered? '}
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
          >
            {activeTab === 'login' ? 'Register here' : 'Login'}
          </button>
        </p>
      </div>
    </main>
  );
};

export default AuthPage;
