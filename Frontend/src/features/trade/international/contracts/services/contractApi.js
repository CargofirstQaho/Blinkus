import { apiFetch } from '../../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/contracts`;

async function parseOrThrow(res, fallbackMsg) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMsg);
  return body.data ?? {};
}

export async function saveContractDraftApi(payload) {
  const res = await apiFetch(`${BASE}/draft`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save draft');
  return data.contract ?? null;
}

export async function getLatestContractDraftApi() {
  const res  = await apiFetch(`${BASE}/draft`);
  const data = await parseOrThrow(res, 'Failed to load draft');
  return data.contract ?? null;
}

export async function getContractByIdApi(id) {
  const res  = await apiFetch(`${BASE}/${id}`);
  const data = await parseOrThrow(res, 'Failed to load contract');
  return data.contract ?? null;
}

export async function listFinalizedContractsApi(opts = {}) {
  const params = opts.all ? '?all=true' : '';
  const res  = await apiFetch(`${BASE}/finalized${params}`);
  const data = await parseOrThrow(res, 'Failed to load contracts');
  return data.contracts ?? [];
}

export async function finalizeContractApi(id, payload) {
  const res = await apiFetch(`${BASE}/${id}/finalize`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to finalize contract');
  return data.contract ?? null;
}

export async function uploadContractApi(formData) {
  const res  = await apiFetch(`${BASE}/upload`, {
    method: 'POST',
    body:   formData,
  });
  const data = await parseOrThrow(res, 'Failed to upload contract');
  return data.contract ?? null;
}

export async function uploadSignedContractApi(id, formData) {
  const res  = await apiFetch(`${BASE}/${id}/upload-signed`, {
    method: 'POST',
    body:   formData,
  });
  const data = await parseOrThrow(res, 'Failed to upload signed contract');
  return data.contract ?? null;
}

export async function getShipmentApi(id) {
  const res  = await apiFetch(`${BASE}/${id}/shipment`);
  const data = await parseOrThrow(res, 'Failed to load shipment');
  return data;
}

export async function updateShipmentStatusApi(id, status) {
  const res  = await apiFetch(`${BASE}/${id}/shipment-status`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status }),
  });
  const data = await parseOrThrow(res, 'Failed to update shipment status');
  return data.contract ?? null;
}

export async function deleteContractDraftApi() {
  const res = await apiFetch(`${BASE}/draft`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}

export async function checkContractNumberApi(contractNumber, excludeId, signal) {
  const params = new URLSearchParams({ contractNumber });
  if (excludeId) params.set('excludeId', excludeId);
  const res  = await apiFetch(`${BASE}/check-number?${params.toString()}`, { signal });
  const data = await parseOrThrow(res, 'Failed to check contract number');
  return !!data.available;
}
