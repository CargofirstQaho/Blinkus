import { useState, useCallback } from 'react';
import { apiGetCurrentSubscription } from '../services/settingsApi';

export function useCurrentSubscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [loaded,       setLoaded]       = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGetCurrentSubscription();
      setSubscription(result.data.subscription);
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscription, loading, error, loaded, load };
}
