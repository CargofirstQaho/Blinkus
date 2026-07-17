import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'motion/react';
import { Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { setUser } from '../redux/slices/authSlice';
import { apiFetch, SessionExpiredError } from '../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Consent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [termsOfService, setTermsOfService] = useState(false);
  const [privacyPolicy,  setPrivacyPolicy]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const canContinue = termsOfService && privacyPolicy;

  const handleContinue = async () => {
    if (!canContinue || loading) return;

    setLoading(true);
    setError('');
    try {
      const response = await apiFetch(`${BACKEND_URL}/api/auth/accept-terms`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ termsOfService, privacyPolicy }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Failed to record your acceptance. Please try again.');

      dispatch(setUser({ user: data.data.user }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      setError(
        err.name === 'TypeError'
          ? 'Cannot connect to server. Please check your connection and try again.'
          : err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white px-4 py-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mb-6 rotate-6">
          <Globe size={28} className="text-white" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Welcome to Blinkus</h1>
        <p className="text-black/50 text-sm sm:text-base mb-8">
          To continue using Blinkus, please review and accept our Terms of Service and Privacy Policy.
        </p>

        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-xl border border-black/10 p-4 hover:bg-black/3 transition-colors">
            <input
              type="checkbox"
              checked={termsOfService}
              onChange={(e) => { setTermsOfService(e.target.checked); setError(''); }}
              disabled={loading}
              className="mt-0.5 w-4 h-4 shrink-0 rounded border-black/20 text-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            />
            <span className="text-sm">
              I have read and agree to the{' '}
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                Terms of Service
              </a>
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-xl border border-black/10 p-4 hover:bg-black/3 transition-colors">
            <input
              type="checkbox"
              checked={privacyPolicy}
              onChange={(e) => { setPrivacyPolicy(e.target.checked); setError(''); }}
              disabled={loading}
              className="mt-0.5 w-4 h-4 shrink-0 rounded border-black/20 text-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            />
            <span className="text-sm">
              I have read and agree to the{' '}
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {error && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue || loading}
          className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-6"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Continue <ArrowRight size={18} /></>
          )}
        </button>
      </motion.div>
    </div>
  );
}
