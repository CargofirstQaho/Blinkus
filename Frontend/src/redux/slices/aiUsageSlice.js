import { createSlice } from '@reduxjs/toolkit';

const aiUsageSlice = createSlice({
  name: 'aiUsage',
  initialState: {
    limitReached: false,
    message:      null,
    attemptId:    0,
  },
  reducers: {
    setAiUsageLimitReached(state, { payload }) {
      state.limitReached = true;
      state.message      = payload || null;
      state.attemptId    += 1;
    },
    clearAiUsageLimit(state) {
      if (!state.limitReached && !state.message) return;
      state.limitReached = false;
      state.message      = null;
    },
  },
});

export const { setAiUsageLimitReached, clearAiUsageLimit } = aiUsageSlice.actions;

export const selectAiUsageLimitReached = (state) => state.aiUsage.limitReached;
export const selectAiUsageLimitMessage = (state) => state.aiUsage.message;
export const selectAiUsageAttemptId    = (state) => state.aiUsage.attemptId;

export default aiUsageSlice.reducer;
