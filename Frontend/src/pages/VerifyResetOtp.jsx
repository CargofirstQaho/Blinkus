import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const OTP_LENGTH  = 6;

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || sessionStorage.getItem('blinkus_reset_email') || '';

  const [digits,    setDigits]    = useState(Array(OTP_LENGTH).fill(''));
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) { navigate('/forgot-password', { replace: true }); return; }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const otp = digits.join('');

  const handleChange = (i, val) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = char;
    setDigits(next);
    setError('');
    if (char && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const next = [...digits];
        next[i] = '';
        setDigits(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1]?.focus();
    } else if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH || loading) return;
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/auth/verify-reset-otp`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      sessionStorage.removeItem('blinkus_reset_email');
      navigate('/reset-password', { replace: true, state: { resetToken: data.data.resetToken } });
    } catch (err) {
      setError(err.name === 'TypeError' ? 'Cannot connect to server. Please check your connection.' : err.message);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setError('');
    setSuccess('');
    setResending(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Failed to resend code');

      setSuccess('A new reset code has been sent to your email.');
      setCountdown(60);
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.name === 'TypeError' ? 'Cannot connect to server.' : err.message);
    } finally {
      setResending(false);
    }
  };

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
          <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Enter reset code</h1>
          <p className="text-black/50 text-sm sm:text-base leading-relaxed max-w-xs">
            We sent a 6-digit code to{' '}
            <span className="font-semibold text-black/70">{email}</span>
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 justify-center mb-6" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border bg-black/3 outline-none transition-all disabled:opacity-60 border-black/10 focus:border-accent focus:ring-2 focus:ring-accent/20 caret-transparent"
            />
          ))}
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && !error && (
          <div role="status" className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2.5">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.length < OTP_LENGTH || loading}
          className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mb-4"
        >
          {loading
            ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : 'Verify Code'}
        </button>

        <div className="text-center text-sm">
          {countdown > 0 ? (
            <span className="text-black/40">Resend code in <span className="font-semibold text-black/60">{countdown}s</span></span>
          ) : (
            <span className="text-black/50">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-accent font-semibold hover:underline disabled:opacity-60"
              >
                {resending ? 'Sending...' : 'Resend'}
              </button>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
