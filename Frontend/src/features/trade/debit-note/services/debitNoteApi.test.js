import { apiFetch } from '../../../../lib/apiFetch';
import {
  saveDebitNoteDraftApi,
  getLatestDebitNoteDraftApi,
  getDebitNoteByIdApi,
  generateDebitNotePdfApi,
  deleteDebitNoteDraftApi,
} from './debitNoteApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockDn = { _id: 'dn-1', debitNoteNumber: 'DN-2026-001' };

describe('debitNoteApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveDebitNoteDraftApi', () => {
    it('sends POST request with JSON payload and returns debitNote', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { debitNote: mockDn }));
      const result = await saveDebitNoteDraftApi({ debitNoteNumber: 'DN-2026-001' });
      expect(result).toEqual(mockDn);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/debit-notes/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveDebitNoteDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestDebitNoteDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { debitNote: mockDn }));
      const result = await getLatestDebitNoteDraftApi();
      expect(result).toEqual(mockDn);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestDebitNoteDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestDebitNoteDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getDebitNoteByIdApi', () => {
    it('fetches debit note by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { debitNote: mockDn }));
      const result = await getDebitNoteByIdApi('dn-1');
      expect(result).toEqual(mockDn);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/debit-notes/dn-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getDebitNoteByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generateDebitNotePdfApi', () => {
    it('sends POST request with payload to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { debitNote: { ...mockDn, pdfUrl: 'https://example.com/dn.pdf' } }));
      const result = await generateDebitNotePdfApi('dn-1', { foo: 'bar' });
      expect(result.pdfUrl).toBe('https://example.com/dn.pdf');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/debit-notes/dn-1/generate');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generateDebitNotePdfApi('dn-1', {})).rejects.toThrow('Generation failed');
    });
  });

  describe('deleteDebitNoteDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteDebitNoteDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/debit-notes/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteDebitNoteDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
