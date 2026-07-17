import pricingReducer, {
  setPricingData,
  setPricingLoading,
  clearPricing,
  selectTradePricing,
  selectChatPricing,
  selectPricingLoading,
  selectPricingLoaded,
} from './pricingSlice';

const initialState = {
  trade: null,
  chat: null,
  loading: false,
  loaded: false,
};

const mockTradePricing = { planType: 'pro', price: 99, currency: 'USD' };
const mockChatPricing = { planType: 'plus', price: 19, currency: 'USD' };

describe('pricingSlice', () => {
  describe('Initial state', () => {
    it('returns correct initial state', () => {
      expect(pricingReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
    });
  });

  describe('setPricingData', () => {
    it('sets trade pricing when provided', () => {
      const state = pricingReducer(undefined, setPricingData({ trade: mockTradePricing }));
      expect(state.trade).toEqual(mockTradePricing);
    });

    it('sets chat pricing when provided', () => {
      const state = pricingReducer(undefined, setPricingData({ chat: mockChatPricing }));
      expect(state.chat).toEqual(mockChatPricing);
    });

    it('sets both trade and chat pricing', () => {
      const state = pricingReducer(
        undefined,
        setPricingData({ trade: mockTradePricing, chat: mockChatPricing })
      );
      expect(state.trade).toEqual(mockTradePricing);
      expect(state.chat).toEqual(mockChatPricing);
    });

    it('marks loaded as true', () => {
      const state = pricingReducer(undefined, setPricingData({}));
      expect(state.loaded).toBe(true);
    });

    it('does not overwrite trade when not in payload', () => {
      const preState = { ...initialState, trade: mockTradePricing };
      const state = pricingReducer(preState, setPricingData({ chat: mockChatPricing }));
      expect(state.trade).toEqual(mockTradePricing);
      expect(state.chat).toEqual(mockChatPricing);
    });
  });

  describe('setPricingLoading', () => {
    it('sets loading to true', () => {
      const state = pricingReducer(undefined, setPricingLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const preState = { ...initialState, loading: true };
      const state = pricingReducer(preState, setPricingLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('clearPricing', () => {
    it('resets all fields to initial values', () => {
      const preState = {
        trade: mockTradePricing,
        chat: mockChatPricing,
        loading: true,
        loaded: true,
      };
      const state = pricingReducer(preState, clearPricing());
      expect(state).toEqual(initialState);
    });
  });

  describe('Selectors', () => {
    const rootState = {
      pricing: {
        trade: mockTradePricing,
        chat: mockChatPricing,
        loading: true,
        loaded: true,
      },
    };

    it('selectTradePricing returns trade pricing', () => {
      expect(selectTradePricing(rootState)).toEqual(mockTradePricing);
    });

    it('selectChatPricing returns chat pricing', () => {
      expect(selectChatPricing(rootState)).toEqual(mockChatPricing);
    });

    it('selectPricingLoading returns loading state', () => {
      expect(selectPricingLoading(rootState)).toBe(true);
    });

    it('selectPricingLoaded returns loaded state', () => {
      expect(selectPricingLoaded(rootState)).toBe(true);
    });
  });
});
