import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft:      null,
  loading:    false,
  saving:     false,
  generating: false,
  pdfUrl:     null,
  error:      null,
};

const debitNoteSlice = createSlice({
  name: 'debitNote',
  initialState,
  reducers: {
    setDnLoading(state, action)    { state.loading    = action.payload; },
    setDnSaving(state, action)     { state.saving     = action.payload; },
    setDnGenerating(state, action) { state.generating = action.payload; },
    setDnDraft(state, action)      { state.draft      = action.payload; state.error = null; },
    setDnPdfUrl(state, action)     { state.pdfUrl     = action.payload; },
    setDnError(state, action)      { state.error      = action.payload; },
    resetDnState()                 { return initialState; },
  },
});

export const {
  setDnLoading,
  setDnSaving,
  setDnGenerating,
  setDnDraft,
  setDnPdfUrl,
  setDnError,
  resetDnState,
} = debitNoteSlice.actions;

export default debitNoteSlice.reducer;
