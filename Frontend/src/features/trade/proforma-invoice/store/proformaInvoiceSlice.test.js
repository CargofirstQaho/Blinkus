import proformaInvoiceReducer, {
  setPiLoading,
  setPiSaving,
  setPiGenerating,
  setPiDraft,
  setPiPdfUrl,
  setPiError,
  resetPiState,
} from './proformaInvoiceSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'pi-1', invoiceNumber: 'PI-2026-001', items: [] };

describe('proformaInvoiceSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(proformaInvoiceReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setPiLoading / setPiSaving / setPiGenerating', () => {
    it('sets loading flag', () => {
      const state = proformaInvoiceReducer(undefined, setPiLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = proformaInvoiceReducer(undefined, setPiSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = proformaInvoiceReducer(undefined, setPiGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setPiDraft', () => {
    it('sets draft data', () => {
      const state = proformaInvoiceReducer(undefined, setPiDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('clears any existing error', () => {
      const preState = { ...initialState, error: 'Previous error' };
      const state = proformaInvoiceReducer(preState, setPiDraft(mockDraft));
      expect(state.error).toBeNull();
    });
  });

  describe('setPiPdfUrl', () => {
    it('sets pdf url', () => {
      const state = proformaInvoiceReducer(undefined, setPiPdfUrl('https://example.com/pi.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/pi.pdf');
    });
  });

  describe('setPiError', () => {
    it('sets error message', () => {
      const state = proformaInvoiceReducer(undefined, setPiError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('resetPiState', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/pi.pdf',
        error: 'Some error',
      };
      const state = proformaInvoiceReducer(preState, resetPiState());
      expect(state).toEqual(initialState);
    });
  });
});
