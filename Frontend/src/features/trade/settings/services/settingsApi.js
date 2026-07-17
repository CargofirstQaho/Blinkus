import { apiFetch } from '@/src/lib/apiFetch.js';

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

async function parse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'An unexpected error occurred.');
  return data;
}

export async function apiGetPaymentHistory(page = 1, limit = 10) {
  const res = await apiFetch(`${BASE}/payment/history?page=${page}&limit=${limit}`);
  return parse(res);
}

export async function apiGetCurrentSubscription() {
  const res = await apiFetch(`${BASE}/payment/current-subscription`);
  return parse(res);
}
