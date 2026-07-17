import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SessionExpiredError } from '../../../../lib/apiFetch';
import { fetchErpSubscriptionStatus } from '../../../../services/erpSubscriptionApi';
import {
  setErpSubscriptionState,
  selectChatSubscription,
  selectTradeSubscription,
  selectBonusEligibility,
} from '../../../../redux/slices/subscriptionSlice';
import {
  setEntitlements,
  selectCanAccessChat,
  selectCanAccessErp,
  selectErpModuleEntitlements,
  selectFeatureFlags,
  selectEntitlementsLoaded,
} from '../../../../redux/slices/entitlementSlice';

export function useEntitlements() {
  const dispatch = useDispatch();
  const chat = useSelector(selectChatSubscription);
  const trade = useSelector(selectTradeSubscription);
  const bonusEligibility = useSelector(selectBonusEligibility);
  const canAccessChat = useSelector(selectCanAccessChat);
  const canAccessErp = useSelector(selectCanAccessErp);
  const erpModules = useSelector(selectErpModuleEntitlements);
  const featureFlags = useSelector(selectFeatureFlags);
  const loaded = useSelector(selectEntitlementsLoaded);

  const refresh = useCallback(async () => {
    try {
      const result = await fetchErpSubscriptionStatus();
      const { subscription, entitlements } = result.data;
      dispatch(setErpSubscriptionState(subscription));
      dispatch(setEntitlements(entitlements));
    } catch (err) {
      if (err instanceof SessionExpiredError) return;
      // Settle loaded=true with safe defaults so the UI does not spin forever
      // on a transient network error. The user can refresh to retry.
      dispatch(setEntitlements({}));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!loaded) refresh();
  }, [loaded, refresh]);

  return {
    chat,
    trade,
    bonusEligibility,
    canAccessChat,
    canAccessErp,
    erpModules,
    featureFlags,
    loaded,
    refresh,
  };
}
