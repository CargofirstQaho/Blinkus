import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setAiUsageLimitReached,
  clearAiUsageLimit,
  selectAiUsageLimitReached,
  selectAiUsageLimitMessage,
  selectAiUsageAttemptId,
} from '../redux/slices/aiUsageSlice';

const DEFAULT_MESSAGE = "You've reached your free AI usage limit.";

export function useAiUsageLimit() {
  const dispatch      = useDispatch();
  const limitReached  = useSelector(selectAiUsageLimitReached);
  const message       = useSelector(selectAiUsageLimitMessage);
  const attemptId     = useSelector(selectAiUsageAttemptId);

  const reportUsageResponse = useCallback((res, data) => {
    if (res.status === 429) {
      dispatch(setAiUsageLimitReached(data?.message || DEFAULT_MESSAGE));
      return true;
    }
    if (res.ok) dispatch(clearAiUsageLimit());
    return false;
  }, [dispatch]);

  const clearUsageLimit = useCallback(() => {
    dispatch(clearAiUsageLimit());
  }, [dispatch]);

  return { limitReached, message, attemptId, reportUsageResponse, clearUsageLimit };
}
