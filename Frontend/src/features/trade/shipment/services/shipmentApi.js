import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getShipmentOverviewApi(contractId) {
  const res = await apiFetch(`${BACKEND_URL}/api/trade/contracts/${contractId}/shipment`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || 'Failed to load shipment');
  return body.data;
}
