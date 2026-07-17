import { apiFetch } from '../../../../lib/apiFetch';
import {
  fetchMyOrganization,
  saveOrganizationDetails,
  uploadOrganizationLogo,
  verifyKycDocument,
} from './organizationApi';

jest.mock('../../../../lib/apiFetch', () => ({
  apiFetch: jest.fn(),
}));

function mockResponse(ok, data, message) {
  return {
    ok,
    json: jest.fn().mockResolvedValue({ data, message }),
  };
}

describe('organizationApi', () => {
  beforeEach(() => {
    apiFetch.mockReset();
  });

  describe('fetchMyOrganization', () => {
    it('returns organization data on success', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { organization: { _id: 'org-1', organizationName: 'Acme' } }));
      const result = await fetchMyOrganization();
      expect(result).toEqual({ _id: 'org-1', organizationName: 'Acme' });
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('/api/trade/organization/'));
    });

    it('returns null when organization missing from response', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const result = await fetchMyOrganization();
      expect(result).toBeNull();
    });

    it('throws fallback error message on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}));
      await expect(fetchMyOrganization()).rejects.toThrow('Failed to load organization');
    });

    it('throws server-provided error message on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Org not found'));
      await expect(fetchMyOrganization()).rejects.toThrow('Org not found');
    });

    it('handles non-JSON response body gracefully', async () => {
      apiFetch.mockResolvedValue({ ok: false, json: jest.fn().mockRejectedValue(new Error('bad json')) });
      await expect(fetchMyOrganization()).rejects.toThrow('Failed to load organization');
    });
  });

  describe('saveOrganizationDetails', () => {
    const payload = { organizationName: 'Acme Trading', organizationEmail: 'a@acme.com' };

    it('sends PUT request with JSON payload', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { organization: { ...payload, _id: 'org-1' } }));
      const result = await saveOrganizationDetails(payload);
      expect(result).toEqual({ ...payload, _id: 'org-1' });
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/trade/organization/'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      );
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Validation failed'));
      await expect(saveOrganizationDetails(payload)).rejects.toThrow('Validation failed');
    });
  });

  describe('uploadOrganizationLogo', () => {
    it('sends a multipart form with the file and returns logoKey', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { logoKey: 'logos/org-1.png' }));
      const file = new File(['content'], 'logo.png', { type: 'image/png' });
      const result = await uploadOrganizationLogo(file);
      expect(result).toBe('logos/org-1.png');

      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/organization/logo');
      expect(options.method).toBe('POST');
      expect(options.body).toBeInstanceOf(FormData);
      expect(options.body.get('logo')).toBe(file);
    });

    it('returns null when logoKey missing', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, {}));
      const file = new File(['content'], 'logo.png', { type: 'image/png' });
      const result = await uploadOrganizationLogo(file);
      expect(result).toBeNull();
    });

    it('throws on failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Upload failed'));
      const file = new File(['content'], 'logo.png', { type: 'image/png' });
      await expect(uploadOrganizationLogo(file)).rejects.toThrow('Upload failed');
    });
  });

  describe('verifyKycDocument', () => {
    it('sends field and number for verification', async () => {
      apiFetch.mockResolvedValue(mockResponse(true, { organization: { kycVerified: true } }));
      const result = await verifyKycDocument('gstin', '27AAAAA0000A1Z5');
      expect(result).toEqual({ kycVerified: true });

      const [url, options] = apiFetch.mock.calls[0];
      expect(url).toContain('/api/trade/organization/kyc/verify');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ field: 'gstin', number: '27AAAAA0000A1Z5' });
    });

    it('throws on verification failure', async () => {
      apiFetch.mockResolvedValue(mockResponse(false, {}, 'Invalid GSTIN'));
      await expect(verifyKycDocument('gstin', 'invalid')).rejects.toThrow('Invalid GSTIN');
    });
  });
});
