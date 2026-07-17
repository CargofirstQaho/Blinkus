import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useEntitlements } from './useEntitlements';
import { createTestStore } from '../../../../tests/utils';
import { SessionExpiredError } from '../../../../lib/apiFetch';
import { fetchErpSubscriptionStatus } from '../../../../services/erpSubscriptionApi';

jest.mock('../../../../services/erpSubscriptionApi', () => ({
  fetchErpSubscriptionStatus: jest.fn(),
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const subscriptionPayload = {
  chat: { planType: 'pro', status: 'active', startDate: null, endDate: null, unlimitedAccess: true, source: 'paid' },
  trade: { planType: 'pro', status: 'active', startDate: null, endDate: null, unlimitedAccess: true },
  bonusEligibility: { sixMonthBonusUsed: true, yearlyBonusUsed: false },
};

const entitlementsPayload = {
  chat: true,
  erp: true,
  erpModules: { addOrganization: true, domestic: true, international: false, tradeHistory: true },
  featureFlags: { erpPaymentEnabled: true, chatPaymentEnabled: false, chatLimitsEnabled: true },
};

describe('useEntitlements', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('refreshes entitlements automatically on mount', async () => {
    fetchErpSubscriptionStatus.mockResolvedValue({
      data: { subscription: subscriptionPayload, entitlements: entitlementsPayload },
    });
    const store = createTestStore();
    const { result } = renderHook(() => useEntitlements(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.chat).toEqual(subscriptionPayload.chat);
    expect(result.current.trade).toEqual(subscriptionPayload.trade);
    expect(result.current.bonusEligibility).toEqual(subscriptionPayload.bonusEligibility);
    expect(result.current.canAccessChat).toBe(true);
    expect(result.current.canAccessErp).toBe(true);
    expect(result.current.erpModules).toEqual(entitlementsPayload.erpModules);
    expect(result.current.featureFlags).toEqual(entitlementsPayload.featureFlags);
  });

  it('does not refresh again once entitlements are loaded', () => {
    const store = createTestStore({
      entitlement: {
        chat: true,
        erp: true,
        erpModules: entitlementsPayload.erpModules,
        featureFlags: entitlementsPayload.featureFlags,
        loaded: true,
      },
    });
    renderHook(() => useEntitlements(), { wrapper: wrapperFor(store) });

    expect(fetchErpSubscriptionStatus).not.toHaveBeenCalled();
  });

  it('silently ignores a SessionExpiredError', async () => {
    fetchErpSubscriptionStatus.mockRejectedValue(new SessionExpiredError());
    const store = createTestStore();
    const { result } = renderHook(() => useEntitlements(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(fetchErpSubscriptionStatus).toHaveBeenCalled());

    expect(result.current.loaded).toBe(false);
  });

  it('settles with loaded=true and safe defaults on a generic error', async () => {
    fetchErpSubscriptionStatus.mockRejectedValue(new Error('Network error'));
    const store = createTestStore();
    const { result } = renderHook(() => useEntitlements(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(fetchErpSubscriptionStatus).toHaveBeenCalled());

    await waitFor(() => expect(result.current.loaded).toBe(true));
  });

  it('refresh can be called manually to update entitlements', async () => {
    fetchErpSubscriptionStatus.mockResolvedValue({
      data: { subscription: subscriptionPayload, entitlements: entitlementsPayload },
    });
    const store = createTestStore({
      entitlement: {
        chat: true,
        erp: false,
        erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: false },
        featureFlags: { erpPaymentEnabled: false, chatPaymentEnabled: false, chatLimitsEnabled: false },
        loaded: true,
      },
    });
    const { result } = renderHook(() => useEntitlements(), { wrapper: wrapperFor(store) });

    expect(fetchErpSubscriptionStatus).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.canAccessErp).toBe(true);
    expect(result.current.erpModules).toEqual(entitlementsPayload.erpModules);
  });
});
