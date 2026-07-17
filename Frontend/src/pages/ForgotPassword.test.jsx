import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPassword from './ForgotPassword';
import { renderWithProviders } from '../tests/utils';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

describe('ForgotPassword Page', () => {
  describe('Rendering', () => {
    it('renders the forgot password heading', () => {
      renderWithProviders(<ForgotPassword />);
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    it('renders the description text', () => {
      renderWithProviders(<ForgotPassword />);
      expect(screen.getByText(/Enter the email address/i)).toBeInTheDocument();
    });

    it('renders email input', () => {
      renderWithProviders(<ForgotPassword />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders send reset code button', () => {
      renderWithProviders(<ForgotPassword />);
      expect(screen.getByRole('button', { name: /send reset code/i })).toBeInTheDocument();
    });

    it('renders back to sign in link', () => {
      renderWithProviders(<ForgotPassword />);
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows email required error on empty submit', async () => {
      renderWithProviders(<ForgotPassword />);
      fireEvent.click(screen.getByRole('button', { name: /send reset code/i }));
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows invalid email error for bad format', async () => {
      renderWithProviders(<ForgotPassword />);
      await userEvent.type(screen.getByLabelText('Email'), 'not-valid');
      fireEvent.click(screen.getByRole('button', { name: /send reset code/i }));
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('clears error when user types in email field', async () => {
      renderWithProviders(<ForgotPassword />);
      fireEvent.click(screen.getByRole('button', { name: /send reset code/i }));
      await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
      await userEvent.type(screen.getByLabelText('Email'), 'a');
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });
});
