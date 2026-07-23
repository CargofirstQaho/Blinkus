import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Globe, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const INIT_ERRORS = { name: '', email: '', mobile: '', password: '' };

export default function Signup() {
  const navigate = useNavigate();

  const [name,          setName]          = useState('');
  const [email,         setEmail]         = useState('');
  const [mobile,        setMobile]        = useState('');
  const [password,      setPassword]      = useState('');
  const [showPass,      setShowPass]      = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState(INIT_ERRORS);
  const [formError, setFormError] = useState('');

  const nameRef     = useRef(null);
  const emailRef    = useRef(null);
  const mobileRef   = useRef(null);
  const passwordRef = useRef(null);

  const clearFieldError = (field) =>
    setErrors((p) => ({ ...p, [field]: '' }));

  const validate = () => {
    const next = { ...INIT_ERRORS };
    let firstRef = null;

    if (!name.trim()) {
      next.name = 'Full name is required';
      firstRef = firstRef ?? nameRef;
    }

    if (!email.trim()) {
      next.email = 'Email is required';
      firstRef = firstRef ?? emailRef;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address';
      firstRef = firstRef ?? emailRef;
    }

    if (!mobile.trim()) {
      next.mobile = 'Mobile number is required';
      firstRef = firstRef ?? mobileRef;
    } else if (!/^\+?[\d\s\-()\\.]{7,20}$/.test(mobile.trim())) {
      next.mobile = 'Please enter a valid mobile number';
      firstRef = firstRef ?? mobileRef;
    }

    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters';
      firstRef = firstRef ?? passwordRef;
    }

    setErrors(next);
    if (firstRef) { firstRef.current?.focus(); return false; }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    if (!agreedToTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        credentials: 'include',
        body:        JSON.stringify({
          name:     name.trim(),
          email:    email.trim(),
          mobile:   mobile.trim(),
          password,
          termsAccepted: agreedToTerms,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((p) => ({ ...p, email: data.message || 'This email is already registered.' }));
          emailRef.current?.focus();
          return;
        }
        throw new Error(data.message || 'Signup failed. Please try again.');
      }

      const emailVal = email.trim();
      sessionStorage.setItem('blinkus_verify_email', emailVal);
      navigate('/verify-otp', { state: { email: emailVal } });
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

  const FieldError = ({ id, msg }) =>
    msg ? (
      <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
        <AlertCircle size={12} className="shrink-0" />
        {msg}
      </p>
    ) : null;

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
            Your global trade{' '}
            <span className="text-accent italic">command center.</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Join 1,200+ trading firms using Blinkus to automate intelligence and risk operations.
          </p>
          <ul className="mt-10 space-y-3">
            {[
              'Free 14-day trial, no credit card',
              'AI-powered trade agent included',
              'Real-time customs data access',
            ].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-white/70">
                <div className="w-5 h-5 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                </div>
                {t}
              </li>
            ))}
          </ul>
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
            <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">Create your account</h1>
            <p className="text-black/50 text-sm sm:text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSignup} noValidate className="space-y-4">

            <div>
              <label htmlFor="signup-name" className="block text-sm font-semibold mb-1.5">
                Full Name
              </label>
              <input
                ref={nameRef}
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => { setName(e.target.value); clearFieldError('name'); setFormError(''); }}
                placeholder="John Smith"
                disabled={loading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'err-name' : undefined}
                className={inputCls('name')}
              />
              <FieldError id="err-name" msg={errors.name} />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-semibold mb-1.5">
                Work Email
              </label>
              <input
                ref={emailRef}
                id="signup-email"
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
              <FieldError id="err-email" msg={errors.email} />
            </div>

            <div>
              <label htmlFor="signup-mobile" className="block text-sm font-semibold mb-1.5">
                Mobile Number
              </label>
              <input
                ref={mobileRef}
                id="signup-mobile"
                type="tel"
                autoComplete="tel"
                value={mobile}
                onChange={(e) => { setMobile(e.target.value); clearFieldError('mobile'); setFormError(''); }}
                placeholder="+1 234 567 8900"
                disabled={loading}
                aria-invalid={!!errors.mobile}
                aria-describedby={errors.mobile ? 'err-mobile' : undefined}
                className={inputCls('mobile')}
              />
              <FieldError id="err-mobile" msg={errors.mobile} />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-semibold mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="signup-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); setFormError(''); }}
                  placeholder="Min. 8 characters"
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
              <FieldError id="err-password" msg={errors.password} />
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => { setAgreedToTerms(e.target.checked); setFormError(''); }}
                disabled={loading}
                className="mt-0.5 w-4 h-4 shrink-0 rounded border-black/20 text-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              />
              <span className="text-xs text-black/50 leading-relaxed">
                I have read and agree to the{' '}
                <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {formError && (
              <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2.5">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs text-black/30 font-medium">or</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <GoogleAuthButton disabled={loading} />
        </motion.div>
      </div>
    </div>
  );
}
