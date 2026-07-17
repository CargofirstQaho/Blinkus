import { useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import { Globe, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { setUser } from '../redux/slices/authSlice';
import { cn } from '../lib/utils';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Login() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const successMessage = location.state?.successMessage || '';

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const emailRef    = useRef(null);
  const passwordRef = useRef(null);

  const clearFieldError = (field) =>
    setErrors((p) => ({ ...p, [field]: '' }));

  const validate = () => {
    const next = { email: '', password: '' };
    let firstRef = null;

    if (!email.trim()) {
      next.email = 'Email is required';
      firstRef = firstRef ?? emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address';
      firstRef = firstRef ?? emailRef;
    }

    if (!password) {
      next.password = 'Password is required';
      firstRef = firstRef ?? passwordRef;
    }

    setErrors(next);
    if (firstRef) { firstRef.current?.focus(); return false; }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 403 && data.message === 'EMAIL_NOT_VERIFIED') {
          sessionStorage.setItem('blinkus_verify_email', email.trim());
          navigate('/verify-otp', { state: { email: email.trim() } });
          return;
        }
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      dispatch(setUser({ user: data.data.user, usage: data.data.usage }));
      navigate('/dashboard');
    } catch (err) {
      setFormError(
        err.name === 'TypeError'
          ? 'Cannot connect to server. Please check your connection and try again.'
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) => cn(
    'w-full px-4 py-3 rounded-xl border bg-black/3 outline-none transition-all text-sm disabled:opacity-60',
    errors[field]
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'
      : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <div className="hidden lg:flex w-[45%] xl:w-1/2 shrink-0 bg-black items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-md text-white">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-8 rotate-6">
            <Globe size={28} />
          </div>
          <h2 className="text-4xl xl:text-5xl font-display font-bold leading-tight mb-6">
            Trade smarter with{' '}
            <span className="text-accent italic">AI intelligence.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Access real-time trade data, AI agents, and global market insights in one platform.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[['1,200+', 'Trading Firms'], ['$4.2B', 'Trade Processed'], ['98.4%', 'Trust Score']].map(
              ([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-display font-bold text-accent">{val}</div>
                  <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-screen lg:min-h-0 px-4 py-10 sm:px-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm sm:max-w-md"
        >
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
          </div>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Welcome back</h1>
            <p className="text-black/50 text-sm sm:text-base">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          {successMessage && (
            <div role="status" className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2.5">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} noValidate className="space-y-4">

            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold mb-1.5">
                Email
              </label>
              <input
                ref={emailRef}
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); setFormError(''); }}
                placeholder="you@company.com"
                disabled={loading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'err-email' : undefined}
                className={inputCls('email')}
              />
              {errors.email && (
                <p id="err-email" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); setFormError(''); }}
                  placeholder="••••••••" 
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'err-password' : undefined}
                  className={cn(inputCls('password'), 'pr-12')}
                />
                <button 
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60 transition-colors"
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p id="err-password" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-accent hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            {formError && (
              <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs text-black/30 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <GoogleAuthButton disabled={loading} />
        </motion.div>
      </div>
    </div>
  );
}
