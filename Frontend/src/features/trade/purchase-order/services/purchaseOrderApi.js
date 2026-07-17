import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/purchase-orders`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function saveDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.purchaseOrder ?? null;
}

export async function getLatestDraftApi() {
  const res = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.purchaseOrder ?? null;
}

export async function getPurchaseOrderByIdApi(id) {
  const res = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load purchase order');
  return data.purchaseOrder ?? null;
}

export async function generatePdfApi(id) {
  const res = await apiFetch(`${BASE}/${id}/generate`, { method: 'POST' });
  const data = await parseOrThrow(res, 'Failed to generate PDF');
  return data.purchaseOrder ?? null;
}

export async function deleteDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}
