import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useCreditNote } from './useCreditNote';
import { createTestStore } from '../../../../tests/utils';
import {
  saveCreditNoteDraftApi,
  getLatestCreditNoteDraftApi,
  getCreditNoteByIdApi,
  generateCreditNotePdfApi,
} from '../services/creditNoteApi';

jest.mock('../services/creditNoteApi', () => ({
  saveCreditNoteDraftApi: jest.fn(),
  getLatestCreditNoteDraftApi: jest.fn(),
  getCreditNoteByIdApi: jest.fn(),
  generateCreditNotePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockCreditNote = { _id: 'cn-1', creditNoteNumber: 'CN-001' };

describe('useCreditNote', () => {
  beforeEach(() => {
    saveCreditNoteDraftApi.mockReset();
    getLatestCreditNoteDraftApi.mockReset();
    getCreditNoteByIdApi.mockReset();
    generateCreditNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft', async () => {
    getLatestCreditNoteDraftApi.mockResolvedValue(mockCreditNote);
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockCreditNote);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestCreditNoteDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested credit note', async () => {
    getCreditNoteByIdApi.mockResolvedValue(mockCreditNote);
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('cn-1');
    });

    expect(getCreditNoteByIdApi).toHaveBeenCalledWith('cn-1');
    expect(result.current.draft).toEqual(mockCreditNote);
  });

  it('saveDraft saves and returns the credit note, clearing previous errors', async () => {
    saveCreditNoteDraftApi.mockResolvedValue(mockCreditNote);
    const store = createTestStore({ creditNote: { draft: null, loading: false, saving: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ creditNoteNumber: 'CN-001' });
    });

    expect(saved).toEqual(mockCreditNote);
    expect(result.current.draft).toEqual(mockCreditNote);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    saveCreditNoteDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved credit note has an id', async () => {
    saveCreditNoteDraftApi.mockResolvedValue(mockCreditNote);
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/credit-note/review?id=cn-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved credit note has no id', async () => {
    saveCreditNoteDraftApi.mockResolvedValue({ creditNoteNumber: 'CN-002' });
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('generatePdf returns the updated credit note', async () => {
    generateCreditNotePdfApi.mockResolvedValue({ ...mockCreditNote, pdfUrl: 'https://files/cn-001.pdf' });
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('cn-1', {});
    });

    expect(generated.pdfUrl).toBe('https://files/cn-001.pdf');
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf returns null and sets error on failure', async () => {
    generateCreditNotePdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useCreditNote(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('cn-1', {});
    });

    expect(generated).toBeNull();
    expect(result.current.error).toBe('Generation failed');
  });
});
