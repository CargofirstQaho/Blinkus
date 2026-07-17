import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useContract } from './useContract';
import { createTestStore } from '../../../../../tests/utils';
import {
  saveContractDraftApi,
  getLatestContractDraftApi,
  getContractByIdApi,
  listFinalizedContractsApi,
  finalizeContractApi,
  uploadContractApi,
  deleteContractDraftApi,
} from '../services/contractApi';

jest.mock('../services/contractApi', () => ({
  saveContractDraftApi: jest.fn(),
  getLatestContractDraftApi: jest.fn(),
  getContractByIdApi: jest.fn(),
  listFinalizedContractsApi: jest.fn(),
  finalizeContractApi: jest.fn(),
  uploadContractApi: jest.fn(),
  deleteContractDraftApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockContract = { _id: 'contract-1', contractNumber: 'CN-001', pdfUrl: 'https://files/cn-001.pdf' };

describe('useContract', () => {
  beforeEach(() => {
    saveContractDraftApi.mockReset();
    getLatestContractDraftApi.mockReset();
    getContractByIdApi.mockReset();
    listFinalizedContractsApi.mockReset();
    finalizeContractApi.mockReset();
    uploadContractApi.mockReset();
    deleteContractDraftApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft and derived pdfUrl', async () => {
    getLatestContractDraftApi.mockResolvedValue(mockContract);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockContract);
    expect(result.current.pdfUrl).toBe(mockContract.pdfUrl);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestContractDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested contract', async () => {
    getContractByIdApi.mockResolvedValue(mockContract);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('contract-1');
    });

    expect(getContractByIdApi).toHaveBeenCalledWith('contract-1');
    expect(result.current.draft).toEqual(mockContract);
  });

  it('loadFinalized stores the contract list', async () => {
    listFinalizedContractsApi.mockResolvedValue([mockContract]);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadFinalized();
    });

    expect(result.current.contracts).toEqual([mockContract]);
  });

  it('saveDraft saves and returns the contract, clearing previous errors', async () => {
    saveContractDraftApi.mockResolvedValue(mockContract);
    const store = createTestStore({ contract: { draft: null, contracts: [], loading: false, saving: false, uploading: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ contractNumber: 'CN-001' });
    });

    expect(saved).toEqual(mockContract);
    expect(result.current.draft).toEqual(mockContract);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    saveContractDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved contract has an id', async () => {
    saveContractDraftApi.mockResolvedValue(mockContract);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview('contract-1', {});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/contract-drafting/review?id=contract-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved contract has no id', async () => {
    saveContractDraftApi.mockResolvedValue({ contractNumber: 'CN-002' });
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview(null, {});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('finalizeContract returns the finalized contract', async () => {
    finalizeContractApi.mockResolvedValue(mockContract);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let finalized;
    await act(async () => {
      finalized = await result.current.finalizeContract('contract-1', {});
    });

    expect(finalized).toEqual(mockContract);
    expect(result.current.generating).toBe(false);
  });

  it('finalizeContract returns null and sets error on failure', async () => {
    finalizeContractApi.mockRejectedValue(new Error('Finalize failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let finalized;
    await act(async () => {
      finalized = await result.current.finalizeContract('contract-1', {});
    });

    expect(finalized).toBeNull();
    expect(result.current.error).toBe('Finalize failed');
  });

  it('uploadContract returns the uploaded contract', async () => {
    uploadContractApi.mockResolvedValue(mockContract);
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let uploaded;
    await act(async () => {
      uploaded = await result.current.uploadContract(new FormData());
    });

    expect(uploaded).toEqual(mockContract);
    expect(result.current.uploading).toBe(false);
  });

  it('uploadContract returns null and sets error on failure', async () => {
    uploadContractApi.mockRejectedValue(new Error('Upload failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    let uploaded;
    await act(async () => {
      uploaded = await result.current.uploadContract(new FormData());
    });

    expect(uploaded).toBeNull();
    expect(result.current.error).toBe('Upload failed');
  });

  it('deleteDraft clears the stored draft', async () => {
    deleteContractDraftApi.mockResolvedValue(true);
    const store = createTestStore({ contract: { draft: mockContract, contracts: [], loading: false, saving: false, uploading: false, generating: false, pdfUrl: mockContract.pdfUrl, error: null } });
    const { result } = renderHook(() => useContract(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.deleteDraft();
    });

    expect(result.current.draft).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
