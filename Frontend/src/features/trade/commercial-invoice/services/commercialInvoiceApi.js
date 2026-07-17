import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/commercial-invoices`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function saveCommercialInvoiceDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.commercialInvoice ?? null;
}

export async function getLatestCommercialInvoiceDraftApi() {
  const res = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.commercialInvoice ?? null;
}

export async function getCommercialInvoiceByIdApi(id) {
  const res = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load commercial invoice');
  return data.commercialInvoice ?? null;
}

export async function generateCommercialInvoicePdfApi(id, payload) {
  const res = await apiFetch(`${BASE}/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to generate PDF');
  return data.commercialInvoice ?? null;
}

export async function deleteCommercialInvoiceDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}
