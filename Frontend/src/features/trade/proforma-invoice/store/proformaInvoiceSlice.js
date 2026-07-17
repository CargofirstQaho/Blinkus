import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft:      null,
  loading:    false,
  saving:     false,
  generating: false,
  pdfUrl:     null,
  error:      null,
};

const proformaInvoiceSlice = createSlice({
  name: 'proformaInvoice',
  initialState,
  reducers: {
    setPiLoading(state, action)    { state.loading    = action.payload; },
    setPiSaving(state, action)     { state.saving     = action.payload; },
    setPiGenerating(state, action) { state.generating = action.payload; },
    setPiDraft(state, action)      { state.draft      = action.payload; state.error = null; },
    setPiPdfUrl(state, action)     { state.pdfUrl     = action.payload; },
    setPiError(state, action)      { state.error      = action.payload; },
    resetPiState()                 { return initialState; },
  },
});

export const {
  setPiLoading,
  setPiSaving,
  setPiGenerating,
  setPiDraft,
  setPiPdfUrl,
  setPiError,
  resetPiState,
} = proformaInvoiceSlice.actions;

export default proformaInvoiceSlice.reducer;
