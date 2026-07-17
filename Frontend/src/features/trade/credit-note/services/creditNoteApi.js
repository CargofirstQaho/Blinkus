import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/credit-notes`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function saveCreditNoteDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.creditNote ?? null;
}

export async function getLatestCreditNoteDraftApi() {
  const res = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.creditNote ?? null;
}

export async function getCreditNoteByIdApi(id) {
  const res = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load credit note');
  return data.creditNote ?? null;
}

export async function generateCreditNotePdfApi(id, payload) {
  const res = await apiFetch(`${BASE}/${id}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to generate PDF');
  return data.creditNote ?? null;
}

export async function deleteCreditNoteDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}
