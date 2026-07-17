import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function buildParams(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  return search.toString();
}

export async function getUnifiedHistoryApi(params) {
  const qs = buildParams(params);
  const res  = await apiFetch(`${BACKEND_URL}/api/trade/history/documents${qs ? `?${qs}` : ''}`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Failed to load trade history');
  return body.data;
}

export async function updateShipmentStatusApi(contractId, status) {
  const res = await apiFetch(`${BACKEND_URL}/api/trade/contracts/${contractId}/shipment-status`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Failed to update shipment status');
  return body.data?.contract ?? null;
}
