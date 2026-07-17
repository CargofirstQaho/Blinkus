import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft:      null,
  loading:    false,
  saving:     false,
  generating: false,
  pdfUrl:     null,
  error:      null,
};

const packingListSlice = createSlice({
  name: 'packingList',
  initialState,
  reducers: {
    setPlLoading(state, action)    { state.loading    = action.payload; },
    setPlSaving(state, action)     { state.saving     = action.payload; },
    setPlGenerating(state, action) { state.generating = action.payload; },
    setPlDraft(state, action)      { state.draft      = action.payload; state.error = null; },
    setPlPdfUrl(state, action)     { state.pdfUrl     = action.payload; },
    setPlError(state, action)      { state.error      = action.payload; },
    resetPlState()                 { return initialState; },
  },
});

export const {
  setPlLoading,
  setPlSaving,
  setPlGenerating,
  setPlDraft,
  setPlPdfUrl,
  setPlError,
  resetPlState,
} = packingListSlice.actions;

export default packingListSlice.reducer;
