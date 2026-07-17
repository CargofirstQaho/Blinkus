import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePricing } from './usePricing';
import { createTestStore } from '../../../../tests/utils';
import { SessionExpiredError } from '../../../../lib/apiFetch';
import { fetchErpPlans } from '../../../../services/erpSubscriptionApi';

jest.mock('../../../../services/erpSubscriptionApi', () => ({
  fetchErpPlans: jest.fn(),
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const plans = [
  { planType: 'monthly', price: 999 },
  { planType: 'yearly', price: 9999 },
];

describe('usePricing', () => {
  beforeEach(() => {
    fetchErpPlans.mockReset();
  });

  it('refreshes pricing automatically on mount', async () => {
    fetchErpPlans.mockResolvedValue({ data: { plans } });
    const store = createTestStore();
    const { result } = renderHook(() => usePricing(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loaded).toBe(true));

    expect(result.current.trade).toEqual({ monthly: plans[0], yearly: plans[1] });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not refresh again once pricing is loaded', () => {
    const store = createTestStore({
      pricing: { trade: { monthly: plans[0] }, chat: null, loading: false, loaded: true },
    });
    renderHook(() => usePricing(), { wrapper: wrapperFor(store) });

    expect(fetchErpPlans).not.toHaveBeenCalled();
  });

  it('silently ignores a SessionExpiredError', async () => {
    fetchErpPlans.mockRejectedValue(new SessionExpiredError());
    const store = createTestStore();
    const { result } = renderHook(() => usePricing(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(fetchErpPlans).toHaveBeenCalled());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets an error message when fetching pricing fails', async () => {
    fetchErpPlans.mockRejectedValue(new Error('Failed to load pricing'));
    const store = createTestStore();
    const { result } = renderHook(() => usePricing(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.error).toBe('Failed to load pricing'));
    expect(result.current.loaded).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('refresh can be called manually to update pricing', async () => {
    fetchErpPlans.mockResolvedValue({ data: { plans } });
    const store = createTestStore({
      pricing: { trade: null, chat: null, loading: false, loaded: true },
    });
    const { result } = renderHook(() => usePricing(), { wrapper: wrapperFor(store) });

    expect(fetchErpPlans).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.trade).toEqual({ monthly: plans[0], yearly: plans[1] });
  });
});
