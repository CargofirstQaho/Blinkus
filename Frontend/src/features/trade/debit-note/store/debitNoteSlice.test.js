import debitNoteReducer, {
  setDnLoading,
  setDnSaving,
  setDnGenerating,
  setDnDraft,
  setDnPdfUrl,
  setDnError,
  resetDnState,
} from './debitNoteSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'dn-1', debitNoteNumber: 'DN-2026-001', items: [] };

describe('debitNoteSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(debitNoteReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setDnLoading / setDnSaving / setDnGenerating', () => {
    it('sets loading flag', () => {
      const state = debitNoteReducer(undefined, setDnLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = debitNoteReducer(undefined, setDnSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = debitNoteReducer(undefined, setDnGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setDnDraft', () => {
    it('sets draft data', () => {
      const state = debitNoteReducer(undefined, setDnDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('clears any existing error', () => {
      const preState = { ...initialState, error: 'Previous error' };
      const state = debitNoteReducer(preState, setDnDraft(mockDraft));
      expect(state.error).toBeNull();
    });
  });

  describe('setDnPdfUrl', () => {
    it('sets pdf url', () => {
      const state = debitNoteReducer(undefined, setDnPdfUrl('https://example.com/dn.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/dn.pdf');
    });
  });

  describe('setDnError', () => {
    it('sets error message', () => {
      const state = debitNoteReducer(undefined, setDnError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('resetDnState', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/dn.pdf',
        error: 'Some error',
      };
      const state = debitNoteReducer(preState, resetDnState());
      expect(state).toEqual(initialState);
    });
  });
});
