import entitlementReducer, {
  setEntitlements,
  clearEntitlements,
  selectCanAccessChat,
  selectCanAccessErp,
  selectErpModuleEntitlements,
  selectFeatureFlags,
  selectEntitlementsLoaded,
} from './entitlementSlice';

const initialState = {
  chat: true,
  erp: false,
  erpModules: {
    addOrganization: false,
    domestic: false,
    international: false,
    tradeHistory: false,
  },
  featureFlags: {
    erpPaymentEnabled: false,
    chatPaymentEnabled: false,
    chatLimitsEnabled: false,
  },
  loaded: false,
};

describe('entitlementSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(entitlementReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setEntitlements', () => {
    it('sets chat entitlement when provided', () => {
      const state = entitlementReducer(undefined, setEntitlements({ chat: false }));
      expect(state.chat).toBe(false);
    });

    it('sets erp entitlement when provided', () => {
      const state = entitlementReducer(undefined, setEntitlements({ erp: true }));
      expect(state.erp).toBe(true);
    });

    it('merges erpModules without overwriting other module flags', () => {
      const state = entitlementReducer(undefined, setEntitlements({
        erpModules: { domestic: true },
      }));
      expect(state.erpModules).toEqual({
        addOrganization: false,
        domestic: true,
        international: false,
        tradeHistory: false,
      });
    });

    it('merges featureFlags without overwriting other flags', () => {
      const state = entitlementReducer(undefined, setEntitlements({
        featureFlags: { erpPaymentEnabled: true },
      }));
      expect(state.featureFlags).toEqual({
        erpPaymentEnabled: true,
        chatPaymentEnabled: false,
        chatLimitsEnabled: false,
      });
    });

    it('marks loaded as true', () => {
      const state = entitlementReducer(undefined, setEntitlements({}));
      expect(state.loaded).toBe(true);
    });

    it('does not change chat when not in payload', () => {
      const preState = { ...initialState, chat: false };
      const state = entitlementReducer(preState, setEntitlements({ erp: true }));
      expect(state.chat).toBe(false);
      expect(state.erp).toBe(true);
    });
  });

  describe('clearEntitlements', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        chat: false,
        erp: true,
        erpModules: {
          addOrganization: true,
          domestic: true,
          international: true,
          tradeHistory: true,
        },
        featureFlags: {
          erpPaymentEnabled: true,
          chatPaymentEnabled: true,
          chatLimitsEnabled: true,
        },
        loaded: true,
      };
      const state = entitlementReducer(preState, clearEntitlements());
      expect(state).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      entitlement: {
        chat: false,
        erp: true,
        erpModules: {
          addOrganization: true,
          domestic: false,
          international: true,
          tradeHistory: false,
        },
        featureFlags: {
          erpPaymentEnabled: true,
          chatPaymentEnabled: false,
          chatLimitsEnabled: true,
        },
        loaded: true,
      },
    };

    it('selectCanAccessChat returns chat entitlement', () => {
      expect(selectCanAccessChat(rootState)).toBe(false);
    });

    it('selectCanAccessErp returns erp entitlement', () => {
      expect(selectCanAccessErp(rootState)).toBe(true);
    });

    it('selectErpModuleEntitlements returns erpModules object', () => {
      expect(selectErpModuleEntitlements(rootState)).toEqual(rootState.entitlement.erpModules);
    });

    it('selectFeatureFlags returns featureFlags object', () => {
      expect(selectFeatureFlags(rootState)).toEqual(rootState.entitlement.featureFlags);
    });

    it('selectEntitlementsLoaded returns loaded state', () => {
      expect(selectEntitlementsLoaded(rootState)).toBe(true);
    });
  });
});
