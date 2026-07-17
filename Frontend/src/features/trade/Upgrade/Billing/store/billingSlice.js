import { createSlice } from '@reduxjs/toolkit';

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    billingAddresses:       [],
    selectedBillingAddress: null,
    billingSummary:         null,
    loading:                false,
    summaryLoading:         false,
    error:                  null,
  },
  reducers: {
    setBillingAddresses(state, { payload }) {
      state.billingAddresses = payload;
    },

    addBillingAddress(state, { payload }) {
      state.billingAddresses.unshift(payload);
    },

    updateBillingAddressInList(state, { payload }) {
      const idx = state.billingAddresses.findIndex((a) => a._id === payload._id);
      if (idx !== -1) state.billingAddresses[idx] = payload;
      if (state.selectedBillingAddress?._id === payload._id) {
        state.selectedBillingAddress = payload;
      }
      if (payload.isDefault) {
        state.billingAddresses = state.billingAddresses.map((a) =>
          a._id === payload._id ? a : { ...a, isDefault: false }
        );
      }
    },

    removeBillingAddress(state, { payload: addressId }) {
      state.billingAddresses = state.billingAddresses.filter((a) => a._id !== addressId);
      if (state.selectedBillingAddress?._id === addressId) {
        state.selectedBillingAddress = null;
        state.billingSummary         = null;
      }
    },

    setSelectedBillingAddress(state, { payload }) {
      state.selectedBillingAddress = payload;
      if (!payload) state.billingSummary = null;
    },

    setBillingSummary(state, { payload }) {
      state.billingSummary = payload;
    },

    setBillingLoading(state, { payload }) {
      state.loading = payload;
    },

    setBillingSummaryLoading(state, { payload }) {
      state.summaryLoading = payload;
    },

    setBillingError(state, { payload }) {
      state.error = payload;
    },

    clearBillingError(state) {
      state.error = null;
    },

    clearBillingState(state) {
      state.billingAddresses       = [];
      state.selectedBillingAddress = null;
      state.billingSummary         = null;
      state.loading                = false;
      state.summaryLoading         = false;
      state.error                  = null;
    },
  },
});

export const {
  setBillingAddresses,
  addBillingAddress,
  updateBillingAddressInList,
  removeBillingAddress,
  setSelectedBillingAddress,
  setBillingSummary,
  setBillingLoading,
  setBillingSummaryLoading,
  setBillingError,
  clearBillingError,
  clearBillingState,
} = billingSlice.actions;

export const selectBillingAddresses       = (state) => state.billing.billingAddresses;
export const selectSelectedBillingAddress = (state) => state.billing.selectedBillingAddress;
export const selectBillingSummary         = (state) => state.billing.billingSummary;
export const selectBillingLoading         = (state) => state.billing.loading;
export const selectBillingSummaryLoading  = (state) => state.billing.summaryLoading;
export const selectBillingError           = (state) => state.billing.error;

export default billingSlice.reducer;
