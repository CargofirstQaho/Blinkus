import commercialInvoiceReducer, {
  setCiLoading,
  setCiSaving,
  setCiGenerating,
  setCiDraft,
  setCiPdfUrl,
  setCiError,
  resetCiState,
} from './commercialInvoiceSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'ci-1', invoiceNumber: 'CI-2026-001', items: [] };

describe('commercialInvoiceSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(commercialInvoiceReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setCiLoading / setCiSaving / setCiGenerating', () => {
    it('sets loading flag', () => {
      const state = commercialInvoiceReducer(undefined, setCiLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = commercialInvoiceReducer(undefined, setCiSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = commercialInvoiceReducer(undefined, setCiGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setCiDraft', () => {
    it('sets draft data', () => {
      const state = commercialInvoiceReducer(undefined, setCiDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('clears any existing error', () => {
      const preState = { ...initialState, error: 'Previous error' };
      const state = commercialInvoiceReducer(preState, setCiDraft(mockDraft));
      expect(state.error).toBeNull();
    });
  });

  describe('setCiPdfUrl', () => {
    it('sets pdf url', () => {
      const state = commercialInvoiceReducer(undefined, setCiPdfUrl('https://example.com/ci.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/ci.pdf');
    });
  });

  describe('setCiError', () => {
    it('sets error message', () => {
      const state = commercialInvoiceReducer(undefined, setCiError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('resetCiState', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/ci.pdf',
        error: 'Some error',
      };
      const state = commercialInvoiceReducer(preState, resetCiState());
      expect(state).toEqual(initialState);
    });
  });
});
