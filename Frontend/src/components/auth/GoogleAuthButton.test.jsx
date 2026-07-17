import { screen, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import GoogleAuthButton from './GoogleAuthButton';

describe('GoogleAuthButton', () => {
  describe('Rendering', () => {
    it('renders with default label', () => {
      render(<GoogleAuthButton />);
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('renders with custom label', () => {
      render(<GoogleAuthButton label="Sign in with Google" />);
      expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    });

    it('renders a button element', () => {
      render(<GoogleAuthButton />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders Google SVG logo', () => {
      render(<GoogleAuthButton />);
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Disabled state', () => {
    it('is not disabled by default', () => {
      render(<GoogleAuthButton />);
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      render(<GoogleAuthButton disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not navigate when disabled and clicked', () => {
      render(<GoogleAuthButton disabled />);
      const originalHref = window.location.href;
      fireEvent.click(screen.getByRole('button'));
      expect(window.location.href).toBe(originalHref);
    });
  });

  describe('OAuth redirect', () => {
    it('sets window.location.href on click when enabled', () => {
      render(<GoogleAuthButton />);
      fireEvent.click(screen.getByRole('button'));
      // Google oauth URL is set — location.href changes from the default empty string
      expect(window.location.href).toContain('/api/auth/google');
    });

    it('stores oauth_state in sessionStorage on click', () => {
      render(<GoogleAuthButton />);
      fireEvent.click(screen.getByRole('button'));
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        'oauth_state',
        expect.any(String)
      );
    });
  });
});
