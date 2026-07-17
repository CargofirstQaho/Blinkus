import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchMyTradeActivity({ page = 1, limit = 100 } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await apiFetch(`${BACKEND_URL}/api/audit/my-activity?${params}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Failed to load trade activity');
  return body.data;
}
