import { screen } from '@testing-library/react';
import Domestic from './Domestic';
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

describe('Domestic Page', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('shows the locked feature screen when the domestic module is not entitled', () => {
    renderWithProviders(<Domestic />, { preloadedState: { entitlement: entitlementState() } });

    expect(screen.getByText('Domestic is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText(/Manage domestic trade operations/)).toBeInTheDocument();
  });

  it('shows the module workspace when the domestic module is entitled', () => {
    renderWithProviders(<Domestic />, {
      preloadedState: {
        entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: true, international: false, tradeHistory: false } }),
      },
    });

    expect(screen.getByRole('heading', { name: 'Domestic' })).toBeInTheDocument();
    expect(screen.getByText('Domestic workspace is being set up for your account. Check back soon.')).toBeInTheDocument();
  });
});
