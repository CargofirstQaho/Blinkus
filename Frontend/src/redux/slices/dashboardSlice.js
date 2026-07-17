import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats:   null,
    loading: false,
  },
  reducers: {
    setStats(state, { payload }) {
      state.stats = payload;
    },
    setDashboardLoading(state, { payload }) {
      state.loading = payload;
    },
    clearDashboard(state) {
      state.stats   = null;
      state.loading = false;
    },
  },
});

export const { setStats, setDashboardLoading, clearDashboard } = dashboardSlice.actions;

export const selectStats             = (state) => state.dashboard.stats;
export const selectDashboardLoading  = (state) => state.dashboard.loading;

export default dashboardSlice.reducer;
