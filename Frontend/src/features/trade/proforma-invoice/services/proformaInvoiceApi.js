import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/proforma-invoices`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function saveProformaInvoiceDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.proformaInvoice ?? null;
}

export async function getLatestProformaInvoiceDraftApi() {
  const res = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.proformaInvoice ?? null;
}

export async function getProformaInvoiceByIdApi(id) {
  const res = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load proforma invoice');
  return data.proformaInvoice ?? null;
}

export async function generateProformaInvoicePdfApi(id, payload) {
  const res = await apiFetch(`${BASE}/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to generate PDF');
  return data.proformaInvoice ?? null;
}

export async function deleteProformaInvoiceDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}
