import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import GeneralSection from './GeneralSection';
import { renderWithProviders, authenticatedState } from '../../../../tests/utils';

const mockApiFetch = jest.fn();
jest.mock('@/src/lib/apiFetch.js', () => ({
  apiFetch: (...args) => mockApiFetch(...args),
  SessionExpiredError: class SessionExpiredError extends Error {
    constructor() { super('session_expired'); this.name = 'SessionExpiredError'; }
  },
}));

const userState = {
  ...authenticatedState,
  auth: {
    ...authenticatedState.auth,
    user: {
      _id: 'user-1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      mobile: '+919876543210',
      company: 'Acme Trading',
      provider: 'email',
      createdAt: '2026-01-10T08:00:00.000Z',
    },
    isAuthenticated: true,
  },
};

function mockSaveSuccess(updatedUser) {
  mockApiFetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn().mockResolvedValue({ data: { user: updatedUser } }),
  });
}

function mockSaveFailure(message = 'Server error') {
  mockApiFetch.mockResolvedValueOnce({
    ok: false,
    json: jest.fn().mockResolvedValue({ message }),
  });
}

describe('GeneralSection', () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
  });

  describe('Rendering', () => {
    it('renders General section title', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('General')).toBeInTheDocument();
    });

    it('renders user name in profile card', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });

    it('renders user avatar initials', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders "Active" status badge', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders Edit Profile button', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('renders Profile Information section', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('Profile Information')).toBeInTheDocument();
    });

    it('shows email in profile info pills', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      const emailValues = screen.getAllByText('jane@example.com');
      expect(emailValues.length).toBeGreaterThan(0);
    });

    it('shows mobile in profile info pills', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('+919876543210')).toBeInTheDocument();
    });

    it('shows company in profile info pills', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('Acme Trading')).toBeInTheDocument();
    });

    it('shows "Email & Password" as provider label', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.getByText('Email & Password')).toBeInTheDocument();
    });

    it('does not show edit form by default', () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      expect(screen.queryByText('Edit Profile', { selector: 'h3' })).not.toBeInTheDocument();
    });
  });

  describe('Edit mode', () => {
    it('opens edit form when Edit Profile button is clicked', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      expect(screen.getByText('Edit Profile', { selector: 'h3' })).toBeInTheDocument();
    });

    it('pre-fills name field with current user name', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      expect(screen.getByPlaceholderText(/enter your full name/i)).toHaveValue('Jane Doe');
    });

    it('pre-fills mobile field with current mobile', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      expect(screen.getByPlaceholderText(/enter your mobile number/i)).toHaveValue('+919876543210');
    });

    it('hides Edit Profile button when in edit mode', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
    });

    it('shows Save Changes and Cancel buttons in edit mode', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('closes edit form when Cancel is clicked', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByText('Edit Profile', { selector: 'h3' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });
  });

  describe('Save validation', () => {
    it('shows error toast when name is cleared and form is submitted', async () => {
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const nameInput = screen.getByPlaceholderText(/enter your full name/i);
      await userEvent.clear(nameInput);
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(toast.error).toHaveBeenCalledWith('Full name is required');
      expect(mockApiFetch).not.toHaveBeenCalled();
    });
  });

  describe('Save success', () => {
    it('calls PATCH /api/user with updated form values', async () => {
      const updatedUser = { ...userState.auth.user, name: 'Jane Smith', mobile: '+919999999999', company: 'New Co' };
      mockSaveSuccess(updatedUser);
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      const nameInput = screen.getByPlaceholderText(/enter your full name/i);
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'Jane Smith');
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(mockApiFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/user'),
          expect.objectContaining({ method: 'PATCH' }),
        );
      });
    });

    it('shows success toast after saving', async () => {
      const updatedUser = { ...userState.auth.user, name: 'Jane Doe' };
      mockSaveSuccess(updatedUser);
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
      });
    });

    it('closes edit form after successful save', async () => {
      const updatedUser = { ...userState.auth.user, name: 'Jane Doe' };
      mockSaveSuccess(updatedUser);
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.queryByText('Edit Profile', { selector: 'h3' })).not.toBeInTheDocument();
      });
    });
  });

  describe('Save failure', () => {
    it('shows error toast when API returns error', async () => {
      mockSaveFailure('Failed to update profile');
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
      });
    });

    it('keeps edit form open after API failure', async () => {
      mockSaveFailure('Server error');
      renderWithProviders(<GeneralSection />, { preloadedState: userState });
      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
      expect(screen.getByText('Edit Profile', { selector: 'h3' })).toBeInTheDocument();
    });
  });
});
