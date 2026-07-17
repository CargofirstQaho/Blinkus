import { apiFetch } from '@/src/lib/apiFetch.js';

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/payment/billing`;

async function parseResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || 'An unexpected error occurred. Please try again.';
    throw new Error(message);
  }
  return data?.data;
}

export async function apiFetchBillingAddresses() {
  const res = await apiFetch(`${BASE}/getBillingAddresses`);
  return parseResponse(res);
}

export async function apiCreateBillingAddress(payload) {
  const res = await apiFetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function apiUpdateBillingAddress(addressId, payload) {
  const res = await apiFetch(`${BASE}/${addressId}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });
  return parseResponse(res);
}

export async function apiDeleteBillingAddress(addressId) {
  const res = await apiFetch(`${BASE}/${addressId}`, { method: 'DELETE' });
  return parseResponse(res);
}

export async function apiCalculateBillingSummary(planType, billingAddressId) {
  const res = await apiFetch(`${BASE}/calculate-summary`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ planType, billingAddressId }),
  });
  return parseResponse(res);
}
