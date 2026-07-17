import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import Settings from './Settings';
import { renderWithProviders } from '../tests/utils';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Settings Page', () => {
  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it('renders the page heading and description', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Configure your Blinkus experience')).toBeInTheDocument();
  });

  it('renders the Notifications section with its items', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Email Alerts')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Weekly Digest')).toBeInTheDocument();
  });

  it('renders the Security section with its items', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Two-Factor Auth')).toBeInTheDocument();
    expect(screen.getByText('Session Logs')).toBeInTheDocument();
  });

  it('toggles a setting and shows a success toast', async () => {
    renderWithProviders(<Settings />);

    const emailAlertsToggle = screen.getByText('Email Alerts').closest('div').parentElement.parentElement.querySelector('button');
    await userEvent.click(emailAlertsToggle);

    expect(toast.success).toHaveBeenCalledWith('Setting updated');
  });

  it('renders the Danger Zone and shows an error toast when deleting the account', async () => {
    renderWithProviders(<Settings />);

    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(screen.getByText(/These actions are permanent/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

    expect(toast.error).toHaveBeenCalledWith('Contact support to delete your account');
  });
});
