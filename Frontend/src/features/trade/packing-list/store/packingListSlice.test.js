import packingListReducer, {
  setPlLoading,
  setPlSaving,
  setPlGenerating,
  setPlDraft,
  setPlPdfUrl,
  setPlError,
  resetPlState,
} from './packingListSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'pl-1', packingListNumber: 'PL-2026-001', items: [] };

describe('packingListSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(packingListReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setPlLoading / setPlSaving / setPlGenerating', () => {
    it('sets loading flag', () => {
      const state = packingListReducer(undefined, setPlLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = packingListReducer(undefined, setPlSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = packingListReducer(undefined, setPlGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setPlDraft', () => {
    it('sets draft data', () => {
      const state = packingListReducer(undefined, setPlDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('clears any existing error', () => {
      const preState = { ...initialState, error: 'Previous error' };
      const state = packingListReducer(preState, setPlDraft(mockDraft));
      expect(state.error).toBeNull();
    });
  });

  describe('setPlPdfUrl', () => {
    it('sets pdf url', () => {
      const state = packingListReducer(undefined, setPlPdfUrl('https://example.com/pl.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/pl.pdf');
    });
  });

  describe('setPlError', () => {
    it('sets error message', () => {
      const state = packingListReducer(undefined, setPlError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('resetPlState', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/pl.pdf',
        error: 'Some error',
      };
      const state = packingListReducer(preState, resetPlState());
      expect(state).toEqual(initialState);
    });
  });
});
