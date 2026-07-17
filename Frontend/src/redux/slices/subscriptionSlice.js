import { createSlice } from '@reduxjs/toolkit';


const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    currentPlan: null,
    history:     [],
    loading:     false,

    chat: {
      planType:        'free',
      status:          'none',
      startDate:       null,
      endDate:         null,
      unlimitedAccess: true,
      source:          'free',
    },
    trade: {
      planType:        'none',
      status:          'none',
      startDate:       null,
      endDate:         null,
      unlimitedAccess: false,
    },
    bonusEligibility: {
      sixMonthBonusUsed: false,
      yearlyBonusUsed:   false,
    },
    erpHistory: [],
  },
  reducers: {
    setSubscriptionData(state, { payload }) {
      if (payload.currentPlan !== undefined) state.currentPlan = payload.currentPlan;
      if (payload.history     !== undefined) state.history     = payload.history;
    },

    setSubscriptionLoading(state, { payload }) {
      state.loading = payload;
    },

    setErpSubscriptionState(state, { payload }) {
      if (payload.chat !== undefined) state.chat = payload.chat;
      if (payload.trade !== undefined) state.trade = payload.trade;
      if (payload.bonusEligibility !== undefined) state.bonusEligibility = payload.bonusEligibility;
    },

    setErpHistory(state, { payload }) {
      state.erpHistory = payload;
    },

    clearSubscription(state) {
      state.currentPlan = null;
      state.history     = [];
      state.loading     = false;
      state.chat = {
        planType: 'free', status: 'none', startDate: null, endDate: null,
        unlimitedAccess: true, source: 'free',
      };
      state.trade = {
        planType: 'none', status: 'none', startDate: null, endDate: null,
        unlimitedAccess: false,
      };
      state.bonusEligibility = { sixMonthBonusUsed: false, yearlyBonusUsed: false };
      state.erpHistory = [];
    },
  },
});

export const {
  setSubscriptionData, setSubscriptionLoading, clearSubscription,
  setErpSubscriptionState, setErpHistory,
} = subscriptionSlice.actions;

export const selectCurrentPlan         = (state) => state.subscription.currentPlan;
export const selectSubscriptionHistory = (state) => state.subscription.history;
export const selectSubscriptionLoading = (state) => state.subscription.loading;

export const selectChatSubscription   = (state) => state.subscription.chat;
export const selectTradeSubscription  = (state) => state.subscription.trade;
export const selectBonusEligibility   = (state) => state.subscription.bonusEligibility;
export const selectErpHistory         = (state) => state.subscription.erpHistory;

export default subscriptionSlice.reducer;
