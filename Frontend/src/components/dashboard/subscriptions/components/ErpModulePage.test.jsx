import { screen } from '@testing-library/react';
import { Home } from 'lucide-react';
import ErpModulePage from './ErpModulePage';
import { renderWithProviders } from '../../../../tests/utils';
import { fetchErpSubscriptionStatus } from '../../../../services/erpSubscriptionApi';

jest.mock('../../../../services/erpSubscriptionApi', () => ({
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

describe('ErpModulePage', () => {
  beforeEach(() => {
    fetchErpSubscriptionStatus.mockReset();
  });

  it('shows a spinner while entitlements are loading', () => {
    fetchErpSubscriptionStatus.mockReturnValue(new Promise(() => {}));

    const { container } = renderWithProviders(
      <ErpModulePage moduleKey="domestic" moduleName="Domestic" description="Domestic module" icon={Home} />,
      { preloadedState: { entitlement: entitlementState({ loaded: false }) } }
    );

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.queryByText('Domestic')).not.toBeInTheDocument();
  });

  it('shows the locked feature screen when the module is not entitled', () => {
    renderWithProviders(
      <ErpModulePage moduleKey="domestic" moduleName="Domestic" description="Domestic module" icon={Home} />,
      { preloadedState: { entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: false } }) } }
    );

    expect(screen.getByText('Domestic is a Trade subscriber feature')).toBeInTheDocument();
    expect(screen.getByText('Domestic module')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view subscription plans/i })).toBeInTheDocument();
  });

  it('renders children when the module is entitled', () => {
    renderWithProviders(
      <ErpModulePage moduleKey="domestic" moduleName="Domestic" description="Domestic module" icon={Home}>
        <div>Domestic Module Content</div>
      </ErpModulePage>,
      { preloadedState: { entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: true, international: false, tradeHistory: false } }) } }
    );

    expect(screen.getByRole('heading', { name: 'Domestic' })).toBeInTheDocument();
    expect(screen.getByText('Domestic module')).toBeInTheDocument();
    expect(screen.getByText('Domestic Module Content')).toBeInTheDocument();
  });

  it('renders a default fallback message when entitled with no children', () => {
    renderWithProviders(
      <ErpModulePage moduleKey="tradeHistory" moduleName="Trade History" description="History module" icon={Home} />,
      { preloadedState: { entitlement: entitlementState({ erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: true } }) } }
    );

    expect(screen.getByRole('heading', { name: 'Trade History' })).toBeInTheDocument();
    expect(screen.getByText('Trade History workspace is being set up for your account. Check back soon.')).toBeInTheDocument();
  });
});
