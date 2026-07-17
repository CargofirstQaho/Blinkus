import { useCallback, useEffect, useState } from 'react';
import { getShipmentOverviewApi } from '../services/shipmentApi';

export function useShipmentOverview(contractId) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = useCallback(() => {
    if (!contractId) {
      setLoading(false);
      return () => {};
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getShipmentOverviewApi(contractId)
      .then((result) => {
        if (cancelled) return;
        setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [contractId]);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { data, loading, error, refresh: load };
}
