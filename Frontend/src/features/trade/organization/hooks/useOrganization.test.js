import { renderHook, act, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import { useOrganization } from './useOrganization';
import { createTestStore } from '../../../../tests/utils';
import {
  fetchMyOrganization,
  saveOrganizationDetails,
  uploadOrganizationLogo,
  verifyKycDocument,
} from '../services/organizationApi';

jest.mock('../services/organizationApi', () => ({
  fetchMyOrganization: jest.fn(),
  saveOrganizationDetails: jest.fn(),
  uploadOrganizationLogo: jest.fn(),
  verifyKycDocument: jest.fn(),
}));

function wrapperFor(store) {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
}

const mockOrganization = { _id: 'org-1', organizationName: 'Acme Trading' };

describe('useOrganization', () => {
  beforeEach(() => {
    fetchMyOrganization.mockReset();
    saveOrganizationDetails.mockReset();
    uploadOrganizationLogo.mockReset();
    verifyKycDocument.mockReset();
  });

  it('automatically loads the organization on mount', async () => {
    fetchMyOrganization.mockResolvedValue(mockOrganization);
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.organization).toEqual(mockOrganization);
    expect(result.current.loaded).toBe(true);
  });

  it('shows a toast error when loading the organization fails', async () => {
    // The hook retries automatically while `loaded` stays false, so resolve
    // after the first rejection to avoid an infinite retry loop in the test.
    fetchMyOrganization
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValue(mockOrganization);
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Network error', { toastId: 'org-load-error' }));
    await waitFor(() => expect(result.current.loaded).toBe(true));
  });

  it('does not reload once organization data is already loaded', async () => {
    fetchMyOrganization.mockResolvedValue(mockOrganization);
    const store = createTestStore({
      tradeOrganization: { organization: mockOrganization, loading: false, loaded: true, saving: false },
    });
    renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    expect(fetchMyOrganization).not.toHaveBeenCalled();
  });

  it('saveOrganization updates the store and shows success toast', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    saveOrganizationDetails.mockResolvedValue({ ...mockOrganization, organizationName: 'Updated Co' });
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let saved;
    await act(async () => {
      saved = await result.current.saveOrganization({ organizationName: 'Updated Co' });
    });

    expect(saved.organizationName).toBe('Updated Co');
    expect(result.current.organization.organizationName).toBe('Updated Co');
    expect(toast.success).toHaveBeenCalledWith('Organization details saved successfully');
  });

  it('saveOrganization shows error toast and rethrows on failure', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    saveOrganizationDetails.mockRejectedValue(new Error('Validation failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.saveOrganization({})).rejects.toThrow('Validation failed');
    });

    expect(toast.error).toHaveBeenCalledWith('Validation failed');
    expect(result.current.saving).toBe(false);
  });

  it('uploadLogo returns the logo key on success', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    uploadOrganizationLogo.mockResolvedValue('logos/org-1.png');
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let logoKey;
    await act(async () => {
      logoKey = await result.current.uploadLogo(new File(['x'], 'logo.png'));
    });

    expect(logoKey).toBe('logos/org-1.png');
  });

  it('uploadLogo shows error toast and rethrows on failure', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    uploadOrganizationLogo.mockRejectedValue(new Error('Upload failed'));
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.uploadLogo(new File(['x'], 'logo.png'))).rejects.toThrow('Upload failed');
    });

    expect(toast.error).toHaveBeenCalledWith('Upload failed');
  });

  it('verifyKyc updates organization on success', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    verifyKycDocument.mockResolvedValue({ ...mockOrganization, kycVerified: true });
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let verified;
    await act(async () => {
      verified = await result.current.verifyKyc('gstin', '27AAAAA0000A1Z5');
    });

    expect(verified.kycVerified).toBe(true);
    expect(result.current.organization.kycVerified).toBe(true);
  });

  it('verifyKyc shows error toast and rethrows on failure', async () => {
    fetchMyOrganization.mockResolvedValue(null);
    verifyKycDocument.mockRejectedValue(new Error('Invalid GSTIN'));
    const store = createTestStore();
    const { result } = renderHook(() => useOrganization(), { wrapper: wrapperFor(store) });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await expect(result.current.verifyKyc('gstin', 'invalid')).rejects.toThrow('Invalid GSTIN');
    });

    expect(toast.error).toHaveBeenCalledWith('Invalid GSTIN');
  });
});
