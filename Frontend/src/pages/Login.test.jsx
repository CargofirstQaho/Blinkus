import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { renderWithProviders } from '../tests/utils';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

describe('Login Page', () => {
  describe('Rendering', () => {
    it('renders the welcome heading', () => {
      renderWithProviders(<Login />);
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    it('renders email input', () => {
      renderWithProviders(<Login />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderWithProviders(<Login />);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders sign in button', () => {
      renderWithProviders(<Login />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders forgot password link', () => {
      renderWithProviders(<Login />);
      expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    });

    it('renders sign up link', () => {
      renderWithProviders(<Login />);
      expect(screen.getByRole('link', { name: /sign up free/i })).toBeInTheDocument();
    });

    it('renders Google authentication button', () => {
      renderWithProviders(<Login />);
      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows email required error when form submitted empty', async () => {
      renderWithProviders(<Login />);
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows invalid email error for bad email format', async () => {
      renderWithProviders(<Login />);
      await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('shows password required error when email valid but no password', async () => {
      renderWithProviders(<Login />);
      await userEvent.type(screen.getByLabelText('Email'), 'user@example.com');
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('clears email error when user starts typing', async () => {
      renderWithProviders(<Login />);
      fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form'));
      await waitFor(() => expect(screen.getByText('Email is required')).toBeInTheDocument());
      await userEvent.type(screen.getByLabelText('Email'), 'a');
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  describe('Success message', () => {
    it('renders success message from location state', () => {
      renderWithProviders(<Login />, {
        route: '/login',
        initialEntries: [{ pathname: '/login', state: { successMessage: 'Account verified!' } }],
      });
      expect(screen.getByText('Account verified!')).toBeInTheDocument();
    });
  });

  describe('Password visibility toggle', () => {
    it('renders password as hidden type by default', () => {
      renderWithProviders(<Login />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility on eye button click', async () => {
      renderWithProviders(<Login />);
      const toggle = screen.getByRole('button', { name: /show password/i });
      await userEvent.click(toggle);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });
  });
});
