import contractReducer, {
  setContractDraft,
  setContractList,
  setContractLoading,
  setContractSaving,
  setContractUploading,
  setContractGenerating,
  setContractError,
  setContractPdfUrl,
  resetContractState,
  selectContractDraft,
  selectContractList,
  selectContractLoading,
  selectContractSaving,
  selectContractUploading,
  selectContractGenerating,
  selectContractPdfUrl,
  selectContractError,
} from './contractSlice';

const initialState = {
  draft: null,
  contracts: [],
  loading: false,
  saving: false,
  uploading: false,
  generating: false,
  pdfUrl: null,
  error: null,
};

const mockDraft = { _id: 'contract-1', contractNumber: 'CT-2026-001' };
const mockContracts = [
  { _id: 'contract-1', contractNumber: 'CT-2026-001' },
  { _id: 'contract-2', contractNumber: 'CT-2026-002' },
];

describe('contractSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(contractReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setContractDraft', () => {
    it('sets draft data', () => {
      const state = contractReducer(undefined, setContractDraft(mockDraft));
      expect(state.draft).toEqual(mockDraft);
    });

    it('sets pdfUrl from draft when present', () => {
      const draftWithPdf = { ...mockDraft, pdfUrl: 'https://example.com/contract.pdf' };
      const state = contractReducer(undefined, setContractDraft(draftWithPdf));
      expect(state.pdfUrl).toBe('https://example.com/contract.pdf');
    });

    it('sets pdfUrl to null when draft has no pdfUrl', () => {
      const state = contractReducer(undefined, setContractDraft(mockDraft));
      expect(state.pdfUrl).toBeNull();
    });
  });

  describe('setContractList', () => {
    it('sets contracts list', () => {
      const state = contractReducer(undefined, setContractList(mockContracts));
      expect(state.contracts).toEqual(mockContracts);
    });
  });

  describe('flag setters', () => {
    it('sets loading flag', () => {
      expect(contractReducer(undefined, setContractLoading(true)).loading).toBe(true);
    });

    it('sets saving flag', () => {
      expect(contractReducer(undefined, setContractSaving(true)).saving).toBe(true);
    });

    it('sets uploading flag', () => {
      expect(contractReducer(undefined, setContractUploading(true)).uploading).toBe(true);
    });

    it('sets generating flag', () => {
      expect(contractReducer(undefined, setContractGenerating(true)).generating).toBe(true);
    });
  });

  describe('setContractError', () => {
    it('sets error message', () => {
      const state = contractReducer(undefined, setContractError('Failed to save'));
      expect(state.error).toBe('Failed to save');
    });
  });

  describe('setContractPdfUrl', () => {
    it('sets pdf url directly', () => {
      const state = contractReducer(undefined, setContractPdfUrl('https://example.com/contract.pdf'));
      expect(state.pdfUrl).toBe('https://example.com/contract.pdf');
    });
  });

  describe('resetContractState', () => {
    it('resets draft, flags, pdfUrl and error but keeps contracts list', () => {
      const preState = {
        draft: mockDraft,
        contracts: mockContracts,
        loading: true,
        saving: true,
        uploading: true,
        generating: true,
        pdfUrl: 'https://example.com/contract.pdf',
        error: 'Some error',
      };
      const state = contractReducer(preState, resetContractState());
      expect(state.draft).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.saving).toBe(false);
      expect(state.uploading).toBe(false);
      expect(state.generating).toBe(false);
      expect(state.pdfUrl).toBeNull();
      expect(state.error).toBeNull();
      expect(state.contracts).toEqual(mockContracts);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      contract: {
        draft: mockDraft,
        contracts: mockContracts,
        loading: true,
        saving: true,
        uploading: true,
        generating: true,
        pdfUrl: 'https://example.com/contract.pdf',
        error: 'Some error',
      },
    };

    it('selectContractDraft returns draft', () => {
      expect(selectContractDraft(rootState)).toEqual(mockDraft);
    });

    it('selectContractList returns contracts', () => {
      expect(selectContractList(rootState)).toEqual(mockContracts);
    });

    it('selectContractLoading returns loading state', () => {
      expect(selectContractLoading(rootState)).toBe(true);
    });

    it('selectContractSaving returns saving state', () => {
      expect(selectContractSaving(rootState)).toBe(true);
    });

    it('selectContractUploading returns uploading state', () => {
      expect(selectContractUploading(rootState)).toBe(true);
    });

    it('selectContractGenerating returns generating state', () => {
      expect(selectContractGenerating(rootState)).toBe(true);
    });

    it('selectContractPdfUrl returns pdf url', () => {
      expect(selectContractPdfUrl(rootState)).toBe('https://example.com/contract.pdf');
    });

    it('selectContractError returns error', () => {
      expect(selectContractError(rootState)).toBe('Some error');
    });
  });
});
