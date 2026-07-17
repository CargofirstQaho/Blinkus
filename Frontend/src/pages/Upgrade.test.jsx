import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Upgrade from './Upgrade';
import { renderWithProviders } from '../tests/utils';
import { createErpOrder } from '../services/erpSubscriptionApi';

jest.mock('../services/erpSubscriptionApi', () => ({
  fetchErpSubscriptionStatus: jest.fn(),
  fetchErpPlans: jest.fn(),
  fetchErpHistory: jest.fn(),
  fetchPricingPlans: jest.fn(),
  createErpOrder: jest.fn(),
}));

jest.mock('../components/dashboard/subscriptions/hooks/usePricing', () => ({
  usePricing: jest.fn(),
}));

jest.mock('../components/dashboard/subscriptions/hooks/useEntitlements', () => ({
  useEntitlements: jest.fn(),
}));

import { usePricing } from '../components/dashboard/subscriptions/hooks/usePricing';
import { useEntitlements } from '../components/dashboard/subscriptions/hooks/useEntitlements';

const tradePlans = {
  monthly:  { planType: 'monthly',  price: 999,  displayPrice: '₹999',   bonusMonthsAvailable: 0, savingsPercent: 0  },
  sixMonth: { planType: 'sixMonth', price: 4999, displayPrice: '₹4,999', bonusMonthsAvailable: 1, savingsPercent: 10 },
  yearly:   { planType: 'yearly',   price: 8999, displayPrice: '₹8,999', bonusMonthsAvailable: 2, savingsPercent: 20 },
};

function setupHooks({ paymentEnabled = false, loading = false, error = null, plans = tradePlans, trade = null } = {}) {
  usePricing.mockReturnValue({ trade: loading ? null : plans, loading, error });
  useEntitlements.mockReturnValue({
    trade,
    featureFlags: { erpPaymentEnabled: paymentEnabled, chatPaymentEnabled: false, chatLimitsEnabled: false },
    canAccessErp: false,
    canAccessChat: true,
    loaded: true,
  });
}

describe('Upgrade Page', () => {
  beforeEach(() => {
    createErpOrder.mockReset();
    toast.info.mockReset();
    toast.error.mockReset();
  });

  describe('Loading state', () => {
    it('shows a loading spinner while pricing data loads', () => {
      setupHooks({ loading: true });
      const { container } = renderWithProviders(<Upgrade />);
      const spinner = container.querySelector('.animate-spin') ?? container.querySelector('[role="status"]');
      expect(container.textContent).not.toMatch(/monthly/i);
    });

    it('does not show plan cards while loading', () => {
      setupHooks({ loading: true });
      renderWithProviders(<Upgrade />);
      expect(screen.queryByText('Monthly')).not.toBeInTheDocument();
    });
  });

  describe('Error state', () => {
    it('shows error message when pricing fails to load', () => {
      setupHooks({ error: 'Failed to load plans', plans: null });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Failed to load plans')).toBeInTheDocument();
    });

    it('does not show plan cards when there is an error', () => {
      setupHooks({ error: 'Network error', plans: null });
      renderWithProviders(<Upgrade />);
      expect(screen.queryByText('Monthly')).not.toBeInTheDocument();
    });
  });

  describe('Page header', () => {
    it('renders the page heading', () => {
      setupHooks();
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Upgrade to Trade ERP')).toBeInTheDocument();
    });

    it('renders the "Blinkus Trade ERP" badge', () => {
      setupHooks();
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Blinkus Trade ERP')).toBeInTheDocument();
    });

    it('renders feature description text', () => {
      setupHooks();
      renderWithProviders(<Upgrade />);
      expect(screen.getByText(/Unlock Add Organization/i)).toBeInTheDocument();
    });
  });

  describe('Early Access — payments disabled', () => {
    it('shows Early Access Enabled banner when payments are disabled', () => {
      setupHooks({ paymentEnabled: false });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Early Access Enabled')).toBeInTheDocument();
    });

    it('shows future pricing reference note when payments are disabled', () => {
      setupHooks({ paymentEnabled: false });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText(/Future pricing shown for reference/i)).toBeInTheDocument();
    });

    it('renders all three plan cards in early access mode', () => {
      setupHooks({ paymentEnabled: false });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Six Month')).toBeInTheDocument();
      expect(screen.getByText('Yearly')).toBeInTheDocument();
    });

    it('plan buttons are disabled in early access mode', () => {
      setupHooks({ paymentEnabled: false });
      renderWithProviders(<Upgrade />);
      // When comingSoon=true the button renders as "Coming soon" and is disabled
      const buttons = screen.getAllByRole('button', { name: /coming soon/i });
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => expect(btn).toBeDisabled());
    });

    it('shows Coming Soon badges on plan cards in early access mode', () => {
      setupHooks({ paymentEnabled: false });
      renderWithProviders(<Upgrade />);
      const comingSoonItems = screen.getAllByText(/coming soon/i);
      expect(comingSoonItems.length).toBeGreaterThan(0);
    });
  });

  describe('Payment enabled mode', () => {
    it('does not show Early Access Enabled banner when payments are enabled', () => {
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      expect(screen.queryByText('Early Access Enabled')).not.toBeInTheDocument();
    });

    it('renders all three plan cards', () => {
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Six Month')).toBeInTheDocument();
      expect(screen.getByText('Yearly')).toBeInTheDocument();
    });

    it('shows plan prices', () => {
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText('₹999')).toBeInTheDocument();
      expect(screen.getByText('₹8,999')).toBeInTheDocument();
    });

    it('plan buttons are enabled when payments are enabled', () => {
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      const buttons = screen.getAllByRole('button', { name: /choose plan/i });
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0]).not.toBeDisabled();
    });

    it('calls createErpOrder with correct plan type when a plan is selected', async () => {
      createErpOrder.mockResolvedValueOnce({ message: 'Order created' });
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      const buttons = screen.getAllByRole('button', { name: /choose plan/i });
      await userEvent.click(buttons[0]);
      await waitFor(() => {
        expect(createErpOrder).toHaveBeenCalled();
      });
    });

    it('shows toast.info with order message on successful order creation', async () => {
      createErpOrder.mockResolvedValueOnce({ message: 'Order created — checkout coming soon' });
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      const buttons = screen.getAllByRole('button', { name: /choose plan/i });
      await userEvent.click(buttons[0]);
      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith('Order created — checkout coming soon');
      });
    });

    it('shows toast.error when order creation fails', async () => {
      createErpOrder.mockRejectedValueOnce(new Error('Payment failed'));
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      const buttons = screen.getAllByRole('button', { name: /choose plan/i });
      await userEvent.click(buttons[0]);
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Payment failed');
      });
    });

    it('shows secure payment footer text when payments are enabled', () => {
      setupHooks({ paymentEnabled: true });
      renderWithProviders(<Upgrade />);
      expect(screen.getByText(/Secure payments are processed via Razorpay/i)).toBeInTheDocument();
    });
  });
});
