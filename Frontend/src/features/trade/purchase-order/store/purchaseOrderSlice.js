import { createSlice } from '@reduxjs/toolkit';

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState: {
    draft:      null,
    loading:    false,
    saving:     false,
    generating: false,
    pdfUrl:     null,
    error:      null,
  },
  reducers: {
    setPoDraft(state, { payload }) {
      state.draft  = payload;
      state.pdfUrl = payload?.pdfUrl ?? null;
    },
    setPoLoading(state, { payload }) {
      state.loading = payload;
    },
    setPoSaving(state, { payload }) {
      state.saving = payload;
    },
    setPoGenerating(state, { payload }) {
      state.generating = payload;
    },
    setPoError(state, { payload }) {
      state.error = payload;
    },
    setPoPdfUrl(state, { payload }) {
      state.pdfUrl = payload;
    },
    clearPoDraft(state) {
      state.draft      = null;
      state.loading    = false;
      state.saving     = false;
      state.generating = false;
      state.pdfUrl     = null;
      state.error      = null;
    },
  },
});

export const {
  setPoDraft,
  setPoLoading,
  setPoSaving,
  setPoGenerating,
  setPoError,
  setPoPdfUrl,
  clearPoDraft,
} = purchaseOrderSlice.actions;

export const selectPoDraft      = (state) => state.purchaseOrder.draft;
export const selectPoLoading    = (state) => state.purchaseOrder.loading;
export const selectPoSaving     = (state) => state.purchaseOrder.saving;
export const selectPoGenerating = (state) => state.purchaseOrder.generating;
export const selectPoPdfUrl     = (state) => state.purchaseOrder.pdfUrl;
export const selectPoError      = (state) => state.purchaseOrder.error;

export default purchaseOrderSlice.reducer;
