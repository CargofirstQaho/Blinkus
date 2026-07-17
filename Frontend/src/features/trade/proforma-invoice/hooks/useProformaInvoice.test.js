import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useProformaInvoice } from './useProformaInvoice';
import { createTestStore } from '../../../../tests/utils';
import {
  saveProformaInvoiceDraftApi,
  getLatestProformaInvoiceDraftApi,
  getProformaInvoiceByIdApi,
  generateProformaInvoicePdfApi,
} from '../services/proformaInvoiceApi';

jest.mock('../services/proformaInvoiceApi', () => ({
  saveProformaInvoiceDraftApi: jest.fn(),
  getLatestProformaInvoiceDraftApi: jest.fn(),
  getProformaInvoiceByIdApi: jest.fn(),
  generateProformaInvoicePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockProformaInvoice = { _id: 'pi-1', invoiceNumber: 'PI-001' };

describe('useProformaInvoice', () => {
  beforeEach(() => {
    saveProformaInvoiceDraftApi.mockReset();
    getLatestProformaInvoiceDraftApi.mockReset();
    getProformaInvoiceByIdApi.mockReset();
    generateProformaInvoicePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft', async () => {
    getLatestProformaInvoiceDraftApi.mockResolvedValue(mockProformaInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockProformaInvoice);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestProformaInvoiceDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested proforma invoice', async () => {
    getProformaInvoiceByIdApi.mockResolvedValue(mockProformaInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('pi-1');
    });

    expect(getProformaInvoiceByIdApi).toHaveBeenCalledWith('pi-1');
    expect(result.current.draft).toEqual(mockProformaInvoice);
  });

  it('saveDraft saves and returns the proforma invoice, clearing previous errors', async () => {
    saveProformaInvoiceDraftApi.mockResolvedValue(mockProformaInvoice);
    const store = createTestStore({ proformaInvoice: { draft: null, loading: false, saving: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ invoiceNumber: 'PI-001' });
    });

    expect(saved).toEqual(mockProformaInvoice);
    expect(result.current.draft).toEqual(mockProformaInvoice);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    saveProformaInvoiceDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved proforma invoice has an id', async () => {
    saveProformaInvoiceDraftApi.mockResolvedValue(mockProformaInvoice);
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/international/proforma-invoice/review?id=pi-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved proforma invoice has no id', async () => {
    saveProformaInvoiceDraftApi.mockResolvedValue({ invoiceNumber: 'PI-002' });
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('generatePdf returns the updated proforma invoice', async () => {
    generateProformaInvoicePdfApi.mockResolvedValue({ ...mockProformaInvoice, pdfUrl: 'https://files/pi-001.pdf' });
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('pi-1', {});
    });

    expect(generated.pdfUrl).toBe('https://files/pi-001.pdf');
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf returns null and sets error on failure', async () => {
    generateProformaInvoicePdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useProformaInvoice(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('pi-1', {});
    });

    expect(generated).toBeNull();
    expect(result.current.error).toBe('Generation failed');
  });
});
