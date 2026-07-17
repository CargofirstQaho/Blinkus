import { apiFetch } from '../../../../lib/apiFetch';
import {
  saveDraftApi,
  getLatestDraftApi,
  getPurchaseOrderByIdApi,
  generatePdfApi,
  deleteDraftApi,
} from './purchaseOrderApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockPo = { _id: 'po-1', poNumber: 'PO-2026-001' };

describe('purchaseOrderApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveDraftApi', () => {
    it('sends POST request with JSON payload and returns purchaseOrder', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { purchaseOrder: mockPo }));
      const result = await saveDraftApi({ poNumber: 'PO-2026-001' });
      expect(result).toEqual(mockPo);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/purchase-orders/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { purchaseOrder: mockPo }));
      const result = await getLatestDraftApi();
      expect(result).toEqual(mockPo);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/purchase-orders/draft'));
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getPurchaseOrderByIdApi', () => {
    it('fetches purchase order by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { purchaseOrder: mockPo }));
      const result = await getPurchaseOrderByIdApi('po-1');
      expect(result).toEqual(mockPo);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/purchase-orders/po-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getPurchaseOrderByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generatePdfApi', () => {
    it('sends POST request to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { purchaseOrder: { ...mockPo, pdfUrl: 'https://example.com/po.pdf' } }));
      const result = await generatePdfApi('po-1');
      expect(result.pdfUrl).toBe('https://example.com/po.pdf');
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/purchase-orders/po-1/generate'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generatePdfApi('po-1')).rejects.toThrow('Generation failed');
    });
  });

  describe('deleteDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/purchase-orders/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
