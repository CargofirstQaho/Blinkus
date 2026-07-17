import { screen } from '@testing-library/react';
import HeroBanner from './HeroBanner';
import { renderWithProviders, authenticatedState } from '../../../tests/utils';

describe('HeroBanner', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      // The heading contains "The Intelligence Engine" and "for Global Trade" split by <br>
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('renders the intelligence engine headline', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/The Intelligence Engine/)).toBeInTheDocument();
    });

    it('renders description paragraph', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/Monitor trade intelligence/i)).toBeInTheDocument();
    });

    it('renders Chat with Blinkus Agent button', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/Chat with Blinkus Agent/i)).toBeInTheDocument();
    });

    it('renders Intelligence Active badge', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/Intelligence Active/i)).toBeInTheDocument();
    });

    it('renders AI Model Status section', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/AI Model Status/i)).toBeInTheDocument();
    });

    it('renders Powered by Blinkus AI text', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText(/Powered by Blinkus AI/i)).toBeInTheDocument();
    });
  });

  describe('Welcome banner — personalization', () => {
    it('shows user first name in greeting', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      // authenticatedState has user name "Test User" → firstName "Test"
      expect(screen.getByText(/Test/)).toBeInTheDocument();
    });

    it('shows Trader as fallback when no user', () => {
      renderWithProviders(<HeroBanner />);
      expect(screen.getByText(/Trader/)).toBeInTheDocument();
    });

    it('shows time-based greeting', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(
        screen.getByText(/Good (morning|afternoon|evening)/i)
      ).toBeInTheDocument();
    });
  });

  describe('Metrics', () => {
    it('renders Global markets metric', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText('Global markets')).toBeInTheDocument();
    });

    it('renders Commodity pricing metric', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText('Commodity pricing')).toBeInTheDocument();
    });

    it('renders Compliance intelligence metric', () => {
      renderWithProviders(<HeroBanner />, { preloadedState: authenticatedState });
      expect(screen.getByText('Compliance intelligence')).toBeInTheDocument();
    });
  });
});
