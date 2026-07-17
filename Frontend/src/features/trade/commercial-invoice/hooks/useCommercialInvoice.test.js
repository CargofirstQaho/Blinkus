import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useCommercialInvoice } from './useCommercialInvoice';
import { createTestStore } from '../../../../tests/utils';
import {
  saveCommercialInvoiceDraftApi,
  getLatestCommercialInvoiceDraftApi,
  getCommercialInvoiceByIdApi,
  generateCommercialInvoicePdfApi,
} from '../services/commercialInvoiceApi';

jest.mock('../services/commercialInvoiceApi', () => ({
  saveCommercialInvoiceDraftApi: jest.fn(),
  getLatestCommercialInvoiceDraftApi: jest.fn(),
  getCommercialInvoiceByIdApi: jest.fn(),
  generateCommercialInvoicePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockCommercialInvoice = { _id: 'ci-1', invoiceNumber: 'CI-001' };

describe('useCommercialInvoice', () => {
  beforeEach(() => {
    saveCommercialInvoiceDraftApi.mockReset();
    getLatestCommercialInvoiceDraftApi.mockReset();
    getCommercialInvoiceByIdApi.mockReset();
    generateCommercialInvoicePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft', async () => {
    getLatestCommercialInvoiceDraftApi.mockResolvedValue(mockCommercialInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockCommercialInvoice);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestCommercialInvoiceDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested commercial invoice', async () => {
    getCommercialInvoiceByIdApi.mockResolvedValue(mockCommercialInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('ci-1');
    });

    expect(getCommercialInvoiceByIdApi).toHaveBeenCalledWith('ci-1');
    expect(result.current.draft).toEqual(mockCommercialInvoice);
  });

  it('saveDraft saves and returns the commercial invoice, clearing previous errors', async () => {
    saveCommercialInvoiceDraftApi.mockResolvedValue(mockCommercialInvoice);
    const store = createTestStore({ commercialInvoice: { draft: null, loading: false, saving: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ invoiceNumber: 'CI-001' });
    });

    expect(saved).toEqual(mockCommercialInvoice);
    expect(result.current.draft).toEqual(mockCommercialInvoice);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    saveCommercialInvoiceDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved commercial invoice has an id', async () => {
    saveCommercialInvoiceDraftApi.mockResolvedValue(mockCommercialInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/commercial-invoice/review?id=ci-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved commercial invoice has no id', async () => {
    saveCommercialInvoiceDraftApi.mockResolvedValue({ invoiceNumber: 'CI-002' });
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('generatePdf returns the updated commercial invoice', async () => {
    generateCommercialInvoicePdfApi.mockResolvedValue({ ...mockCommercialInvoice, pdfUrl: 'https://files/ci-001.pdf' });
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('ci-1', {});
    });

    expect(generated.pdfUrl).toBe('https://files/ci-001.pdf');
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf returns null and sets error on failure', async () => {
    generateCommercialInvoicePdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useCommercialInvoice(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('ci-1', {});
    });

    expect(generated).toBeNull();
    expect(result.current.error).toBe('Generation failed');
  });
});
