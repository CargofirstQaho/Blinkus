import creditNoteReducer, {
  setCnLoading,
  setCnSaving,
  setCnGenerating,
  setCnDraft,
  setCnPdfUrl,
  setCnError,
  resetCnState,
} from './creditNoteSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'cn-1', creditNoteNumber: 'CN-2026-001', items: [] };

describe('creditNoteSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(creditNoteReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setCnLoading / setCnSaving / setCnGenerating', () => {
    it('sets loading flag', () => {
      const state = creditNoteReducer(undefined, setCnLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = creditNoteReducer(undefined, setCnSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = creditNoteReducer(undefined, setCnGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setCnDraft', () => {
    it('sets draft data', () => {
      const state = creditNoteReducer(undefined, setCnDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('clears any existing error', () => {
      const preState = { ...initialState, error: 'Previous error' };
      const state = creditNoteReducer(preState, setCnDraft(mockDraft));
      expect(state.error).toBeNull();
    });
  });

  describe('setCnPdfUrl', () => {
    it('sets pdf url', () => {
      const state = creditNoteReducer(undefined, setCnPdfUrl('https://example.com/cn.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/cn.pdf');
    });
  });

  describe('setCnError', () => {
    it('sets error message', () => {
      const state = creditNoteReducer(undefined, setCnError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('resetCnState', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/cn.pdf',
        error: 'Some error',
      };
      const state = creditNoteReducer(preState, resetCnState());
      expect(state).toEqual(initialState);
    });
  });
});
