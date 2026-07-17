import { screen } from '@testing-library/react';
import BillingSection from './BillingSection';
import { renderWithProviders, authenticatedState } from '../../../../tests/utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useCurrentSubscription', () => ({
  useCurrentSubscription: jest.fn(),
}));
jest.mock('../hooks/usePaymentHistory', () => ({
  usePaymentHistory: jest.fn(),
}));
jest.mock('@/src/features/trade/Upgrade/Billing/hooks/useBillingAddresses.js', () => ({
  useBillingAddresses: jest.fn(),
}));

import { useCurrentSubscription } from '../hooks/useCurrentSubscription';
import { usePaymentHistory } from '../hooks/usePaymentHistory';
import { useBillingAddresses } from '@/src/features/trade/Upgrade/Billing/hooks/useBillingAddresses.js';

const freeState = {
  ...authenticatedState,
  subscription: {
    currentPlan: null,
    history: [],
    loading: false,
    chat: { planType: 'free', status: 'none', startDate: null, endDate: null, unlimitedAccess: true, source: 'free' },
    trade: { planType: 'none', status: 'none', startDate: null, endDate: null, unlimitedAccess: false },
    bonusEligibility: { sixMonthBonusUsed: false, yearlyBonusUsed: false },
    erpHistory: [],
  },
};

const premiumState = {
  ...authenticatedState,
  subscription: {
    ...freeState.subscription,
    trade: {
      planType: 'yearly',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      unlimitedAccess: true,
    },
  },
};

const mockPayment = {
  _id: 'pay-1',
  paymentDate: '2026-01-15T10:00:00.000Z',
  planName: 'yearly',
  totalAmount: 8999,
  currency: 'INR',
  status: 'CAPTURED',
  paymentMethod: 'card',
  razorpayOrderId: 'order_abc123',
  razorpayPaymentId: 'pay_xyz789',
  refundStatus: null,
};

const mockAddress = {
  _id: 'addr-1',
  fullName: 'Jane Doe',
  companyName: 'Acme Corp',
  email: 'jane@acme.com',
  phone: '+919876543210',
  addressLine1: '1 MG Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400001',
  country: 'India',
  isDefault: true,
};

function setupDefaultMocks() {
  useCurrentSubscription.mockReturnValue({ subscription: null, loading: false, loaded: true, load: jest.fn() });
  usePaymentHistory.mockReturnValue({ payments: [], total: 0, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn() });
  useBillingAddresses.mockReturnValue({ addresses: [], loading: false, loadAddresses: jest.fn() });
}

describe('BillingSection', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    setupDefaultMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the Billing section title', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Billing')).toBeInTheDocument();
    });

    it('renders Current Plan card', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Current Plan')).toBeInTheDocument();
    });

    it('renders Last Payment card', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Last Payment')).toBeInTheDocument();
    });

    it('renders Billing Addresses card', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Billing Addresses')).toBeInTheDocument();
    });

    it('renders Billing History card', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Billing History')).toBeInTheDocument();
    });
  });

  describe('Current Plan — always Active status', () => {
    it('shows Active badge for free plan users', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows Active badge for premium plan users', () => {
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows "Free Plan" label for non-subscribers', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('Free Plan')).toBeInTheDocument();
    });

    it('shows "Yearly Plan" label for yearly subscribers', () => {
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('Yearly Plan')).toBeInTheDocument();
    });

    it('shows "Subscription Source: Direct Payment" for active subscribers', () => {
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('Direct Payment')).toBeInTheDocument();
    });

    it('does not show "Subscription Source" for free plan users', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.queryByText('Subscription Source')).not.toBeInTheDocument();
    });

    it('renders an Upgrade button for free plan users', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
    });

    it('does not render an Upgrade button for premium plan users', () => {
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.queryByRole('button', { name: /upgrade/i })).not.toBeInTheDocument();
    });
  });

  describe('Last Payment section', () => {
    it('shows empty state when no payments exist', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('No payment records found.')).toBeInTheDocument();
      // This text appears in both Last Payment and Billing History empty states
      expect(screen.getAllByText('You are currently using the Free plan.').length).toBeGreaterThanOrEqual(1);
    });

    it('shows payment method when a payment exists', () => {
      usePaymentHistory.mockReturnValue({
        payments: [mockPayment], total: 1, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      // 'card' may appear in both Last Payment InfoRow and Billing History table
      expect(screen.getAllByText('card').length).toBeGreaterThanOrEqual(1);
    });

    it('shows amount paid for existing payment', () => {
      usePaymentHistory.mockReturnValue({
        payments: [mockPayment], total: 1, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      // Amount appears in both Last Payment InfoRow and Billing History table
      expect(screen.getAllByText('₹8999.00').length).toBeGreaterThanOrEqual(1);
    });

    it('shows transaction ID for existing payment', () => {
      usePaymentHistory.mockReturnValue({
        payments: [mockPayment], total: 1, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      // Transaction ID appears in both Last Payment InfoRow and Billing History table
      expect(screen.getAllByText('order_abc123').length).toBeGreaterThanOrEqual(1);
    });

    it('shows loading skeletons while payment history is loading', () => {
      usePaymentHistory.mockReturnValue({
        payments: [], total: 0, page: 1, pages: 1, loading: true, loaded: false, load: jest.fn(),
      });
      const { container } = renderWithProviders(<BillingSection />, { preloadedState: freeState });
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Billing Addresses section', () => {
    it('shows empty state when no addresses saved', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText('No billing addresses saved.')).toBeInTheDocument();
    });

    it('shows saved address name when address exists', () => {
      useBillingAddresses.mockReturnValue({
        addresses: [mockAddress], loading: false, loadAddresses: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('shows "Default" chip for default address', () => {
      useBillingAddresses.mockReturnValue({
        addresses: [mockAddress], loading: false, loadAddresses: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('shows address email', () => {
      useBillingAddresses.mockReturnValue({
        addresses: [mockAddress], loading: false, loadAddresses: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('jane@acme.com')).toBeInTheDocument();
    });

    it('shows loading skeletons while addresses load', () => {
      useBillingAddresses.mockReturnValue({ addresses: [], loading: true, loadAddresses: jest.fn() });
      const { container } = renderWithProviders(<BillingSection />, { preloadedState: freeState });
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Billing History table', () => {
    it('shows 0 records label when history is empty', () => {
      renderWithProviders(<BillingSection />, { preloadedState: freeState });
      expect(screen.getByText(/0 records total/i)).toBeInTheDocument();
    });

    it('renders history table with columns when payments exist', () => {
      usePaymentHistory.mockReturnValue({
        payments: [mockPayment], total: 1, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      const table = document.querySelector('table');
      expect(table).toBeInTheDocument();
      expect(table.querySelector('thead')).toBeInTheDocument();
      // "Plan" appears in both Last Payment InfoRow and table header — use getAllByText
      expect(screen.getAllByText('Plan').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Amount').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Status').length).toBeGreaterThanOrEqual(1);
    });

    it('shows payment status badge in table', () => {
      usePaymentHistory.mockReturnValue({
        payments: [mockPayment], total: 1, page: 1, pages: 1, loading: false, loaded: true, load: jest.fn(),
      });
      renderWithProviders(<BillingSection />, { preloadedState: premiumState });
      expect(screen.getByText('CAPTURED')).toBeInTheDocument();
    });
  });
});
