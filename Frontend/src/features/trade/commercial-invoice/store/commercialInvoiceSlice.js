import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft:      null,
  loading:    false,
  saving:     false,
  generating: false,
  pdfUrl:     null,
  error:      null,
};

const commercialInvoiceSlice = createSlice({
  name: 'commercialInvoice',
  initialState,
  reducers: {
    setCiLoading(state, action)    { state.loading    = action.payload; },
    setCiSaving(state, action)     { state.saving     = action.payload; },
    setCiGenerating(state, action) { state.generating = action.payload; },
    setCiDraft(state, action)      { state.draft      = action.payload; state.error = null; },
    setCiPdfUrl(state, action)     { state.pdfUrl     = action.payload; },
    setCiError(state, action)      { state.error      = action.payload; },
    resetCiState()                 { return initialState; },
  },
});

export const {
  setCiLoading,
  setCiSaving,
  setCiGenerating,
  setCiDraft,
  setCiPdfUrl,
  setCiError,
  resetCiState,
} = commercialInvoiceSlice.actions;

export default commercialInvoiceSlice.reducer;
