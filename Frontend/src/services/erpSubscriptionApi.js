import { apiFetch } from '../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/erp/subscription`;

export async function fetchErpSubscriptionStatus() {
  const res = await apiFetch(`${BASE}/status`);
  if (!res.ok) throw new Error('Failed to load subscription status');
  return res.json();
}

export async function fetchErpPlans() {
  const res = await apiFetch(`${BASE}/plans`);
  if (!res.ok) throw new Error('Failed to load ERP plans');
  return res.json();
}

export async function fetchErpHistory() {
  const res = await apiFetch(`${BASE}/history`);
  if (!res.ok) throw new Error('Failed to load plan history');
  return res.json();
}

export async function fetchPricingPlans() {
  const res = await apiFetch(`${BASE}/pricing`);
  if (!res.ok) throw new Error('Failed to load pricing');
  return res.json();
}

export async function createErpOrder(planType) {
  const res = await apiFetch(`${BASE}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planType }),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}
