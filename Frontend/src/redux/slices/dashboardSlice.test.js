import dashboardReducer, {
  setStats,
  setDashboardLoading,
  clearDashboard,
  selectStats,
  selectDashboardLoading,
} from './dashboardSlice';

const initialState = {
  stats: null,
  loading: false,
};

const mockStats = {
  totalTrades: 42,
  activeSessions: 3,
  lastUpdated: '2026-06-05',
};

describe('dashboardSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(dashboardReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });

    it('stats is null by default', () => {
      expect(dashboardReducer(undefined, { type: '@@INIT' }).stats).toBeNull();
    });

    it('loading is false by default', () => {
      expect(dashboardReducer(undefined, { type: '@@INIT' }).loading).toBe(false);
    });
  });

  describe('setStats', () => {
    it('sets stats data', () => {
      const state = dashboardReducer(undefined, setStats(mockStats));
      expect(state.stats).toEqual(mockStats);
    });

    it('overwrites existing stats', () => {
      const preState = { stats: { old: true }, loading: false };
      const state = dashboardReducer(preState, setStats(mockStats));
      expect(state.stats).toEqual(mockStats);
    });
  });

  describe('setDashboardLoading', () => {
    it('sets loading to true', () => {
      const state = dashboardReducer(undefined, setDashboardLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const preState = { stats: null, loading: true };
      const state = dashboardReducer(preState, setDashboardLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('clearDashboard', () => {
    it('resets stats and loading to initial values', () => {
      const preState = { stats: mockStats, loading: true };
      const state = dashboardReducer(preState, clearDashboard());
      expect(state.stats).toBeNull();
      expect(state.loading).toBe(false);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      dashboard: {
        stats: mockStats,
        loading: true,
      },
    };

    it('selectStats returns stats', () => {
      expect(selectStats(rootState)).toEqual(mockStats);
    });

    it('selectDashboardLoading returns loading state', () => {
      expect(selectDashboardLoading(rootState)).toBe(true);
    });

    it('selectStats returns null when no stats', () => {
      expect(selectStats({ dashboard: { stats: null, loading: false } })).toBeNull();
    });
  });
});
