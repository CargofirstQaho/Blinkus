import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../tests/utils';
import Footer from './Footer';

// BrandLogo imports an image which is handled by fileMock
// SocialLinks imports footerData which we need to read

describe('Footer', () => {
  describe('Rendering', () => {
    it('renders footer element', () => {
      renderWithProviders(<Footer />);
      expect(document.querySelector('footer')).toBeInTheDocument();
    });

    it('renders copyright notice', () => {
      renderWithProviders(<Footer />);
      expect(screen.getByText(/2026 BLINKUS/i)).toBeInTheDocument();
    });

    it('renders ALL RIGHTS RESERVED text', () => {
      renderWithProviders(<Footer />);
      expect(screen.getByText(/ALL RIGHTS RESERVED/i)).toBeInTheDocument();
    });

    it('renders legal links', () => {
      renderWithProviders(<Footer />);
      expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /privacy/i })).toBeInTheDocument();
    });

    it('renders back to top button', () => {
      renderWithProviders(<Footer />);
      expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
    });
  });

  describe('Social media links', () => {
    it('renders social links container', () => {
      renderWithProviders(<Footer />);
      // Social links have aria-labels
      const socialLinks = document.querySelectorAll('a[aria-label]');
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it('social links have target="_blank"', () => {
      renderWithProviders(<Footer />);
      const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
      expect(externalLinks.length).toBeGreaterThan(0);
    });

    it('social links have rel="noopener noreferrer"', () => {
      renderWithProviders(<Footer />);
      const safeLinks = Array.from(
        document.querySelectorAll('a[rel="noopener noreferrer"]')
      );
      expect(safeLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Back to top', () => {
    it('calls window.scrollTo when back to top is clicked', async () => {
      const { getByRole } = renderWithProviders(<Footer />);
      const backToTopBtn = getByRole('button', { name: /back to top/i });
      backToTopBtn.click();
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });
});
