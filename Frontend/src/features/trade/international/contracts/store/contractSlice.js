import { createSlice } from '@reduxjs/toolkit';

const contractSlice = createSlice({
  name: 'contract',
  initialState: {
    draft:      null,
    contracts:  [],
    loading:    false,
    saving:     false,
    uploading:  false,
    generating: false,
    pdfUrl:     null,
    error:      null,
  },
  reducers: {
    setContractDraft(state, { payload }) {
      state.draft  = payload;
      state.pdfUrl = payload?.pdfUrl ?? null;
    },
    setContractList(state, { payload }) {
      state.contracts = payload;
    },
    setContractLoading(state, { payload }) {
      state.loading = payload;
    },
    setContractSaving(state, { payload }) {
      state.saving = payload;
    },
    setContractUploading(state, { payload }) {
      state.uploading = payload;
    },
    setContractGenerating(state, { payload }) {
      state.generating = payload;
    },
    setContractError(state, { payload }) {
      state.error = payload;
    },
    setContractPdfUrl(state, { payload }) {
      state.pdfUrl = payload;
    },
    resetContractState(state) {
      state.draft      = null;
      state.loading    = false;
      state.saving     = false;
      state.uploading  = false;
      state.generating = false;
      state.pdfUrl     = null;
      state.error      = null;
    },
  },
});

export const {
  setContractDraft,
  setContractList,
  setContractLoading,
  setContractSaving,
  setContractUploading,
  setContractGenerating,
  setContractError,
  setContractPdfUrl,
  resetContractState,
} = contractSlice.actions;

export const selectContractDraft      = (s) => s.contract.draft;
export const selectContractList       = (s) => s.contract.contracts;
export const selectContractLoading    = (s) => s.contract.loading;
export const selectContractSaving     = (s) => s.contract.saving;
export const selectContractUploading  = (s) => s.contract.uploading;
export const selectContractGenerating = (s) => s.contract.generating;
export const selectContractPdfUrl     = (s) => s.contract.pdfUrl;
export const selectContractError      = (s) => s.contract.error;

export default contractSlice.reducer;
