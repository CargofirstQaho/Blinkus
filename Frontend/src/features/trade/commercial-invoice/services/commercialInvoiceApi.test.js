import { apiFetch } from '../../../../lib/apiFetch';
import {
  saveCommercialInvoiceDraftApi,
  getLatestCommercialInvoiceDraftApi,
  getCommercialInvoiceByIdApi,
  generateCommercialInvoicePdfApi,
  deleteCommercialInvoiceDraftApi,
} from './commercialInvoiceApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockCi = { _id: 'ci-1', invoiceNumber: 'CI-2026-001' };

describe('commercialInvoiceApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveCommercialInvoiceDraftApi', () => {
    it('sends POST request with JSON payload and returns commercialInvoice', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { commercialInvoice: mockCi }));
      const result = await saveCommercialInvoiceDraftApi({ invoiceNumber: 'CI-2026-001' });
      expect(result).toEqual(mockCi);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/commercial-invoices/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveCommercialInvoiceDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestCommercialInvoiceDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { commercialInvoice: mockCi }));
      const result = await getLatestCommercialInvoiceDraftApi();
      expect(result).toEqual(mockCi);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestCommercialInvoiceDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestCommercialInvoiceDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getCommercialInvoiceByIdApi', () => {
    it('fetches commercial invoice by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { commercialInvoice: mockCi }));
      const result = await getCommercialInvoiceByIdApi('ci-1');
      expect(result).toEqual(mockCi);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/commercial-invoices/ci-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getCommercialInvoiceByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generateCommercialInvoicePdfApi', () => {
    it('sends POST request with payload to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { commercialInvoice: { ...mockCi, pdfUrl: 'https://example.com/ci.pdf' } }));
      const result = await generateCommercialInvoicePdfApi('ci-1', { foo: 'bar' });
      expect(result.pdfUrl).toBe('https://example.com/ci.pdf');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/commercial-invoices/ci-1/generate');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generateCommercialInvoicePdfApi('ci-1', {})).rejects.toThrow('Generation failed');
    });
  });

  describe('deleteCommercialInvoiceDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteCommercialInvoiceDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/commercial-invoices/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteCommercialInvoiceDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
