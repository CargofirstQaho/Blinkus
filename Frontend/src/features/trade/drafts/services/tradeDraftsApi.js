import { apiFetch } from '../../../../lib/apiFetch';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE = `${BACKEND_URL}/api/trade/drafts`;

const MODULE_API_BASE = {
  PurchaseOrder:      'purchase-orders',
  CreditNote:         'credit-notes',
  DebitNote:          'debit-notes',
  CommercialInvoice:  'commercial-invoices',
  ProformaInvoice:    'proforma-invoices',
  PackingList:        'packing-lists',
  Contract:           'contracts',
};

async function parseOrThrow(res, fallbackMessage) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.message || fallbackMessage);
  return body.data ?? {};
}

export async function fetchTradeDraftsApi(params = {}) {
  const query = new URLSearchParams();
  if (params.type) query.set('type', params.type);
  if (params.organization) query.set('organization', params.organization);
  if (params.favorite) query.set('favorite', 'true');
  if (params.search) query.set('search', params.search);

  const qs  = query.toString();
  const res = await apiFetch(`${BASE}${qs ? `?${qs}` : ''}`);
  const data = await parseOrThrow(res, 'Failed to load drafts');
  return data.drafts ?? [];
}

export async function deleteTradeDraftApi(id) {
  const res = await apiFetch(`${BASE}/${id}`, { method: 'DELETE' });
  await parseOrThrow(res, 'Failed to delete draft');
  return true;
}

export async function toggleTradeDraftFavoriteApi(id) {
  const res = await apiFetch(`${BASE}/${id}/favorite`, { method: 'PATCH' });
  const data = await parseOrThrow(res, 'Failed to update draft');
  return data.draft ?? null;
}

export async function duplicateTradeDraftApi(documentType, documentId) {
  const base = MODULE_API_BASE[documentType];
  if (!base) throw new Error('Unsupported document type');
  const res = await apiFetch(`${BACKEND_URL}/api/trade/${base}/${documentId}/duplicate`, { method: 'POST' });
  await parseOrThrow(res, 'Failed to duplicate draft');
  return true;
}
