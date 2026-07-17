import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePackingList } from './usePackingList';
import { createTestStore } from '../../../../tests/utils';
import {
  savePackingListDraftApi,
  getLatestPackingListDraftApi,
  getPackingListByIdApi,
  generatePackingListPdfApi,
} from '../services/packingListApi';

jest.mock('../services/packingListApi', () => ({
  savePackingListDraftApi: jest.fn(),
  getLatestPackingListDraftApi: jest.fn(),
  getPackingListByIdApi: jest.fn(),
  generatePackingListPdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockPackingList = { _id: 'pl-1', packingListNumber: 'PL-001' };

describe('usePackingList', () => {
  beforeEach(() => {
    savePackingListDraftApi.mockReset();
    getLatestPackingListDraftApi.mockReset();
    getPackingListByIdApi.mockReset();
    generatePackingListPdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft', async () => {
    getLatestPackingListDraftApi.mockResolvedValue(mockPackingList);
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockPackingList);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestPackingListDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested packing list', async () => {
    getPackingListByIdApi.mockResolvedValue(mockPackingList);
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('pl-1');
    });

    expect(getPackingListByIdApi).toHaveBeenCalledWith('pl-1');
    expect(result.current.draft).toEqual(mockPackingList);
  });

  it('saveDraft saves and returns the packing list, clearing previous errors', async () => {
    savePackingListDraftApi.mockResolvedValue(mockPackingList);
    const store = createTestStore({ packingList: { draft: null, loading: false, saving: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ packingListNumber: 'PL-001' });
    });

    expect(saved).toEqual(mockPackingList);
    expect(result.current.draft).toEqual(mockPackingList);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    savePackingListDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved packing list has an id', async () => {
    savePackingListDraftApi.mockResolvedValue(mockPackingList);
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/packing-list/review?id=pl-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved packing list has no id', async () => {
    savePackingListDraftApi.mockResolvedValue({ packingListNumber: 'PL-002' });
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('generatePdf returns the updated packing list', async () => {
    generatePackingListPdfApi.mockResolvedValue({ ...mockPackingList, pdfUrl: 'https://files/pl-001.pdf' });
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('pl-1', {});
    });

    expect(generated.pdfUrl).toBe('https://files/pl-001.pdf');
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf returns null and sets error on failure', async () => {
    generatePackingListPdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePackingList(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('pl-1', {});
    });

    expect(generated).toBeNull();
    expect(result.current.error).toBe('Generation failed');
  });
});
