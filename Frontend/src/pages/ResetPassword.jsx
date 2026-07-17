import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState({ password: '', confirm: '' });
  const [formError, setFormError] = useState('');

  const passwordRef = useRef(null);
  const confirmRef  = useRef(null);

  if (!resetToken) {
    navigate('/forgot-password', { replace: true });
    return null;
  }

  const validate = () => {
    const next = { password: '', confirm: '' };
    let firstRef = null;
    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters';
      firstRef = firstRef ?? passwordRef;
    }
    if (!confirm) {
      next.confirm = 'Please confirm your password';
      firstRef = firstRef ?? confirmRef;
    } else if (password !== confirm) {
      next.confirm = 'Passwords do not match';
      firstRef = firstRef ?? confirmRef;
    }
    setErrors(next);
    if (firstRef) { firstRef.current?.focus(); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ resetToken, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to reset password. Please try again.');

      navigate('/login', { replace: true, state: { successMessage: 'Password updated. Please sign in.' } });
    } catch (err) {
      setFormError(err.name === 'TypeError' ? 'Cannot connect to server. Please check your connection.' : err.message);
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-5 rotate-6">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Set new password</h1>
          <p className="text-black/50 text-sm sm:text-base leading-relaxed max-w-xs">
            Choose a strong password for your Blinkus account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="rp-password" className="block text-sm font-semibold mb-1.5">New Password</label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="rp-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); setFormError(''); }}
                placeholder="Min. 8 characters"
                disabled={loading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'err-rp-password' : undefined}
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
              <p id="err-rp-password" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={12} className="shrink-0" /> {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rp-confirm" className="block text-sm font-semibold mb-1.5">Confirm Password</label>
            <input
              ref={confirmRef}
              id="rp-confirm"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: '' })); setFormError(''); }}
              placeholder="Repeat your password"
              disabled={loading}
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? 'err-rp-confirm' : undefined}
              className={inputCls('confirm')}
            />
            {errors.confirm && (
              <p id="err-rp-confirm" role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle size={12} className="shrink-0" /> {errors.confirm}
              </p>
            )}
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
            {loading
              ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>Update Password <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
