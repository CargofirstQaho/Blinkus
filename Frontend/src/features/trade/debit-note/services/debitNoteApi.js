import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/debit-notes`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function saveDebitNoteDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.debitNote ?? null;
}

export async function getLatestDebitNoteDraftApi() {
  const res = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.debitNote ?? null;
}

export async function getDebitNoteByIdApi(id) {
  const res = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load debit note');
  return data.debitNote ?? null;
}

export async function generateDebitNotePdfApi(id, payload) {
  const res = await apiFetch(`${BASE}/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to generate PDF');
  return data.debitNote ?? null;
}

export async function deleteDebitNoteDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}
