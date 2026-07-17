import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AlertCircle } from 'lucide-react';
import { setUser } from '../redux/slices/authSlice';
import Spinner from '../components/ui/Spinner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const calledRef      = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code          = searchParams.get('code');
    const returnedState = searchParams.get('state');
    const oauthError    = searchParams.get('error');

    if (oauthError || !code) {
      navigate('/login', { replace: true });
      return;
    }

    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');

    if (!storedState || returnedState !== storedState) {
      navigate('/login', { replace: true });
      return;
    }

    (async () => {
      try {
        const res  = await fetch(`${BACKEND_URL}/api/auth/google/callback`, {
          method:      'POST',
          headers:     { 'Content-Type': 'application/json' },
          credentials: 'include',
          body:        JSON.stringify({ code }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || 'Google authentication failed');

        dispatch(setUser({ user: data.data.user, usage: data.data.usage }));
        navigate('/dashboard', { replace: true });
      } catch (err) {
        const msg = err.name === 'TypeError'
          ? 'Cannot connect to server. Please try again.'
          : (err.message || 'Authentication failed. Please try again.');
        setError(msg);
        setTimeout(() => navigate('/login', { replace: true }), 3500);
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-red-500" />
          </div>
          <p className="font-semibold text-sm mb-1">{error}</p>
          <p className="text-black/40 text-xs">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Spinner />
      <p className="text-sm text-black/40">Completing sign in with Google...</p>
    </div>
  );
}
