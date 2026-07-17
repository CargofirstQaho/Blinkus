import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from './Signup';
import { renderWithProviders } from '../tests/utils';

jest.mock('../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

describe('Signup Page', () => {
  describe('Rendering', () => {
    it('renders the create account heading', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByText('Create your account')).toBeInTheDocument();
    });

    it('renders full name input', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('renders work email input', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByLabelText('Work Email')).toBeInTheDocument();
    });

    it('renders mobile number input', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
    });

    it('renders password input', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders create account button', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('renders sign in link', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders Google authentication button', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('shows name required error on empty submit', async () => {
      renderWithProviders(<Signup />);
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Full name is required')).toBeInTheDocument();
      });
    });

    it('shows email required error when name provided but not email', async () => {
      renderWithProviders(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Smith');
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('shows invalid email error for bad email format', async () => {
      renderWithProviders(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Smith');
      await userEvent.type(screen.getByLabelText('Work Email'), 'bad-email');
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('shows mobile required error when mobile missing', async () => {
      renderWithProviders(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Smith');
      await userEvent.type(screen.getByLabelText('Work Email'), 'john@example.com');
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Mobile number is required')).toBeInTheDocument();
      });
    });

    it('shows password too short error', async () => {
      renderWithProviders(<Signup />);
      await userEvent.type(screen.getByLabelText('Full Name'), 'John Smith');
      await userEvent.type(screen.getByLabelText('Work Email'), 'john@example.com');
      await userEvent.type(screen.getByLabelText('Mobile Number'), '+12345678901');
      await userEvent.type(screen.getByLabelText('Password'), 'short');
      fireEvent.submit(screen.getByRole('button', { name: /create account/i }).closest('form'));
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });
  });

  describe('Password visibility toggle', () => {
    it('password is hidden by default', () => {
      renderWithProviders(<Signup />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    });

    it('toggles password visibility', async () => {
      renderWithProviders(<Signup />);
      const toggle = screen.getByRole('button', { name: /show password/i });
      await userEvent.click(toggle);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
    });
  });
});
