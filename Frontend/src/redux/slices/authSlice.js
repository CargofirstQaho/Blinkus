import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,
    isAuthenticated: false,
    authLoading:     false,
    initialized:     false,

    plan:               'free',
    isPremium:          false,
    permissions:        [],
    subscriptionEndsAt: null,
    usage: {
      aiQuestionsToday: 0,
      aiQuestionsLimit: 20,
      periodLabel:      null,
      resetsAt:         null,
    },
  },
  reducers: {
    setUser(state, { payload }) {
      state.user            = payload.user;
      state.isAuthenticated = true;

      if (payload.user) {
        state.plan               = payload.user.plan               ?? 'free';
        state.isPremium          = payload.user.isPremium          ?? false;
        state.permissions        = payload.user.permissions        ?? [];
        state.subscriptionEndsAt = payload.user.subscriptionEndsAt ?? null;
      }

      if (payload.usage) {
        state.usage = payload.usage;
      }
    },

    clearUser(state) {
      state.user               = null;
      state.isAuthenticated    = false;
      state.plan               = 'free';
      state.isPremium          = false;
      state.permissions        = [];
      state.subscriptionEndsAt = null;
      state.usage              = { aiQuestionsToday: 0, aiQuestionsLimit: 20, periodLabel: null, resetsAt: null };
    },

    setAuthLoading(state, { payload }) {
      state.authLoading = payload;
    },

    setInitialized(state) {
      state.initialized = true;
    },

    setUsage(state, { payload }) {
      state.usage = payload;
    },

    incrementAiUsage(state) {
      state.usage = {
        ...state.usage,
        aiQuestionsToday: (state.usage.aiQuestionsToday ?? 0) + 1,
      };
    },
  },
});

export const {
  setUser, clearUser, setAuthLoading, setInitialized,
  setUsage, incrementAiUsage,
} = authSlice.actions;

export const selectUser               = (state) => state.auth.user;
export const selectIsAuthenticated    = (state) => state.auth.isAuthenticated;
export const selectAuthLoading        = (state) => state.auth.authLoading;
export const selectAuthInitialized    = (state) => state.auth.initialized;
export const selectPlan               = (state) => state.auth.plan;
export const selectIsPremium          = (state) => state.auth.isPremium;
export const selectPermissions        = (state) => state.auth.permissions;
export const selectSubscriptionEndsAt = (state) => state.auth.subscriptionEndsAt;
export const selectUsage              = (state) => state.auth.usage;
export const selectTermsAcceptance    = (state) => state.auth.user?.termsAcceptance ?? null;
export const selectTermsAccepted      = (state) => state.auth.user?.termsAcceptance?.accepted ?? false;

export default authSlice.reducer;
