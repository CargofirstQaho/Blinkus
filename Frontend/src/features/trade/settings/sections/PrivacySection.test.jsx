import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrivacySection from './PrivacySection';
import { renderWithProviders, authenticatedState } from '../../../../tests/utils';

const stateWithTerms = (overrides = {}) => ({
  ...authenticatedState,
  auth: {
    ...authenticatedState.auth,
    user: {
      ...authenticatedState.auth.user,
      termsAcceptance: {
        accepted: true,
        acceptedAt: '2026-01-15T10:30:00.000Z',
        version: '1.0',
        acceptedVia: 'signup',
        ...overrides,
      },
    },
  },
});

const stateWithoutTerms = {
  ...authenticatedState,
  auth: {
    ...authenticatedState.auth,
    user: { ...authenticatedState.auth.user, termsAcceptance: null },
  },
};

describe('PrivacySection', () => {
  describe('Rendering', () => {
    it('renders the Privacy section title', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      expect(screen.getByText('Privacy')).toBeInTheDocument();
    });

    it('renders Terms & Conditions card', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();
    });

    it('renders Privacy Policy card', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });

    it('renders Read Terms of Service link', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      const links = screen.getAllByText('Read Terms of Service');
      expect(links.length).toBeGreaterThan(0);
    });

    it('renders Read Privacy Policy link', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      const links = screen.getAllByText('Read Privacy Policy');
      expect(links.length).toBeGreaterThan(0);
    });

    it('renders the informational notice at the bottom', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      expect(screen.getByText(/accepted together during account registration/i)).toBeInTheDocument();
    });
  });

  describe('Accepted state', () => {
    it('shows "Accepted" badge when terms are accepted', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ accepted: true }) });
      const badges = screen.getAllByText('Accepted');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows "Not Accepted" badge when terms.accepted is false', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ accepted: false }) });
      const badges = screen.getAllByText('Not Accepted');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows "Not Accepted" badge when termsAcceptance is null', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithoutTerms });
      const badges = screen.getAllByText('Not Accepted');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('shows "Yes" in info rows when accepted', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ accepted: true }) });
      const yesItems = screen.getAllByText('Yes');
      expect(yesItems.length).toBeGreaterThan(0);
    });

    it('shows "No" in info rows when not accepted', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ accepted: false }) });
      const noItems = screen.getAllByText('No');
      expect(noItems.length).toBeGreaterThan(0);
    });
  });

  describe('Terms metadata', () => {
    it('displays the terms version', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ version: '2.1' }) });
      const versionItems = screen.getAllByText('2.1');
      expect(versionItems.length).toBeGreaterThan(0);
    });

    it('maps "signup" acceptedVia to "Signup"', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ acceptedVia: 'signup' }) });
      const items = screen.getAllByText('Signup');
      expect(items.length).toBeGreaterThan(0);
    });

    it('maps "google-auth" acceptedVia to "Google Sign-In"', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ acceptedVia: 'google-auth' }) });
      const items = screen.getAllByText('Google Sign-In');
      expect(items.length).toBeGreaterThan(0);
    });

    it('maps "policy-update" acceptedVia to "Policy Update"', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ acceptedVia: 'policy-update' }) });
      const items = screen.getAllByText('Policy Update');
      expect(items.length).toBeGreaterThan(0);
    });

    it('shows "Not yet accepted" when acceptedAt is null', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms({ acceptedAt: null }) });
      const items = screen.getAllByText('Not yet accepted');
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('Links', () => {
    it('terms link opens to /terms-of-service', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      const links = screen.getAllByRole('link', { name: /read terms of service/i });
      expect(links[0]).toHaveAttribute('href', '/terms-of-service');
    });

    it('privacy link opens to /privacy-policy', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      const links = screen.getAllByRole('link', { name: /read privacy policy/i });
      expect(links[0]).toHaveAttribute('href', '/privacy-policy');
    });

    it('links open in a new tab', () => {
      renderWithProviders(<PrivacySection />, { preloadedState: stateWithTerms() });
      const links = screen.getAllByRole('link', { name: /read terms/i });
      expect(links[0]).toHaveAttribute('target', '_blank');
    });
  });
});
