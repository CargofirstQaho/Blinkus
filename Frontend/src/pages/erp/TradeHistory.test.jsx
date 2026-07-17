import { screen } from '@testing-library/react';
import TradeHistory from './TradeHistory';
import { renderWithProviders } from '../../tests/utils';
import { fetchErpSubscriptionStatus } from '../../services/erpSubscriptionApi';

jest.mock('../../services/erpSubscriptionApi', () => ({
  fetchErpSubscriptionStatus: jest.fn(),
  fetchErpPlans: jest.fn(),
  fetchErpHistory: jest.fn(),
  fetchPricingPlans: jest.fn(),
  createErpOrder: jest.fn(),
}));

const entitlementState = (overrides = {}) => ({
  chat: true,
  erp: false,
  erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: false },
  featureFlags: { erpPaymentEnabled: false, chatPaymentEnabled: false, chatLimitsEnabled: false },
  loaded: true,
  ...overrides,
});

describe('TradeHistory Page', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('shows the locked feature screen when the trade history module is not entitled', () => {
    renderWithProviders(<TradeHistory />, { preloadedState: { entitlement: entitlementState() } });

    expect(screen.getByText('Trade History is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText(/Review your complete history/)).toBeInTheDocument();
  });

  it('shows the module workspace when the trade history module is entitled', () => {
    renderWithProviders(<TradeHistory />, {
      preloadedState: {
        entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: true } }),
      },
    });

    expect(screen.getByRole('heading', { name: 'Trade History' })).toBeInTheDocument();
    expect(screen.getByText('Trade History workspace is being set up for your account. Check back soon.')).toBeInTheDocument();
  });
});
