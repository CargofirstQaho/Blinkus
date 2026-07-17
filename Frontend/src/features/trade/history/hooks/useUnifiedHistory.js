import { useEffect, useMemo, useState } from 'react';
import { getUnifiedHistoryApi } from '../services/shipmentHistoryApi';
import { useDebounce } from './useDebounce';

const DEFAULT_FILTERS = {
  status: '',
  documentType: '',
  dateFrom: '',
  dateTo: '',
  country: '',
  commodity: '',
  buyer: '',
  seller: '',
};

export function useUnifiedHistory() {
  const [filters, setFilters]   = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort]         = useState('newest');
  const [page, setPage]         = useState(1);
  const [limit] = useState(20);

  const [documents, setDocuments]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 350);

  const queryKey = useMemo(
    () => JSON.stringify({ filters, search: debouncedSearch, sort, page, limit }),
    [filters, debouncedSearch, sort, page, limit]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getUnifiedHistoryApi({ ...filters, search: debouncedSearch, sort, page, limit })
      .then((data) => {
        if (cancelled) return;
        setDocuments(data?.documents || []);
        setPagination(data?.pagination || null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [queryKey]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  function resetFilters() {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setPage(1);
  }

  function updateSearch(value) {
    setSearchQuery(value);
    setPage(1);
  }

  function updateSort(value) {
    setSort(value);
    setPage(1);
  }

  return {
    documents, pagination, loading, error,
    filters, updateFilter, resetFilters,
    searchQuery, setSearchQuery: updateSearch,
    sort, setSort: updateSort,
    page, setPage, limit,
  };
}
