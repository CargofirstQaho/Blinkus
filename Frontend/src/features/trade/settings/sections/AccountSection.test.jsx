import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountSection from './AccountSection';
import { renderWithProviders, authenticatedState } from '../../../../tests/utils';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/src/features/trade/organization/hooks/useOrganization.js', () => ({
  useOrganization: jest.fn(),
}));

import { useOrganization } from '@/src/features/trade/organization/hooks/useOrganization.js';

const baseState = {
  ...authenticatedState,
  auth: {
    ...authenticatedState.auth,
    user: {
      _id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '+919876543210',
      company: 'Acme Trading',
      provider: 'email',
      createdAt: '2026-01-10T08:00:00.000Z',
    },
    isAuthenticated: true,
  },
  subscription: {
    currentPlan: null,
    history: [],
    loading: false,
    chat: { planType: 'free', status: 'none', startDate: null, endDate: null, unlimitedAccess: true, source: 'free' },
    trade: { planType: 'none', status: 'none', startDate: null, endDate: null, unlimitedAccess: false },
    bonusEligibility: { sixMonthBonusUsed: false, yearlyBonusUsed: false },
    erpHistory: [],
  },
  entitlement: {
    chat: true,
    erp: false,
    erpModules: { addOrganization: false, domestic: false, international: false, tradeHistory: false },
    featureFlags: { erpPaymentEnabled: false, chatPaymentEnabled: false, chatLimitsEnabled: false },
    loaded: true,
  },
};

const premiumState = {
  ...baseState,
  subscription: {
    ...baseState.subscription,
    trade: { planType: 'yearly', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', unlimitedAccess: true },
  },
};

describe('AccountSection', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useOrganization.mockReturnValue({ organization: null, loading: false });
    global.fetch = jest.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the Account section title', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Account')).toBeInTheDocument();
    });

    it('renders Account Information card', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Account Information')).toBeInTheDocument();
    });

    it('renders Subscription Status card', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Subscription Status')).toBeInTheDocument();
    });

    it('renders Organization card', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Organization')).toBeInTheDocument();
    });

    it('renders Sign Out card heading', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByRole('heading', { name: /sign out/i })).toBeInTheDocument();
    });

    it('renders Sign Out button', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('shows user ID in account info', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('user-1')).toBeInTheDocument();
    });

    it('shows "Email & Password" provider for non-Google accounts', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Email & Password')).toBeInTheDocument();
    });
  });

  describe('Subscription Status — always Active', () => {
    it('shows green Active badge for Free Plan users', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows green Active badge for Premium users', () => {
      renderWithProviders(<AccountSection />, { preloadedState: premiumState });
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('shows "Free Plan" label for non-subscribers', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Free Plan')).toBeInTheDocument();
    });

    it('shows "Yearly" label for yearly plan subscribers', () => {
      renderWithProviders(<AccountSection />, { preloadedState: premiumState });
      expect(screen.getByText('Yearly')).toBeInTheDocument();
    });

    it('does not show an Upgrade button in subscription card', () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.queryByRole('button', { name: /upgrade/i })).not.toBeInTheDocument();
    });
  });

  describe('Organization section', () => {
    it('shows loading spinner while org is loading', () => {
      useOrganization.mockReturnValue({ organization: null, loading: true });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });

    it('shows org name when org data is loaded', () => {
      useOrganization.mockReturnValue({
        organization: { organizationName: 'Acme Corp', organizationEmail: 'info@acme.com', gstNumber: 'GST123', status: 'active' },
        loading: false,
      });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });

    it('shows org email when org data is loaded', () => {
      useOrganization.mockReturnValue({
        organization: { organizationName: 'Acme Corp', organizationEmail: 'info@acme.com', status: 'active' },
        loading: false,
      });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('info@acme.com')).toBeInTheDocument();
    });

    it('shows empty state message when no org exists', () => {
      useOrganization.mockReturnValue({ organization: null, loading: false });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByText('No organization has been created yet.')).toBeInTheDocument();
    });

    it('shows Create Organization button in empty state', () => {
      useOrganization.mockReturnValue({ organization: null, loading: false });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      expect(screen.getByRole('button', { name: /create organization/i })).toBeInTheDocument();
    });

    it('navigates to /trade/add-organization when Create Organization is clicked', async () => {
      useOrganization.mockReturnValue({ organization: null, loading: false });
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /create organization/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/trade/add-organization');
    });
  });

  describe('Sign Out modal', () => {
    it('opens sign out modal when Sign Out button is clicked', async () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      expect(screen.getByText('Sign out of Blinkus?')).toBeInTheDocument();
    });

    it('closes modal when Cancel is clicked', async () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByText('Sign out of Blinkus?')).not.toBeInTheDocument();
    });

    it('calls fetch to logout API on confirm', async () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      const modal = screen.getByText('Sign out of Blinkus?').closest('div[class*="rounded-2xl"]');
      await userEvent.click(within(modal).getByRole('button', { name: /sign out/i }));
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/auth/logout'),
          expect.objectContaining({ method: 'POST' }),
        );
      });
    });

    it('navigates to / after logout', async () => {
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      const modal = screen.getByText('Sign out of Blinkus?').closest('div[class*="rounded-2xl"]');
      await userEvent.click(within(modal).getByRole('button', { name: /sign out/i }));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('clears auth state after logout', async () => {
      const { store } = renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      const modal = screen.getByText('Sign out of Blinkus?').closest('div[class*="rounded-2xl"]');
      await userEvent.click(within(modal).getByRole('button', { name: /sign out/i }));
      await waitFor(() => {
        expect(store.getState().auth.isAuthenticated).toBe(false);
        expect(store.getState().auth.user).toBeNull();
      });
    });

    it('logs out even when logout API call fails', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      renderWithProviders(<AccountSection />, { preloadedState: baseState });
      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
      const modal = screen.getByText('Sign out of Blinkus?').closest('div[class*="rounded-2xl"]');
      await userEvent.click(within(modal).getByRole('button', { name: /sign out/i }));
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});
