import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchTradeDraftsApi,
  deleteTradeDraftApi,
  toggleTradeDraftFavoriteApi,
  duplicateTradeDraftApi,
} from '../services/tradeDraftsApi';
import { DOCUMENT_ROUTES, MODULE_LABELS } from '../../history/utils/historyUtils';

export const TO_HISTORY_MODULE = {
  PurchaseOrder:     'PURCHASE_ORDER',
  CreditNote:        'CREDIT_NOTE',
  DebitNote:         'DEBIT_NOTE',
  CommercialInvoice: 'COMMERCIAL_INVOICE',
  ProformaInvoice:   'PROFORMA_INVOICE',
  PackingList:       'PACKING_LIST',
  Contract:          'CONTRACT',
};

const DRAFT_TYPE_SEARCH_TOKENS = {
  Contract:           'contract ctr agreement',
  PurchaseOrder:      'purchase order po',
  CommercialInvoice:  'commercial invoice ci',
  PackingList:        'packing list pl',
  ProformaInvoice:    'proforma invoice pi',
  CreditNote:         'credit note cn',
  DebitNote:          'debit note dn',
};

export function useTradeDrafts() {
  const navigate = useNavigate();

  const [drafts, setDrafts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedType, setSelectedType]   = useState('ALL');
  const [selectedOrg, setSelectedOrg]     = useState('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortOrder, setSortOrder]         = useState('recent');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTradeDraftsApi();
      setDrafts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const organizations = useMemo(() => {
    const map = new Map();
    drafts.forEach((d) => { if (d.organization) map.set(d.organization._id, d.organization.name); });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [drafts]);

  const filteredDrafts = useMemo(() => {
    let list = drafts;

    if (selectedType !== 'ALL')   list = list.filter((d) => d.documentType === selectedType);
    if (selectedOrg !== 'ALL')    list = list.filter((d) => d.organization?._id === selectedOrg);
    if (onlyFavorites)            list = list.filter((d) => d.favorite);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().replace(/\s+/g, ' ').toLowerCase();
      list = list.filter((d) =>
        (d.title || '').toLowerCase().includes(q) ||
        (d.documentNumber || '').toLowerCase().includes(q) ||
        (d.organization?.name || '').toLowerCase().includes(q) ||
        (DRAFT_TYPE_SEARCH_TOKENS[d.documentType] || '').includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sortOrder === 'oldest')  return new Date(a.updatedAt) - new Date(b.updatedAt);
      if (sortOrder === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    return list;
  }, [drafts, selectedType, selectedOrg, onlyFavorites, searchQuery, sortOrder]);

  const openDraft = useCallback((draft) => {
    const historyModule = TO_HISTORY_MODULE[draft.documentType];
    const routes = DOCUMENT_ROUTES[historyModule];
    if (!routes) return;
    navigate(`${routes.form}?id=${draft.documentId}`);
  }, [navigate]);

  const deleteDraft = useCallback(async (id) => {
    await deleteTradeDraftApi(id);
    setDrafts((prev) => prev.filter((d) => d._id !== id));
  }, []);

  const duplicateDraft = useCallback(async (draft) => {
    await duplicateTradeDraftApi(draft.documentType, draft.documentId);
    await load();
  }, [load]);

  const toggleFavorite = useCallback(async (id) => {
    setDrafts((prev) => prev.map((d) => (d._id === id ? { ...d, favorite: !d.favorite } : d)));
    try {
      await toggleTradeDraftFavoriteApi(id);
    } catch (err) {
      setDrafts((prev) => prev.map((d) => (d._id === id ? { ...d, favorite: !d.favorite } : d)));
    }
  }, []);

  const moduleLabel = useCallback(
    (documentType) => MODULE_LABELS[TO_HISTORY_MODULE[documentType]] || documentType,
    []
  );

  return {
    drafts: filteredDrafts,
    totalCount: drafts.length,
    loading,
    error,
    organizations,
    searchQuery, setSearchQuery,
    selectedType, setSelectedType,
    selectedOrg, setSelectedOrg,
    onlyFavorites, setOnlyFavorites,
    sortOrder, setSortOrder,
    openDraft,
    deleteDraft,
    duplicateDraft,
    toggleFavorite,
    moduleLabel,
    refresh: load,
  };
}
