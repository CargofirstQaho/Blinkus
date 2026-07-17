import { apiFetch } from '../../../../lib/apiFetch';
import {
  saveCreditNoteDraftApi,
  getLatestCreditNoteDraftApi,
  getCreditNoteByIdApi,
  generateCreditNotePdfApi,
  deleteCreditNoteDraftApi,
} from './creditNoteApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockCn = { _id: 'cn-1', creditNoteNumber: 'CN-2026-001' };

describe('creditNoteApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveCreditNoteDraftApi', () => {
    it('sends POST request with JSON payload and returns creditNote', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { creditNote: mockCn }));
      const result = await saveCreditNoteDraftApi({ creditNoteNumber: 'CN-2026-001' });
      expect(result).toEqual(mockCn);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/credit-notes/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveCreditNoteDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestCreditNoteDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { creditNote: mockCn }));
      const result = await getLatestCreditNoteDraftApi();
      expect(result).toEqual(mockCn);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestCreditNoteDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestCreditNoteDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getCreditNoteByIdApi', () => {
    it('fetches credit note by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { creditNote: mockCn }));
      const result = await getCreditNoteByIdApi('cn-1');
      expect(result).toEqual(mockCn);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/credit-notes/cn-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getCreditNoteByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generateCreditNotePdfApi', () => {
    it('sends POST request with payload to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { creditNote: { ...mockCn, pdfUrl: 'https://example.com/cn.pdf' } }));
      const result = await generateCreditNotePdfApi('cn-1', { foo: 'bar' });
      expect(result.pdfUrl).toBe('https://example.com/cn.pdf');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/credit-notes/cn-1/generate');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generateCreditNotePdfApi('cn-1', {})).rejects.toThrow('Generation failed');
    });
  });

  describe('deleteCreditNoteDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteCreditNoteDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/credit-notes/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteCreditNoteDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
