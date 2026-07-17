import { useState, useCallback } from 'react';
import { apiGetPaymentHistory } from '../services/settingsApi';

export function usePaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [loaded,   setLoaded]   = useState(false);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiGetPaymentHistory(p, 10);
      setPayments(result.data.payments);
      setTotal(result.data.total);
      setPage(result.data.page);
      setPages(result.data.pages);
      setLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { payments, total, page, pages, loading, error, loaded, load };
}
