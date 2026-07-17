import organizationReducer, {
  setOrganization,
  setOrganizationLoading,
  setOrganizationSaving,
  clearOrganization,
  selectOrganization,
  selectOrganizationLoading,
  selectOrganizationLoaded,
  selectOrganizationSaving,
} from './organizationSlice';

const initialState = {
  organization: null,
  loading: false,
  loaded: false,
  saving: false,
  error: null,
};

const mockOrganization = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co',
  organizationEmail: 'contact@acme.com',
  location: 'Mumbai, India',
};

describe('organizationSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(organizationReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setOrganization', () => {
    it('sets organization data', () => {
      const state = organizationReducer(undefined, setOrganization(mockOrganization));
      expect(state.organization).toEqual(mockOrganization);
    });

    it('marks loaded as true', () => {
      const state = organizationReducer(undefined, setOrganization(mockOrganization));
      expect(state.loaded).toBe(true);
    });

    it('can set organization to null', () => {
      const preState = { ...initialState, organization: mockOrganization, loaded: true };
      const state = organizationReducer(preState, setOrganization(null));
      expect(state.organization).toBeNull();
      expect(state.loaded).toBe(true);
    });
  });

  describe('setOrganizationLoading', () => {
    it('sets loading to true', () => {
      const state = organizationReducer(undefined, setOrganizationLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const preState = { ...initialState, loading: true };
      const state = organizationReducer(preState, setOrganizationLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setOrganizationSaving', () => {
    it('sets saving to true', () => {
      const state = organizationReducer(undefined, setOrganizationSaving(true));
      expect(state.saving).toBe(true);
    });

    it('sets saving to false', () => {
      const preState = { ...initialState, saving: true };
      const state = organizationReducer(preState, setOrganizationSaving(false));
      expect(state.saving).toBe(false);
    });
  });

  describe('clearOrganization', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        organization: mockOrganization,
        loading: true,
        loaded: true,
        saving: true,
      };
      const state = organizationReducer(preState, clearOrganization());
      expect(state).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      tradeOrganization: {
        organization: mockOrganization,
        loading: true,
        loaded: true,
        saving: true,
      },
    };

    it('selectOrganization returns organization', () => {
      expect(selectOrganization(rootState)).toEqual(mockOrganization);
    });

    it('selectOrganizationLoading returns loading state', () => {
      expect(selectOrganizationLoading(rootState)).toBe(true);
    });

    it('selectOrganizationLoaded returns loaded state', () => {
      expect(selectOrganizationLoaded(rootState)).toBe(true);
    });

    it('selectOrganizationSaving returns saving state', () => {
      expect(selectOrganizationSaving(rootState)).toBe(true);
    });
  });
});
