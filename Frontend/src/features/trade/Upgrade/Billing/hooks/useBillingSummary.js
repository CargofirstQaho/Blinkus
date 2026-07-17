import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectBillingSummary,
  selectBillingSummaryLoading,
  setBillingSummary,
  setBillingSummaryLoading,
  setBillingError,
} from '../store/billingSlice';
import { apiCalculateBillingSummary } from '../services/billingApi';

export function useBillingSummary() {
  const dispatch      = useDispatch();
  const summary       = useSelector(selectBillingSummary);
  const summaryLoading = useSelector(selectBillingSummaryLoading);

  const calculateSummary = useCallback(async (planType, billingAddressId) => {
    dispatch(setBillingSummaryLoading(true));
    dispatch(setBillingSummary(null));
    try {
      const data = await apiCalculateBillingSummary(planType, billingAddressId);
      dispatch(setBillingSummary(data));
      return data;
    } catch (err) {
      dispatch(setBillingError(err.message));
      return null;
    } finally {
      dispatch(setBillingSummaryLoading(false));
    }
  }, [dispatch]);

  const clearSummary = useCallback(() => {
    dispatch(setBillingSummary(null));
  }, [dispatch]);

  return { summary, summaryLoading, calculateSummary, clearSummary };
}
