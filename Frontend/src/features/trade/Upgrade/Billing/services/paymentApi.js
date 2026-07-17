import { apiFetch } from '@/src/lib/apiFetch.js';

const BASE = `${import.meta.env.VITE_BACKEND_URL}/api/payment`;

async function parseResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || 'An unexpected error occurred. Please try again.');
  }
  return data;
}

export async function apiCreateOrder(planType, billingAddressId) {
  const res = await apiFetch(`${BASE}/create-order`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ planType, billingAddressId }),
  });
  return parseResponse(res);
}

export async function apiVerifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature) {
  const res = await apiFetch(`${BASE}/verify-payment`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ razorpay_order_id, razorpay_payment_id, razorpay_signature }),
  });
  return parseResponse(res);
}
