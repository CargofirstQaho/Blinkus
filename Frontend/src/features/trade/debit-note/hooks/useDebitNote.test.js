import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useDebitNote } from './useDebitNote';
import { createTestStore } from '../../../../tests/utils';
import {
  saveDebitNoteDraftApi,
  getLatestDebitNoteDraftApi,
  getDebitNoteByIdApi,
  generateDebitNotePdfApi,
} from '../services/debitNoteApi';

jest.mock('../services/debitNoteApi', () => ({
  saveDebitNoteDraftApi: jest.fn(),
  getLatestDebitNoteDraftApi: jest.fn(),
  getDebitNoteByIdApi: jest.fn(),
  generateDebitNotePdfApi: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockDebitNote = { _id: 'dn-1', debitNoteNumber: 'DN-001' };

describe('useDebitNote', () => {
  beforeEach(() => {
    saveDebitNoteDraftApi.mockReset();
    getLatestDebitNoteDraftApi.mockReset();
    getDebitNoteByIdApi.mockReset();
    generateDebitNotePdfApi.mockReset();
    mockNavigate.mockReset();
  });

  it('loadDraft stores the fetched draft', async () => {
    getLatestDebitNoteDraftApi.mockResolvedValue(mockDebitNote);
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.draft).toEqual(mockDebitNote);
    expect(result.current.loading).toBe(false);
  });

  it('loadDraft sets an error message on failure', async () => {
    getLatestDebitNoteDraftApi.mockRejectedValue(new Error('Failed to load draft'));
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadDraft();
    });

    expect(result.current.error).toBe('Failed to load draft');
    expect(result.current.loading).toBe(false);
  });

  it('loadById stores the requested debit note', async () => {
    getDebitNoteByIdApi.mockResolvedValue(mockDebitNote);
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.loadById('dn-1');
    });

    expect(getDebitNoteByIdApi).toHaveBeenCalledWith('dn-1');
    expect(result.current.draft).toEqual(mockDebitNote);
  });

  it('saveDraft saves and returns the debit note, clearing previous errors', async () => {
    saveDebitNoteDraftApi.mockResolvedValue(mockDebitNote);
    const store = createTestStore({ debitNote: { draft: null, loading: false, saving: false, generating: false, pdfUrl: null, error: 'old error' } });
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({ debitNoteNumber: 'DN-001' });
    });

    expect(saved).toEqual(mockDebitNote);
    expect(result.current.draft).toEqual(mockDebitNote);
    expect(result.current.error).toBeNull();
    expect(result.current.saving).toBe(false);
  });

  it('saveDraft returns null and sets error on failure', async () => {
    saveDebitNoteDraftApi.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    let saved;
    await act(async () => {
      saved = await result.current.saveDraft({});
    });

    expect(saved).toBeNull();
    expect(result.current.error).toBe('Validation failed');
  });

  it('saveAndNavigateToReview navigates when the saved debit note has an id', async () => {
    saveDebitNoteDraftApi.mockResolvedValue(mockDebitNote);
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).toHaveBeenCalledWith('/trade/domestic/debit-note/review?id=dn-1');
  });

  it('saveAndNavigateToReview does not navigate when the saved debit note has no id', async () => {
    saveDebitNoteDraftApi.mockResolvedValue({ debitNoteNumber: 'DN-002' });
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    await act(async () => {
      await result.current.saveAndNavigateToReview({});
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('generatePdf returns the updated debit note', async () => {
    generateDebitNotePdfApi.mockResolvedValue({ ...mockDebitNote, pdfUrl: 'https://files/dn-001.pdf' });
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('dn-1', {});
    });

    expect(generated.pdfUrl).toBe('https://files/dn-001.pdf');
    expect(result.current.generating).toBe(false);
  });

  it('generatePdf returns null and sets error on failure', async () => {
    generateDebitNotePdfApi.mockRejectedValue(new Error('Generation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useDebitNote(), { wrapper: wrapperFor(store) });

    let generated;
    await act(async () => {
      generated = await result.current.generatePdf('dn-1', {});
    });

    expect(generated).toBeNull();
    expect(result.current.error).toBe('Generation failed');
  });
});
