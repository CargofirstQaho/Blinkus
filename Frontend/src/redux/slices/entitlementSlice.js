import { createSlice } from '@reduxjs/toolkit';

const entitlementSlice = createSlice({
  name: 'entitlement',
  initialState: {
    chat: true,
    erp:  false,
    erpModules: {
      addOrganization: false,
      domestic:        false,
      international:   false,
      tradeHistory:    false,
    },
    featureFlags: {
      erpPaymentEnabled:  false,
      chatPaymentEnabled: false,
      chatLimitsEnabled:  false,
    },
    loaded: false,
  },
  reducers: {
    setEntitlements(state, { payload }) {
      if (payload.chat !== undefined) state.chat = payload.chat;
      if (payload.erp  !== undefined) state.erp  = payload.erp;
      if (payload.erpModules !== undefined) state.erpModules = { ...state.erpModules, ...payload.erpModules };
      if (payload.featureFlags !== undefined) state.featureFlags = { ...state.featureFlags, ...payload.featureFlags };
      state.loaded = true;
    },

    clearEntitlements(state) {
      state.chat = true;
      state.erp  = false;
      state.erpModules = {
        addOrganization: false,
        domestic:        false,
        international:   false,
        tradeHistory:    false,
      };
      state.featureFlags = {
        erpPaymentEnabled:  false,
        chatPaymentEnabled: false,
        chatLimitsEnabled:  false,
      };
      state.loaded = false;
    },
  },
});

export const { setEntitlements, clearEntitlements } = entitlementSlice.actions;

export const selectCanAccessChat = (state) => state.entitlement.chat;
export const selectCanAccessErp  = (state) => state.entitlement.erp;
export const selectErpModuleEntitlements = (state) => state.entitlement.erpModules;
export const selectFeatureFlags = (state) => state.entitlement.featureFlags;
export const selectEntitlementsLoaded = (state) => state.entitlement.loaded;

export default entitlementSlice.reducer;
