import purchaseOrderReducer, {
  setPoDraft,
  setPoLoading,
  setPoSaving,
  setPoGenerating,
  setPoError,
  setPoPdfUrl,
  clearPoDraft,
  selectPoDraft,
  selectPoLoading,
  selectPoSaving,
  selectPoGenerating,
  selectPoPdfUrl,
  selectPoError,
} from './purchaseOrderSlice';

const initialState = {
  draft: null,
  loading: false,
  saving: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'po-1', poNumber: 'PO-2026-001', items: [] };

describe('purchaseOrderSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(purchaseOrderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setPoDraft', () => {
    it('sets draft data', () => {
      const state = purchaseOrderReducer(undefined, setPoDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('sets pdfUrl from draft when present', () => {
      const draftWithPdf = { ...mockDraft, pdfUrl: 'https://example.com/po.pdf' };
      const state = purchaseOrderReducer(undefined, setPoDraft(draftWithPdf));
      expect(state.pdfUrl).toBe('https://example.com/po.pdf');
    });

    it('sets pdfUrl to null when draft has no pdfUrl', () => {
      const state = purchaseOrderReducer(undefined, setPoDraft(mockDraft));
      expect(state.pdfUrl).toBeNull();
    });
  });

  describe('setPoLoading / setPoSaving / setPoGenerating', () => {
    it('sets loading flag', () => {
      const state = purchaseOrderReducer(undefined, setPoLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets saving flag', () => {
      const state = purchaseOrderReducer(undefined, setPoSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets generating flag', () => {
      const state = purchaseOrderReducer(undefined, setPoGenerating(true));
      expect(state.generating).toBe(true);
    });
  });

  describe('setPoError', () => {
    it('sets error message', () => {
      const state = purchaseOrderReducer(undefined, setPoError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });

    it('clears error when set to null', () => {
      const preState = { ...initialState, error: 'Some error' };
      const state = purchaseOrderReducer(preState, setPoError(null));
      expect(state.error).toBeNull();
    });
  });

  describe('setPoPdfUrl', () => {
    it('sets pdf url directly', () => {
      const state = purchaseOrderReducer(undefined, setPoPdfUrl('https://example.com/po.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/po.pdf');
    });
  });

  describe('clearPoDraft', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/po.pdf',
        error: 'Some error',
      };
      const state = purchaseOrderReducer(preState, clearPoDraft());
      expect(state).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      purchaseOrder: {
        draft: mockDraft,
        loading: true,
        saving: true,
        generating: true,
        pdfUrl: 'https://example.com/po.pdf',
        error: 'Some error',
      },
    };

    it('selectPoDraft returns draft', () => {
      expect(selectPoDraft(rootState)).toEqual(mockDraft);
    });

    it('selectPoLoading returns loading state', () => {
      expect(selectPoLoading(rootState)).toBe(true);
    });

    it('selectPoSaving returns saving state', () => {
      expect(selectPoSaving(rootState)).toBe(true);
    });

    it('selectPoGenerating returns generating state', () => {
      expect(selectPoGenerating(rootState)).toBe(true);
    });

    it('selectPoPdfUrl returns pdf url', () => {
      expect(selectPoPdfUrl(rootState)).toBe('https://example.com/po.pdf');
    });

    it('selectPoError returns error', () => {
      expect(selectPoError(rootState)).toBe('Some error');
    });
  });
});
