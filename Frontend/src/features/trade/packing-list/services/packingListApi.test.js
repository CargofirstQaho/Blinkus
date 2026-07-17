import { apiFetch } from '../../../../lib/apiFetch';
import {
  savePackingListDraftApi,
  getLatestPackingListDraftApi,
  getPackingListByIdApi,
  generatePackingListPdfApi,
  deletePackingListDraftApi,
} from './packingListApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockPl = { _id: 'pl-1', packingListNumber: 'PL-2026-001' };

describe('packingListApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('savePackingListDraftApi', () => {
    it('sends POST request with JSON payload and returns packingList', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { packingList: mockPl }));
      const result = await savePackingListDraftApi({ packingListNumber: 'PL-2026-001' });
      expect(result).toEqual(mockPl);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/packing-lists/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(savePackingListDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestPackingListDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { packingList: mockPl }));
      const result = await getLatestPackingListDraftApi();
      expect(result).toEqual(mockPl);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestPackingListDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestPackingListDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getPackingListByIdApi', () => {
    it('fetches packing list by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { packingList: mockPl }));
      const result = await getPackingListByIdApi('pl-1');
      expect(result).toEqual(mockPl);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/packing-lists/pl-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getPackingListByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('generatePackingListPdfApi', () => {
    it('sends POST request with payload to generate endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { packingList: { ...mockPl, pdfUrl: 'https://example.com/pl.pdf' } }));
      const result = await generatePackingListPdfApi('pl-1', { foo: 'bar' });
      expect(result.pdfUrl).toBe('https://example.com/pl.pdf');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/packing-lists/pl-1/generate');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ foo: 'bar' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Generation failed'));
      await expect(generatePackingListPdfApi('pl-1', {})).rejects.toThrow('Generation failed');
    });
  });

  describe('deletePackingListDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deletePackingListDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/packing-lists/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deletePackingListDraftApi()).rejects.toThrow('Delete failed');
    });
  });
});
