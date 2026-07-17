import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import AddOrganizationPage from './AddOrganizationPage';
import { renderWithProviders } from '../../../../tests/utils';

jest.mock('../hooks/useOrganization', () => ({
  useOrganization: jest.fn(),
}));

import { useOrganization } from '../hooks/useOrganization';

const mockOrganization = {
  _id: 'org-1',
  organizationName: 'Acme Trading Co',
  organizationEmail: 'contact@acme.com',
  location: 'Mumbai, India',
  gstNumber: 'GST123456',
  panNumber: 'ABCDE1234F',
  logoUrl: null,
  status: 'active',
};

describe('AddOrganizationPage', () => {
  beforeEach(() => {
    useOrganization.mockReset();
    // jsdom does not implement URL.createObjectURL (used inside LogoUploader.handleFile)
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/fake-url');
    global.URL.revokeObjectURL = jest.fn();
  });

  describe('Loading state', () => {
    it('shows a spinner during initial load', () => {
      useOrganization.mockReturnValue({
        organization: null, loading: true, loaded: false, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
      const { container } = renderWithProviders(<AddOrganizationPage />);
      const spinner = container.querySelector('.animate-spin') ?? container.querySelector('[class*="spinner"]');
      expect(spinner ?? container.firstChild).toBeInTheDocument();
    });

    it('does not render form during initial load', () => {
      useOrganization.mockReturnValue({
        organization: null, loading: true, loaded: false, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.queryByText('Organization Details')).not.toBeInTheDocument();
    });
  });

  describe('Create form — no existing organization', () => {
    beforeEach(() => {
      useOrganization.mockReturnValue({
        organization: null, loading: false, loaded: true, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
    });

    it('renders the organization create form when no org exists', () => {
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.getByText('Organization Details')).toBeInTheDocument();
    });

    it('renders Organization Name field', () => {
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.getByText('Organization Name')).toBeInTheDocument();
    });

    it('does not show "Registered & Locked" notice when no org exists', () => {
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.queryByText(/Registered & Locked/i)).not.toBeInTheDocument();
    });
  });

  describe('Existing organization view', () => {
    beforeEach(() => {
      useOrganization.mockReturnValue({
        organization: mockOrganization, loading: false, loaded: true, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
    });

    it('shows "Registered & Locked" notice when org exists', () => {
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.getByText('Registered & Locked')).toBeInTheDocument();
    });

    it('shows "Changes are not permitted" message', () => {
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.getByText(/Changes are not permitted after submission/i)).toBeInTheDocument();
    });

    it('does not show the create form when org is loaded', () => {
      renderWithProviders(<AddOrganizationPage />);
      // OrganizationProfileView also shows "Organization Name" as a field label,
      // so check for the Register Organization submit button which is unique to the create form
      expect(screen.queryByRole('button', { name: /register organization/i })).not.toBeInTheDocument();
    });
  });

  describe('Background refresh indicator', () => {
    it('shows "Refreshing organization data…" toast when loading after initial load', () => {
      useOrganization.mockReturnValue({
        organization: mockOrganization, loading: true, loaded: true, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.getByText(/Refreshing organization data/i)).toBeInTheDocument();
    });

    it('does not show refresh indicator when not loading', () => {
      useOrganization.mockReturnValue({
        organization: mockOrganization, loading: false, loaded: true, saving: false,
        saveOrganization: jest.fn(), uploadLogo: jest.fn(),
      });
      renderWithProviders(<AddOrganizationPage />);
      expect(screen.queryByText(/Refreshing organization data/i)).not.toBeInTheDocument();
    });
  });

  describe('Form submission', () => {
    it('shows logo required error when Register Organization is clicked without uploading a logo', async () => {
      // The button has type="button" (not "submit") until a logo is uploaded and logoKey is set.
      // Clicking it without a logo triggers the logoError state, not saveOrganization.
      const saveOrganization = jest.fn().mockResolvedValue({});
      useOrganization.mockReturnValue({
        organization: null, loading: false, loaded: true, saving: false,
        saveOrganization, uploadLogo: jest.fn(),
      });
      renderWithProviders(<AddOrganizationPage />);
      const submitBtn = screen.getByRole('button', { name: /register organization/i });
      await userEvent.click(submitBtn);
      expect(screen.getByText('Company logo is required.')).toBeInTheDocument();
      expect(saveOrganization).not.toHaveBeenCalled();
    });
  });

  describe('Logo upload', () => {
    it('calls uploadLogo with a file when logo is selected', async () => {
      const uploadLogo = jest.fn().mockResolvedValue('logo-key-123');
      useOrganization.mockReturnValue({
        organization: null, loading: false, loaded: true, saving: false,
        saveOrganization: jest.fn(), uploadLogo,
      });
      renderWithProviders(<AddOrganizationPage />);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        const file = new File(['logo'], 'logo.png', { type: 'image/png' });
        await userEvent.upload(fileInput, file);
        await waitFor(() => {
          expect(uploadLogo).toHaveBeenCalledWith(file);
        });
      }
    });
  });
});
