import { screen } from '@testing-library/react';
import AddOrganization from './AddOrganization';
import { renderWithProviders } from '../../tests/utils';
import { fetchErpSubscriptionStatus } from '../../services/erpSubscriptionApi';

jest.mock('../../services/erpSubscriptionApi', () => ({
  fetchErpSubscriptionStatus: jest.fn(),
  fetchErpPlans: jest.fn(),
  fetchErpHistory: jest.fn(),
  fetchPricingPlans: jest.fn(),
  createErpOrder: jest.fn(),
}));

jest.mock('../../features/trade/organization/pages/AddOrganizationPage', () => function AddOrganizationPageMock() {
  return <div>Add Organization Page Content</div>;
});

const entitlementState = (overrides = {}) => ({
  chat: true,
  erp: false,
  erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: false },
  featureFlags: { erpPaymentEnabled: false, chatPaymentEnabled: false, chatLimitsEnabled: false },
  loaded: true,
  ...overrides,
});

describe('AddOrganization Page', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('shows the locked feature screen when the add organization module is not entitled', () => {
    renderWithProviders(<AddOrganization />, { preloadedState: { entitlement: entitlementState() } });

    expect(screen.getByText('Add Organization is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText(/Register and manage your trade organizations/)).toBeInTheDocument();
    expect(screen.queryByText('Add Organization Page Content')).not.toBeInTheDocument();
  });

  it('renders the AddOrganizationPage when the module is entitled', () => {
    renderWithProviders(<AddOrganization />, {
      preloadedState: {
        entitlement: entitlementState({ erpModules: { addOrganization: true, domestic: false, international: false, tradeHistory: false } }),
      },
    });

    expect(screen.getByRole('heading', { name: 'Add Organization' })).toBeInTheDocument();
    expect(screen.getByText('Add Organization Page Content')).toBeInTheDocument();
  });
});
