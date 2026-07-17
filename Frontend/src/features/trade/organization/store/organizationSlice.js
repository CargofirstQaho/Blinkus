import { createSlice } from '@reduxjs/toolkit';

const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    organization: null,
    loading: false,
    loaded: false,
    saving: false,
    error: null,
  },
  reducers: {
    setOrganization(state, { payload }) {
      state.organization = payload;
      state.loaded = true;
      state.loading = false;
      state.error = null;
    },
    setOrganizationLoading(state, { payload }) {
      state.loading = payload;
    },
    setOrganizationSaving(state, { payload }) {
      state.saving = payload;
    },
    // Settles the loading cycle on any fetch failure — sets loaded=true so
    // the auto-fetch effect does not re-trigger after an error.
    setOrganizationError(state, { payload }) {
      state.error = payload;
      state.loading = false;
      state.loaded = true;
    },
    clearOrganization(state) {
      state.organization = null;
      state.loading = false;
      state.loaded = false;
      state.saving = false;
      state.error = null;
    },
  },
});

export const {
  setOrganization,
  setOrganizationLoading,
  setOrganizationSaving,
  setOrganizationError,
  clearOrganization,
} = organizationSlice.actions;

export const selectOrganization = (state) => state.tradeOrganization.organization;
export const selectOrganizationLoading = (state) => state.tradeOrganization.loading;
export const selectOrganizationLoaded = (state) => state.tradeOrganization.loaded;
export const selectOrganizationSaving = (state) => state.tradeOrganization.saving;
export const selectOrganizationError = (state) => state.tradeOrganization.error;

export default organizationSlice.reducer;
