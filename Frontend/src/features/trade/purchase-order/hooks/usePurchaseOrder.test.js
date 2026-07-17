import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { usePurchaseOrder } from './usePurchaseOrder';
import { createTestStore } from '../../../../tests/utils';
import {
  saveDraftApi,
  getLatestDraftApi,
  getPurchaseOrderByIdApi,
  generatePdfApi,
  deleteDraftApi,
} from '../services/purchaseOrderApi';

jest.mock('../services/purchaseOrderApi', () => ({
  saveDraftApi: jest.fn(),
  getLatestDraftApi: jest.fn(),
  getPurchaseOrderByIdApi: jest.fn(),
  generatePdfApi: jest.fn(),
  deleteDraftApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockPo = { _id: 'po-1', poNumber: 'PO-001', pdfUrl: 'https://files/po-001.pdf' };

describe('usePurchaseOrder', () => {
  beforeEach(() => {
    saveDraftApi.mockReset();
    getLatestDraftApi.mockReset();
    getPurchaseOrderByIdApi.mockReset();
    generatePdfApi.mockReset();
    deleteDraftApi.mockReset();
    mockNavigate.mockReset();
  });

  it('does not auto-load any draft by default', async () => {
    getLatestDraftApi.mockResolvedValue(mockPo);
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getLatestDraftApi).not.toHaveBeenCalled();
    expect(result.current.draft).toBeNull();
  });

  it('loads the latest draft automatically on mount when autoLoad is explicitly enabled', async () => {
    getLatestDraftApi.mockResolvedValue(mockPo);
    const store = createTestStore({
      tradeOrganization: { organization: null, loading: false, loaded: true, saving: false },
    });
    const { result } = renderHook(() => usePurchaseOrder({ autoLoad: true }), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.draft).toEqual(mockPo);
    expect(result.current.pdfUrl).toBe(mockPo.pdfUrl);
    expect(result.current.error).toBeNull();
  });

  it('sets an error when loading the draft fails (autoLoad enabled)', async () => {
    getLatestDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore({
      tradeOrganization: { organization: null, loading: false, loaded: true, saving: false },
    });
    const { result } = renderHook(() => usePurchaseOrder({ autoLoad: true }), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load draft');
  });

  it('clears the draft from the store on unmount (autoLoad enabled)', async () => {
    getLatestDraftApi.mockResolvedValue(mockPo);
    const store = createTestStore({
      tradeOrganization: { organization: null, loading: false, loaded: true, saving: false },
    });
    const { result, unmount } = renderHook(() => usePurchaseOrder({ autoLoad: true }), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.draft).toEqual(mockPo));

    unmount();

    expect(store.getState().purchaseOrder.draft).toBeNull();
  });

  it('saveDraft saves and returns the purchase order', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    saveDraftApi.mockResolvedValue(mockPo);
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ poNumber: 'PO-001' });
    });

    expect(saved).toEqual(mockPo);
    expect(result.current.draft).toEqual(mockPo);
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft sets an error and rethrows on failure', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    saveDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.saveDraft({})).rejects.toThrow('Validation failed');
    });

    expect(result.current.error).toBe('Validation failed');
    expect(result.current.saving).toBe(false);
  });

  it('saveAndNavigateToReview navigates to the review page with the new id', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    saveDraftApi.mockResolvedValue(mockPo);
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/purchase-order/review?id=po-1');
  });

  it('saveAndNavigateToReview sets an error and rethrows on failure', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    saveDraftApi.mockRejectedValue(new Error('Save failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.saveAndNavigateToReview({})).rejects.toThrow('Save failed');
    });

    expect(result.current.error).toBe('Save failed');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('loadById fetches and stores the requested purchase order', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    getPurchaseOrderByIdApi.mockResolvedValue(mockPo);
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let loaded;
    await act(async () => {
      loaded = await result.current.loadById('po-1');
    });

    expect(getPurchaseOrderByIdApi).toHaveBeenCalledWith('po-1');
    expect(loaded).toEqual(mockPo);
    expect(result.current.draft).toEqual(mockPo);
  });

  it('loadById sets an error and rethrows on failure', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    getPurchaseOrderByIdApi.mockRejectedValue(new Error('Not found'));
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.loadById('missing')).rejects.toThrow('Not found');
    });

    expect(result.current.error).toBe('Not found');
  });

  it('generatePdf returns the purchase order with an updated pdfUrl', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    generatePdfApi.mockResolvedValue(mockPo);
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('po-1');
    });

    expect(generated).toEqual(mockPo);
    expect(result.current.pdfUrl).toBe(mockPo.pdfUrl);
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf sets an error and rethrows on failure', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    generatePdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.generatePdf('po-1')).rejects.toThrow('Generation failed');
    });

    expect(result.current.error).toBe('Generation failed');
  });

  it('deleteDraft clears the stored draft', async () => {
    getLatestDraftApi.mockResolvedValue(mockPo);
    deleteDraftApi.mockResolvedValue(true);
    const store = createTestStore({
      tradeOrganization: { organization: null, loading: false, loaded: true, saving: false },
    });
    const { result } = renderHook(() => usePurchaseOrder({ autoLoad: true }), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.draft).toEqual(mockPo));

    await act(async () => {
      await result.current.deleteDraft();
    });

    expect(result.current.draft).toBeNull();
    expect(result.current.pdfUrl).toBeNull();
  });

  it('deleteDraft sets an error and rethrows on failure', async () => {
    getLatestDraftApi.mockResolvedValue(null);
    deleteDraftApi.mockRejectedValue(new Error('Delete failed'));
    const store = createTestStore();
    const { result } = renderHook(() => usePurchaseOrder(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.deleteDraft()).rejects.toThrow('Delete failed');
    });

    expect(result.current.error).toBe('Delete failed');
  });
});
