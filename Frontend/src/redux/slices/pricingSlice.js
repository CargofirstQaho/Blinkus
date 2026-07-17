import { createSlice } from '@reduxjs/toolkit';

const pricingSlice = createSlice({
  name: 'pricing',
  initialState: {
    trade:   null,
    chat:    null,
    loading: false,
    loaded:  false,
  },
  reducers: {
    setPricingData(state, { payload }) {
      if (payload.trade !== undefined) state.trade = payload.trade;
      if (payload.chat  !== undefined) state.chat  = payload.chat;
      state.loaded = true;
    },

    setPricingLoading(state, { payload }) {
      state.loading = payload;
    },

    clearPricing(state) {
      state.trade   = null;
      state.chat    = null;
      state.loading = false;
      state.loaded  = false;
    },
  },
});

export const { setPricingData, setPricingLoading, clearPricing } = pricingSlice.actions;

export const selectTradePricing  = (state) => state.pricing.trade;
export const selectChatPricing   = (state) => state.pricing.chat;
export const selectPricingLoading = (state) => state.pricing.loading;
export const selectPricingLoaded  = (state) => state.pricing.loaded;

export default pricingSlice.reducer;
