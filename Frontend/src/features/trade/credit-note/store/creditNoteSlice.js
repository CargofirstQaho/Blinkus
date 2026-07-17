import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft:      null,
  loading:    false,
  saving:     false,
  generating: false,
  pdfUrl:     null,
  error:      null,
};

const creditNoteSlice = createSlice({
  name: 'creditNote',
  initialState,
  reducers: {
    setCnLoading(state, action)    { state.loading    = action.payload; },
    setCnSaving(state, action)     { state.saving     = action.payload; },
    setCnGenerating(state, action) { state.generating = action.payload; },
    setCnDraft(state, action)      { state.draft      = action.payload; state.error = null; },
    setCnPdfUrl(state, action)     { state.pdfUrl     = action.payload; },
    setCnError(state, action)      { state.error      = action.payload; },
    resetCnState()                 { return initialState; },
  },
});

export const {
  setCnLoading,
  setCnSaving,
  setCnGenerating,
  setCnDraft,
  setCnPdfUrl,
  setCnError,
  resetCnState,
} = creditNoteSlice.actions;

export default creditNoteSlice.reducer;
