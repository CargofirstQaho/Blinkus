import { screen } from '@testing-library/react';
import International from './International';
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

describe('International Page', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('shows the locked feature screen when the international module is not entitled', () => {
    renderWithProviders(<International />, { preloadedState: { entitlement: entitlementState() } });

    expect(screen.getByText('International is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText(/Coordinate cross-border trade/)).toBeInTheDocument();
  });

  it('shows the module workspace when the international module is entitled', () => {
    renderWithProviders(<International />, {
      preloadedState: {
        entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: false, international: true, tradeHistory: false } }),
      },
    });

    expect(screen.getByRole('heading', { name: 'International' })).toBeInTheDocument();
    expect(screen.getByText('International workspace is being set up for your account. Check back soon.')).toBeInTheDocument();
  });
});
