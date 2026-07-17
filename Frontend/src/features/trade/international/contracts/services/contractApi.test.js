import { apiFetch } from '../../../../../lib/apiFetch';
import {
  saveContractDraftApi,
  getLatestContractDraftApi,
  getContractByIdApi,
  listFinalizedContractsApi,
  finalizeContractApi,
  uploadContractApi,
  deleteContractDraftApi,
  checkContractNumberApi,
} from './contractApi';

jest.mock('../../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return { ok, json: jest.fn().mockResolvedValue({ data, message }) };
}

const mockContract = { _id: 'contract-1', contractNumber: 'CT-2026-001' };

describe('contractApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('saveContractDraftApi', () => {
    it('sends POST request with JSON payload and returns contract', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contract: mockContract }));
      const result = await saveContractDraftApi({ contractNumber: 'CT-2026-001' });
      expect(result).toEqual(mockContract);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/contracts/draft'),
        expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Save failed'));
      await expect(saveContractDraftApi({})).rejects.toThrow('Save failed');
    });
  });

  describe('getLatestContractDraftApi', () => {
    it('returns latest draft', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contract: mockContract }));
      const result = await getLatestContractDraftApi();
      expect(result).toEqual(mockContract);
    });

    it('returns null when no draft exists', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await getLatestContractDraftApi();
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(getLatestContractDraftApi()).rejects.toThrow('Load failed');
    });
  });

  describe('getContractByIdApi', () => {
    it('fetches contract by id', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contract: mockContract }));
      const result = await getContractByIdApi('contract-1');
      expect(result).toEqual(mockContract);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/contracts/contract-1'));
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Not found'));
      await expect(getContractByIdApi('missing')).rejects.toThrow('Not found');
    });
  });

  describe('listFinalizedContractsApi', () => {
    it('returns list of finalized contracts', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contracts: [mockContract] }));
      const result = await listFinalizedContractsApi();
      expect(result).toEqual([mockContract]);
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/contracts/finalized'));
    });

    it('returns empty array when contracts missing', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await listFinalizedContractsApi();
      expect(result).toEqual([]);
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Load failed'));
      await expect(listFinalizedContractsApi()).rejects.toThrow('Load failed');
    });
  });

  describe('finalizeContractApi', () => {
    it('sends POST request with payload to finalize endpoint', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contract: { ...mockContract, status: 'finalized' } }));
      const result = await finalizeContractApi('contract-1', { signedBy: 'Jane' });
      expect(result.status).toBe('finalized');
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/contracts/contract-1/finalize');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ signedBy: 'Jane' });
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Finalize failed'));
      await expect(finalizeContractApi('contract-1', {})).rejects.toThrow('Finalize failed');
    });
  });

  describe('uploadContractApi', () => {
    it('sends a multipart form and returns contract', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { contract: mockContract }));
      const formData = new FormData();
      formData.append('file', new File(['content'], 'contract.pdf', { type: 'application/pdf' }));
      const result = await uploadContractApi(formData);
      expect(result).toEqual(mockContract);
      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/contracts/upload');
      expect(options.method).toBe('POST');
      expect(options.body).toBe(formData);
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Upload failed'));
      await expect(uploadContractApi(new FormData())).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteContractDraftApi', () => {
    it('sends DELETE request and returns true', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await deleteContractDraftApi();
      expect(result).toBe(true);
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/contracts/draft'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Delete failed'));
      await expect(deleteContractDraftApi()).rejects.toThrow('Delete failed');
    });
  });

  describe('checkContractNumberApi', () => {
    it('returns true when contract number is available', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { available: true }));
      const result = await checkContractNumberApi('CT-2026-002');
      expect(result).toBe(true);
      const [url] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/contracts/check-number');
      expect(url).toContain('contractNumber=CT-2026-002');
    });

    it('returns false when contract number is taken', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { available: false }));
      const result = await checkContractNumberApi('CT-2026-001');
      expect(result).toBe(false);
    });

    it('includes excludeId in query params when provided', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { available: true }));
      await checkContractNumberApi('CT-2026-001', 'contract-1');
      const [url] = apiFetch.mock.calls[0];
      expect(url).toContain('excludeId=contract-1');
    });

    it('passes through abort signal', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { available: true }));
      const controller = new AbortController();
      await checkContractNumberApi('CT-2026-001', undefined, controller.signal);
      const [, options] = apiFetch.mock.calls[0];
      expect(options.signal).toBe(controller.signal);
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Check failed'));
      await expect(checkContractNumberApi('CT-2026-001')).rejects.toThrow('Check failed');
    });
  });
});
