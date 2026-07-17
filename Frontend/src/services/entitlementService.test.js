import {
  canAccessChat,
  canAccessERP,
  canAccessTradeHistory,
  canAccessInternational,
  canAccessDomestic,
  canAccessAddOrganization,
} from './entitlementService';

const activeTrade = {
  status: 'active',
  unlimitedAccess: true,
  endDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
};

const expiredTrade = {
  status: 'active',
  unlimitedAccess: true,
  endDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
};

const inactiveTrade = {
  status: 'inactive',
  unlimitedAccess: false,
  endDate: null,
};

describe('entitlementService', () => {
  describe('canAccessChat', () => {
    it('returns true when chat is free (default env)', () => {
      expect(canAccessChat({})).toBe(true);
    });

    it('returns true for an undefined subscription object', () => {
      expect(canAccessChat()).toBe(true);
    });

    it('returns true even with no trade/chat data when chat payment disabled', () => {
      expect(canAccessChat({ chat: null, trade: null })).toBe(true);
    });
  });

  describe('canAccessERP', () => {
    it('returns true by default when erp payment is disabled (free mode)', () => {
      expect(canAccessERP({ trade: inactiveTrade })).toBe(true);
    });

    it('returns true with an active trade subscription', () => {
      expect(canAccessERP({ trade: activeTrade })).toBe(true);
    });

    it('returns true even with an expired trade subscription in free mode', () => {
      expect(canAccessERP({ trade: expiredTrade })).toBe(true);
    });

    it('returns true with no subscription object at all', () => {
      expect(canAccessERP()).toBe(true);
    });
  });

  describe('module-level entitlement helpers', () => {
    const subscription = { trade: activeTrade };

    it('canAccessTradeHistory mirrors canAccessERP', () => {
      expect(canAccessTradeHistory(subscription)).toBe(canAccessERP(subscription));
    });

    it('canAccessInternational mirrors canAccessERP', () => {
      expect(canAccessInternational(subscription)).toBe(canAccessERP(subscription));
    });

    it('canAccessDomestic mirrors canAccessERP', () => {
      expect(canAccessDomestic(subscription)).toBe(canAccessERP(subscription));
    });

    it('canAccessAddOrganization mirrors canAccessERP', () => {
      expect(canAccessAddOrganization(subscription)).toBe(canAccessERP(subscription));
    });
  });
});
