import authReducer, {
  setUser,
  clearUser,
  setAuthLoading,
  setInitialized,
  setUsage,
  incrementAiUsage,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthInitialized,
  selectPlan,
  selectIsPremium,
  selectPermissions,
  selectSubscriptionEndsAt,
  selectUsage,
} from './authSlice';

const initialState = {
  user: null,
  isAuthenticated: false,
  authLoading: false,
  initialized: false,
  plan: 'free',
  isPremium: false,
  permissions: [],
  subscriptionEndsAt: null,
  usage: { aiQuestionsToday: 0, aiQuestionsLimit: 20, periodLabel: null, resetsAt: null },
};

const mockUser = {
  _id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  plan: 'pro',
  isPremium: true,
  permissions: ['read', 'write'],
  subscriptionEndsAt: '2026-12-31',
};

describe('authSlice', () => {
  describe('Initial state', () => {
    it('returns the correct initial state', () => {
      expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('user is null by default', () => {
      const state = authReducer(undefined, { type: '@@INIT' });
      expect(state.user).toBeNull();
    });

    it('isAuthenticated is false by default', () => {
      const state = authReducer(undefined, { type: '@@INIT' });
      expect(state.isAuthenticated).toBe(false);
    });

    it('plan defaults to free', () => {
      const state = authReducer(undefined, { type: '@@INIT' });
      expect(state.plan).toBe('free');
    });
  });

  describe('setUser', () => {
    it('sets user, marks authenticated', () => {
      const state = authReducer(undefined, setUser({ user: mockUser }));
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('sets plan from user payload', () => {
      const state = authReducer(undefined, setUser({ user: mockUser }));
      expect(state.plan).toBe('pro');
    });

    it('sets isPremium from user payload', () => {
      const state = authReducer(undefined, setUser({ user: mockUser }));
      expect(state.isPremium).toBe(true);
    });

    it('sets permissions from user payload', () => {
      const state = authReducer(undefined, setUser({ user: mockUser }));
      expect(state.permissions).toEqual(['read', 'write']);
    });

    it('sets subscriptionEndsAt from user payload', () => {
      const state = authReducer(undefined, setUser({ user: mockUser }));
      expect(state.subscriptionEndsAt).toBe('2026-12-31');
    });

    it('sets usage when provided', () => {
      const usage = { aiQuestionsToday: 5, aiQuestionsLimit: 20 };
      const state = authReducer(undefined, setUser({ user: mockUser, usage }));
      expect(state.usage).toEqual(usage);
    });

    it('falls back to free plan when user has no plan', () => {
      const userWithoutPlan = { ...mockUser, plan: undefined };
      const state = authReducer(undefined, setUser({ user: userWithoutPlan }));
      expect(state.plan).toBe('free');
    });
  });

  describe('clearUser', () => {
    it('resets all auth state back to initial', () => {
      const loggedIn = authReducer(undefined, setUser({ user: mockUser }));
      const cleared = authReducer(loggedIn, clearUser());
      expect(cleared.user).toBeNull();
      expect(cleared.isAuthenticated).toBe(false);
      expect(cleared.plan).toBe('free');
      expect(cleared.isPremium).toBe(false);
      expect(cleared.permissions).toEqual([]);
    });
  });

  describe('setAuthLoading', () => {
    it('sets authLoading to true', () => {
      const state = authReducer(undefined, setAuthLoading(true));
      expect(state.authLoading).toBe(true);
    });

    it('sets authLoading to false', () => {
      const state = authReducer({ ...initialState, authLoading: true }, setAuthLoading(false));
      expect(state.authLoading).toBe(false);
    });
  });

  describe('setInitialized', () => {
    it('sets initialized to true', () => {
      const state = authReducer(undefined, setInitialized());
      expect(state.initialized).toBe(true);
    });
  });

  describe('setUsage', () => {
    it('updates usage state', () => {
      const usage = { aiQuestionsToday: 10, aiQuestionsLimit: 20 };
      const state = authReducer(undefined, setUsage(usage));
      expect(state.usage).toEqual(usage);
    });
  });

  describe('incrementAiUsage', () => {
    it('increments aiQuestionsToday by 1', () => {
      const state = authReducer(undefined, incrementAiUsage());
      expect(state.usage.aiQuestionsToday).toBe(1);
    });

    it('increments from existing count', () => {
      const preState = { ...initialState, usage: { aiQuestionsToday: 5, aiQuestionsLimit: 20 } };
      const state = authReducer(preState, incrementAiUsage());
      expect(state.usage.aiQuestionsToday).toBe(6);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      auth: {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
        initialized: true,
        plan: 'pro',
        isPremium: true,
        permissions: ['read'],
        subscriptionEndsAt: '2026-12-31',
        usage: { aiQuestionsToday: 3, aiQuestionsLimit: 20 },
      },
    };

    it('selectUser returns user', () => {
      expect(selectUser(rootState)).toEqual(mockUser);
    });

    it('selectIsAuthenticated returns true', () => {
      expect(selectIsAuthenticated(rootState)).toBe(true);
    });

    it('selectAuthLoading returns false', () => {
      expect(selectAuthLoading(rootState)).toBe(false);
    });

    it('selectAuthInitialized returns true', () => {
      expect(selectAuthInitialized(rootState)).toBe(true);
    });

    it('selectPlan returns plan', () => {
      expect(selectPlan(rootState)).toBe('pro');
    });

    it('selectIsPremium returns true', () => {
      expect(selectIsPremium(rootState)).toBe(true);
    });

    it('selectPermissions returns permissions array', () => {
      expect(selectPermissions(rootState)).toEqual(['read']);
    });

    it('selectSubscriptionEndsAt returns date', () => {
      expect(selectSubscriptionEndsAt(rootState)).toBe('2026-12-31');
    });

    it('selectUsage returns usage object', () => {
      expect(selectUsage(rootState)).toEqual({ aiQuestionsToday: 3, aiQuestionsLimit: 20 });
    });
  });
});
