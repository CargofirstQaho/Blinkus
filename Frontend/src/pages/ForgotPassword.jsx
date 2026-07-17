import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { cn } from '../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [emailErr, setEmailErr] = useState('');

  const emailRef = useRef(null);

  const validate = () => {
    if (!email.trim()) {
      setEmailErr('Email is required');
      emailRef.current?.focus();
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr('Please enter a valid email address');
      emailRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailErr('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');

      sessionStorage.setItem('blinkus_reset_email', email.trim());
      navigate('/verify-reset-otp', { state: { email: email.trim() } });
    } catch (err) {
      setError(err.name === 'TypeError' ? 'Cannot connect to server. Please check your connection.' : err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (hasErr) => cn(
    'w-full px-4 py-3 rounded-xl border bg-black/3 outline-none transition-all text-sm disabled:opacity-60',
    hasErr
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/15'
      : 'border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20'
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 rotate-6">
            <KeyRound size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Forgot password?</h1>
          <p className="text-black/50 text-sm sm:text-base leading-relaxed max-w-xs">
            Enter the email address linked to your account and we'll send a reset code.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-sm font-semibold mb-1.5">Email</label>
            <input
              ref={emailRef}
              id="fp-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailErr(''); setError(''); }}
              placeholder="you@company.com"
              disabled={loading}
              aria-invalid={!!emailErr}
              aria-describedby={emailErr ? 'err-fp-email' : undefined}
              className={inputCls(!!emailErr)}
            />
            {emailErr && (
              <p id="err-fp-email" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={12} className="shrink-0" /> {emailErr}
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Send Reset Code <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-black/50 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
