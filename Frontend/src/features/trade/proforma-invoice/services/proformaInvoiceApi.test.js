import { apiFetch } from '../../../../lib/apiFetch';
import {
  saveProformaInvoiceDraftApi,
  getLatestProformaInvoiceDraftApi,
  getProformaInvoiceByIdApi,
  generateProformaInvoicePdfApi,
  deleteProformaInvoiceDraftApi,
} from './proformaInvoiceApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockPi = { _id: 'pi-1', invoiceNumber: 'PI-2026-001' };

describe('proformaInvoiceApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveProformaInvoiceDraftApi', () => {
    it('sends POST request with JSON payload and returns proformaInvoice', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { proformaInvoice: mockPi }));
      const result = await saveProformaInvoiceDraftApi({ invoiceNumber: 'PI-2026-001' });
      expect(result).toEqual(mockPi);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/proforma-invoices/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveProformaInvoiceDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestProformaInvoiceDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { proformaInvoice: mockPi }));
      const result = await getLatestProformaInvoiceDraftApi();
      expect(result).toEqual(mockPi);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestProformaInvoiceDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestProformaInvoiceDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getProformaInvoiceByIdApi', () => {
    it('fetches proforma invoice by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { proformaInvoice: mockPi }));
      const result = await getProformaInvoiceByIdApi('pi-1');
      expect(result).toEqual(mockPi);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/proforma-invoices/pi-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getProformaInvoiceByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generateProformaInvoicePdfApi', () => {
    it('sends POST request with payload to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { proformaInvoice: { ...mockPi, pdfUrl: 'https://example.com/pi.pdf' } }));
      const result = await generateProformaInvoicePdfApi('pi-1', { foo: 'bar' });
      expect(result.pdfUrl).toBe('https://example.com/pi.pdf');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/proforma-invoices/pi-1/generate');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generateProformaInvoicePdfApi('pi-1', {})).rejects.toThrow('Generation failed');
    });
  });

  describe('deleteProformaInvoiceDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteProformaInvoiceDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/proforma-invoices/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteProformaInvoiceDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
