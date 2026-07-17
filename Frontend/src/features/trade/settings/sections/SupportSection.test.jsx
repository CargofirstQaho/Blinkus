import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupportSection from './SupportSection';
import { renderWithProviders } from '../../../../tests/utils';

describe('SupportSection', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the Support section title', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('renders the Need Help heading', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByText('Need Help?')).toBeInTheDocument();
    });

    it('renders the support email address', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByText('orbit@blinkus.ai')).toBeInTheDocument();
    });

    it('renders the Copy button', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });

    it('renders Send Email link', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByText('Send Email')).toBeInTheDocument();
    });

    it('Send Email link points to correct mailto', () => {
      renderWithProviders(<SupportSection />);
      const link = screen.getByRole('link', { name: /send email/i });
      expect(link).toHaveAttribute('href', expect.stringContaining('mailto:orbit@blinkus.ai'));
    });

  });

  describe('Copy email interaction', () => {
    it('copies support email to clipboard on Copy click', async () => {
      renderWithProviders(<SupportSection />);
      await userEvent.click(screen.getByRole('button', { name: /copy/i }));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('orbit@blinkus.ai');
    });

    it('shows "Copied!" text after clicking Copy', async () => {
      renderWithProviders(<SupportSection />);
      await userEvent.click(screen.getByRole('button', { name: /copy/i }));
      expect(await screen.findByText(/copied!/i)).toBeInTheDocument();
    });

    it('shows Copy button before clicking', () => {
      renderWithProviders(<SupportSection />);
      expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    });
  });
});
