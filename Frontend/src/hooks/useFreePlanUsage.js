import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUsage } from '../redux/slices/authSlice';
import { selectAiUsageLimitReached } from '../redux/slices/aiUsageSlice';

function formatResetDate(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function useFreePlanUsage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const usage           = useSelector(selectUsage);
  const limitReached    = useSelector(selectAiUsageLimitReached);

  const isFreePlan = usage.aiQuestionsLimit !== null && usage.aiQuestionsLimit !== undefined;
  const visible    = isAuthenticated && isFreePlan && !limitReached;

  const resetDate = useMemo(() => formatResetDate(usage.resetsAt), [usage.resetsAt]);

  return {
    visible,
    limit:       usage.aiQuestionsLimit,
    periodLabel: usage.periodLabel,
    resetDate,
  };
}
