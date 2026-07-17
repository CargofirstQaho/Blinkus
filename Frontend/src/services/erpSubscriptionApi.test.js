import { apiFetch } from '../lib/apiFetch';
import {
  fetchErpSubscriptionStatus,
  fetchErpPlans,
  fetchErpHistory,
  fetchPricingPlans,
  createErpOrder,
} from './erpSubscriptionApi';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, body) {
  return { ok, json: jest.fn().mockResolvedValue(body) };
}

describe('erpSubscriptionApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('fetchErpSubscriptionStatus', () => {
    it('returns subscription status data', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { data: { status: 'active' } }));
      const result = await fetchErpSubscriptionStatus();
      expect(result).toEqual({ data: { status: 'active' } });
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/erp/subscription/status'));
    });

    it('throws when request fails', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(fetchErpSubscriptionStatus()).rejects.toThrow('Failed to load subscription status');
    });
  });

  describe('fetchErpPlans', () => {
    it('returns plans data', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { data: { plans: [] } }));
      const result = await fetchErpPlans();
      expect(result).toEqual({ data: { plans: [] } });
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/erp/subscription/plans'));
    });

    it('throws when request fails', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(fetchErpPlans()).rejects.toThrow('Failed to load ERP plans');
    });
  });

  describe('fetchErpHistory', () => {
    it('returns history data', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { data: { history: [] } }));
      const result = await fetchErpHistory();
      expect(result).toEqual({ data: { history: [] } });
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/erp/subscription/history'));
    });

    it('throws when request fails', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(fetchErpHistory()).rejects.toThrow('Failed to load plan history');
    });
  });

  describe('fetchPricingPlans', () => {
    it('returns pricing data', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { data: { pricing: [] } }));
      const result = await fetchPricingPlans();
      expect(result).toEqual({ data: { pricing: [] } });
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/erp/subscription/pricing'));
    });

    it('throws when request fails', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(fetchPricingPlans()).rejects.toThrow('Failed to load pricing');
    });
  });

  describe('createErpOrder', () => {
    it('sends planType and returns order data', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { data: { orderId: 'order-1' } }));
      const result = await createErpOrder('pro');
      expect(result).toEqual({ data: { orderId: 'order-1' } });
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/erp/subscription/order');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ planType: 'pro' });
    });

    it('throws when request fails', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(createErpOrder('pro')).rejects.toThrow('Failed to create order');
    });
  });
});
