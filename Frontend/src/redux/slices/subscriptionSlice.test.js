import subscriptionReducer, {
  setSubscriptionData,
  setSubscriptionLoading,
  clearSubscription,
  selectCurrentPlan,
  selectSubscriptionHistory,
  selectSubscriptionLoading,
} from './subscriptionSlice';

const initialState = {
  currentPlan: null,
  history: [],
  loading: false,
  chat: {
    planType: 'free',
    status: 'none',
    startDate: null,
    endDate: null,
    unlimitedAccess: true,
    source: 'free',
  },
  trade: {
    planType: 'none',
    status: 'none',
    startDate: null,
    endDate: null,
    unlimitedAccess: false,
  },
  bonusEligibility: {
    sixMonthBonusUsed: false,
    yearlyBonusUsed: false,
  },
  erpHistory: [],
};

const mockPlan = { id: 'pro', name: 'Pro Plan', price: 49, currency: 'USD' };
const mockHistory = [
  { id: 'inv-1', date: '2026-05-01', amount: 49 },
  { id: 'inv-2', date: '2026-06-01', amount: 49 },
];

describe('subscriptionSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(subscriptionReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('currentPlan is null by default', () => {
      expect(subscriptionReducer(undefined, { type: '@@INIT' }).currentPlan).toBeNull();
    });

    it('history is empty array by default', () => {
      expect(subscriptionReducer(undefined, { type: '@@INIT' }).history).toEqual([]);
    });

    it('loading is false by default', () => {
      expect(subscriptionReducer(undefined, { type: '@@INIT' }).loading).toBe(false);
    });
  });

  describe('setSubscriptionData', () => {
    it('sets currentPlan when provided', () => {
      const state = subscriptionReducer(undefined, setSubscriptionData({ currentPlan: mockPlan }));
      expect(state.currentPlan).toEqual(mockPlan);
    });

    it('sets history when provided', () => {
      const state = subscriptionReducer(undefined, setSubscriptionData({ history: mockHistory }));
      expect(state.history).toEqual(mockHistory);
    });

    it('sets both currentPlan and history', () => {
      const state = subscriptionReducer(
        undefined,
        setSubscriptionData({ currentPlan: mockPlan, history: mockHistory })
      );
      expect(state.currentPlan).toEqual(mockPlan);
      expect(state.history).toEqual(mockHistory);
    });

    it('does not overwrite currentPlan when not in payload', () => {
      const preState = { ...initialState, currentPlan: mockPlan };
      const state = subscriptionReducer(preState, setSubscriptionData({ history: mockHistory }));
      expect(state.currentPlan).toEqual(mockPlan);
    });
  });

  describe('setSubscriptionLoading', () => {
    it('sets loading to true', () => {
      const state = subscriptionReducer(undefined, setSubscriptionLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const preState = { ...initialState, loading: true };
      const state = subscriptionReducer(preState, setSubscriptionLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('clearSubscription', () => {
    it('resets all fields to initial values', () => {
      const preState = { currentPlan: mockPlan, history: mockHistory, loading: true };
      const state = subscriptionReducer(preState, clearSubscription());
      expect(state.currentPlan).toBeNull();
      expect(state.history).toEqual([]);
      expect(state.loading).toBe(false);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      subscription: {
        currentPlan: mockPlan,
        history: mockHistory,
        loading: true,
      },
    };

    it('selectCurrentPlan returns currentPlan', () => {
      expect(selectCurrentPlan(rootState)).toEqual(mockPlan);
    });

    it('selectSubscriptionHistory returns history array', () => {
      expect(selectSubscriptionHistory(rootState)).toEqual(mockHistory);
    });

    it('selectSubscriptionLoading returns loading state', () => {
      expect(selectSubscriptionLoading(rootState)).toBe(true);
    });
  });
});
