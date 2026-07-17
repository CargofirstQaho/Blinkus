import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBillingAddresses,
  selectSelectedBillingAddress,
  selectBillingLoading,
  selectBillingError,
  setBillingAddresses,
  addBillingAddress,
  updateBillingAddressInList,
  removeBillingAddress,
  setSelectedBillingAddress,
  setBillingLoading,
  setBillingError,
  clearBillingError,
} from '../store/billingSlice';
import {
  apiFetchBillingAddresses,
  apiCreateBillingAddress,
  apiUpdateBillingAddress,
  apiDeleteBillingAddress,
} from '../services/billingApi';

export function useBillingAddresses() {
  const dispatch  = useDispatch();
  const addresses = useSelector(selectBillingAddresses);
  const selected  = useSelector(selectSelectedBillingAddress);
  const loading   = useSelector(selectBillingLoading);
  const error     = useSelector(selectBillingError);

  const loadAddresses = useCallback(async () => {
    dispatch(setBillingLoading(true));
    dispatch(clearBillingError());
    try {
      const data = await apiFetchBillingAddresses();
      dispatch(setBillingAddresses(data));
    } catch (err) {
      dispatch(setBillingError(err.message));
    } finally {
      dispatch(setBillingLoading(false));
    }
  }, [dispatch]);

  const createAddress = useCallback(async (payload) => {
    const data = await apiCreateBillingAddress(payload);
    dispatch(addBillingAddress(data));
    return data;
  }, [dispatch]);

  const updateAddress = useCallback(async (addressId, payload) => {
    const data = await apiUpdateBillingAddress(addressId, payload);
    dispatch(updateBillingAddressInList(data));
    return data;
  }, [dispatch]);

  const deleteAddress = useCallback(async (addressId) => {
    await apiDeleteBillingAddress(addressId);
    dispatch(removeBillingAddress(addressId));
  }, [dispatch]);

  const selectAddress = useCallback((address) => {
    dispatch(setSelectedBillingAddress(address));
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearBillingError());
  }, [dispatch]);

  return {
    addresses,
    selected,
    loading,
    error,
    loadAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    selectAddress,
    clearError,
  };
}
