import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Profile from './Profile';
import { renderWithProviders, authenticatedState } from '../tests/utils';

const mockApiFetch = jest.fn();
jest.mock('../lib/apiFetch', () => ({
  apiFetch: (...args) => mockApiFetch(...args),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

jest.mock('../components/dashboard/subscriptions/hooks/useEntitlements', () => ({
  useEntitlements: jest.fn(),
}));

jest.mock('../features/trade/organization/hooks/useOrganization', () => ({
  useOrganization: jest.fn(),
}));

import { useEntitlements } from '../components/dashboard/subscriptions/hooks/useEntitlements';
import { useOrganization } from '../features/trade/organization/hooks/useOrganization';

const noErrpEntitlement = {
  trade: null,
  canAccessErp: false,
  canAccessChat: true,
  featureFlags: {},
  loaded: true,
};

const erpEntitlement = {
  trade: { planType: 'yearly', status: 'active' },
  canAccessErp: true,
  canAccessChat: true,
  featureFlags: {},
  loaded: true,
};

const userWithTerms = {
  ...authenticatedState,
  auth: {
    ...authenticatedState.auth,
    user: {
      _id: 'user-1',
      name: 'Test User',
      email: 'test@example.com',
      mobile: '+919876543210',
      company: 'Test Co',
      provider: 'email',
      createdAt: '2026-01-10T08:00:00.000Z',
      termsAcceptance: {
        accepted: true,
        acceptedAt: '2026-01-10T08:00:00.000Z',
        version: '1.0',
        acceptedVia: 'signup',
      },
    },
    isAuthenticated: true,
  },
};

describe('Profile Page', () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
    useEntitlements.mockReturnValue(noErrpEntitlement);
    useOrganization.mockReturnValue({ organization: null, loading: false, loaded: true });
  });

  describe('Rendering', () => {
    it('renders the Profile heading', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByRole('heading', { name: /^profile$/i })).toBeInTheDocument();
    });

    it('renders user name in the profile card', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('renders user avatar initials', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('renders "Active Account" status badge', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Active Account')).toBeInTheDocument();
    });

    it('renders user email in profile card', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      const emails = screen.getAllByText('test@example.com');
      expect(emails.length).toBeGreaterThan(0);
    });

    it('renders Edit Profile form heading', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('renders Change profile photo button', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByRole('button', { name: /change profile photo/i })).toBeInTheDocument();
    });

    it('renders "Your data is secure and encrypted" notice', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText(/your data is secure and encrypted/i)).toBeInTheDocument();
    });
  });

  describe('Edit Profile form', () => {
    it('renders Full Name input pre-filled with user name', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Test User');
    });

    it('renders Mobile Number input pre-filled', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByLabelText(/mobile number/i)).toHaveValue('+919876543210');
    });

    it('renders Company input pre-filled', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByLabelText(/company/i)).toHaveValue('Test Co');
    });

    it('renders Email Address as read-only', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('readOnly');
    });

    it('renders Save Changes button', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('shows "Email address cannot be changed" note', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText(/email address cannot be changed/i)).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows error toast when name is cleared and form is submitted', async () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      const nameInput = screen.getByLabelText(/full name/i);
      await userEvent.clear(nameInput);
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(toast.error).toHaveBeenCalledWith('Full name is required');
      expect(mockApiFetch).not.toHaveBeenCalled();
    });
  });

  describe('Save profile — API success', () => {
    it('calls PATCH /api/user on form submit', async () => {
      mockApiFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { user: userWithTerms.auth.user } }),
      });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/user'),
          expect.objectContaining({ method: 'PATCH' }),
        );
      });
    });

    it('shows "Profile updated" success toast', async () => {
      mockApiFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { user: userWithTerms.auth.user } }),
      });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Profile updated');
      });
    });

    it('shows loading state on Save Changes button while saving', async () => {
      let resolveApi;
      mockApiFetch.mockReturnValueOnce(
        new Promise((res) => { resolveApi = res; })
      );
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument();
      resolveApi({ ok: true, json: jest.fn().mockResolvedValue({ data: { user: userWithTerms.auth.user } }) });
    });
  });

  describe('Save profile — API failure', () => {
    it('shows error toast when API returns failure', async () => {
      mockApiFetch.mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Failed to update profile' }),
      });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });
    });

    it('shows generic error toast on network failure', async () => {
      const networkError = new Error('Network error');
      networkError.name = 'TypeError';
      mockApiFetch.mockRejectedValueOnce(networkError);
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Cannot connect to server. Please try again.');
      });
    });
  });

  describe('Organization section', () => {
    it('does not show organization section when user has no ERP access and no org', () => {
      useEntitlements.mockReturnValue(noErrpEntitlement);
      useOrganization.mockReturnValue({ organization: null, loading: false, loaded: true });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.queryByText('Your registered business details')).not.toBeInTheDocument();
    });

    it('shows organization section while org is loading (for ERP users)', () => {
      useEntitlements.mockReturnValue(erpEntitlement);
      useOrganization.mockReturnValue({ organization: null, loading: true, loaded: false });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Organization')).toBeInTheDocument();
    });

    it('shows org name when org is loaded', () => {
      useEntitlements.mockReturnValue(erpEntitlement);
      useOrganization.mockReturnValue({
        organization: { organizationName: 'Acme Corp', organizationEmail: 'info@acme.com', logoUrl: null },
        loading: false,
        loaded: true,
      });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    });

    it('shows org email when org is loaded', () => {
      useEntitlements.mockReturnValue(erpEntitlement);
      useOrganization.mockReturnValue({
        organization: { organizationName: 'Acme Corp', organizationEmail: 'info@acme.com', logoUrl: null },
        loading: false,
        loaded: true,
      });
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('info@acme.com')).toBeInTheDocument();
    });
  });

  describe('Legal & Compliance section', () => {
    it('renders Legal & Compliance section', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Legal & Compliance')).toBeInTheDocument();
    });

    it('shows Terms Accepted: Yes when user has accepted', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByText('Yes')).toBeInTheDocument();
    });

    it('shows Terms Accepted: No when user has not accepted', () => {
      const noTermsState = {
        ...userWithTerms,
        auth: { ...userWithTerms.auth, user: { ...userWithTerms.auth.user, termsAcceptance: { accepted: false } } },
      };
      renderWithProviders(<Profile />, { preloadedState: noTermsState });
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('renders Read Terms of Service link', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByRole('link', { name: /read terms of service/i })).toBeInTheDocument();
    });

    it('renders Read Privacy Policy link', () => {
      renderWithProviders(<Profile />, { preloadedState: userWithTerms });
      expect(screen.getByRole('link', { name: /read privacy policy/i })).toBeInTheDocument();
    });
  });
});
