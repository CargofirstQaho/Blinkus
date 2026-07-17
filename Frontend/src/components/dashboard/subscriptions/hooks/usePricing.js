import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SessionExpiredError } from '../../../../lib/apiFetch';
import { fetchErpPlans } from '../../../../services/erpSubscriptionApi';
import {
  setPricingData,
  setPricingLoading,
  selectTradePricing,
  selectChatPricing,
  selectPricingLoading,
  selectPricingLoaded,
} from '../../../../redux/slices/pricingSlice';

export function usePricing() {
  const dispatch = useDispatch();
  const trade = useSelector(selectTradePricing);
  const chat = useSelector(selectChatPricing);
  const loading = useSelector(selectPricingLoading);
  const loaded = useSelector(selectPricingLoaded);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    dispatch(setPricingLoading(true));
    try {
      const result = await fetchErpPlans();
      const plansByType = {};
      result.data.plans.forEach((plan) => { plansByType[plan.planType] = plan; });
      dispatch(setPricingData({ trade: plansByType }));
      setError(null);
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      setError(err.message || 'Failed to load pricing');
    } finally {
      dispatch(setPricingLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!loaded) refresh();
  }, [loaded, refresh]);

  return { trade, chat, loading, loaded, error, refresh };
}
