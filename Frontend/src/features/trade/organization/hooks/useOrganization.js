import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchMyOrganization,
  saveOrganizationDetails,
  uploadOrganizationLogo,
  verifyKycDocument,
} from '../services/organizationApi';
import {
  setOrganization,
  setOrganizationLoading,
  setOrganizationSaving,
  setOrganizationError,
  selectOrganization,
  selectOrganizationLoading,
  selectOrganizationLoaded,
  selectOrganizationSaving,
  selectOrganizationError,
} from '../store/organizationSlice';

/**
 * @param {{ enabled?: boolean }} options
 *   enabled – set to false to suppress the auto-fetch (e.g. for free users who
 *   cannot access the organization API). Defaults to true.
 */
export function useOrganization({ enabled = true } = {}) {
  const dispatch     = useDispatch();
  const organization = useSelector(selectOrganization);
  const loading      = useSelector(selectOrganizationLoading);
  const loaded       = useSelector(selectOrganizationLoaded);
  const saving       = useSelector(selectOrganizationSaving);
  const error        = useSelector(selectOrganizationError);

  const loadOrganization = useCallback(async () => {
    dispatch(setOrganizationLoading(true));
    try {
      const org = await fetchMyOrganization();
      dispatch(setOrganization(org));
    } catch (err) {
      // setOrganizationError marks loaded=true so this effect never re-runs
      // automatically. The toast uses a stable toastId to prevent duplicates.
      dispatch(setOrganizationError(err.message || 'Failed to load organization'));
      toast.error(err.message || 'Failed to load organization', { toastId: 'org-load-error' });
    }
  }, [dispatch]);

  // Only fires when enabled changes to true or when loaded resets to false
  // (e.g. after clearOrganization on logout). Loading state is deliberately
  // excluded from deps — it is not a trigger, it is a derived value.
  useEffect(() => {
    if (enabled && !loaded) {
      loadOrganization();
    }
  }, [enabled, loaded, loadOrganization]);

  const saveOrganization = useCallback(async (payload) => {
    dispatch(setOrganizationSaving(true));
    try {
      const org = await saveOrganizationDetails(payload);
      dispatch(setOrganization(org));
      toast.success('Organization details saved successfully');
      return org;
    } catch (err) {
      toast.error(err.message || 'Failed to save organization details');
      throw err;
    } finally {
      dispatch(setOrganizationSaving(false));
    }
  }, [dispatch]);

  const uploadLogo = useCallback(async (file) => {
    try {
      return await uploadOrganizationLogo(file);
    } catch (err) {
      toast.error(err.message || 'Failed to upload logo');
      throw err;
    }
  }, []);

  const verifyKyc = useCallback(async (field, number) => {
    try {
      const org = await verifyKycDocument(field, number);
      dispatch(setOrganization(org));
      return org;
    } catch (err) {
      toast.error(err.message || 'Verification request failed');
      throw err;
    }
  }, [dispatch]);

  return {
    organization,
    loading,
    loaded,
    saving,
    error,
    loadOrganization,
    saveOrganization,
    uploadLogo,
    verifyKyc,
  };
}
