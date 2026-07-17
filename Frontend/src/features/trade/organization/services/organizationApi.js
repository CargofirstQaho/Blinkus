import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/organization`;

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function fetchMyOrganization() {
  const res = await apiFetch(`${BASE}/`);
  const data = await parseOrThrow(res, 'Failed to load organization');
  return data.organization ?? null;
}

export async function saveOrganizationDetails(payload) {
  const res = await apiFetch(`${BASE}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await parseOrThrow(res, 'Failed to save organization details');
  return data.organization ?? null;
}

export async function uploadOrganizationLogo(file) {
  const formData = new FormData();
  formData.append('logo', file);

  const res = await apiFetch(`${BASE}/logo`, {
    method: 'POST',
    body: formData,
  });
  const data = await parseOrThrow(res, 'Failed to upload logo');
  return data.logoKey ?? null;
}

export async function verifyKycDocument(field, number) {
  const res = await apiFetch(`${BASE}/kyc/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ field, number }),
  });
  const data = await parseOrThrow(res, 'Verification request failed');
  return data.organization ?? null;
}
