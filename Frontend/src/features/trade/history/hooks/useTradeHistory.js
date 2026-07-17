import { useState, useEffect, useMemo } from 'react';
import { fetchMyTradeActivity } from '../services/tradeHistoryApi';
import {
  TRADE_MODULES, EXCLUDED_ACTIONS, TRADE_DOC_MODULES,
  buildDocumentGroups, getActionPriority,
} from '../utils/historyUtils';

function toTradeLogs(logs) {
  return (logs || []).filter(
    (l) => TRADE_MODULES.has(l.module) && !EXCLUDED_ACTIONS.has(l.action)
  );
}

export function useTradeHistory() {
  const [allLogs, setAllLogs]       = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]           = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [sortOrder, setSortOrder]           = useState('newest');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchMyTradeActivity({ page: 1, limit: 100 })
      .then((data) => {
        if (cancelled) return;
        setAllLogs(toTradeLogs(data?.logs));
        setPagination(data?.pagination || null);
        setCurrentPage(1);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  function refresh() {
    setLoading(true);
    setError(null);
    fetchMyTradeActivity({ page: 1, limit: 100 })
      .then((data) => {
        setAllLogs(toTradeLogs(data?.logs));
        setPagination(data?.pagination || null);
        setCurrentPage(1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  async function loadMore() {
    if (loadingMore || !pagination) return;
    const nextPage = currentPage + 1;
    if (nextPage > pagination.totalPages) return;
    setLoadingMore(true);
    try {
      const data = await fetchMyTradeActivity({ page: nextPage, limit: 100 });
      setAllLogs((prev) => [...prev, ...toTradeLogs(data?.logs)]);
      setPagination(data?.pagination || null);
      setCurrentPage(nextPage);
    } catch (_) {
      // silent fail for load more
    } finally {
      setLoadingMore(false);
    }
  }

  const filteredLogs = useMemo(() => {
    let logs = allLogs;

    if (selectedModule !== 'ALL') {
      logs = logs.filter((l) => l.module === selectedModule);
    }

    if (selectedAction !== 'ALL') {
      logs = logs.filter((l) => {
        const a = l.action || '';
        if (selectedAction === 'DRAFTS')    return a.includes('DRAFT_SAVED');
        if (selectedAction === 'GENERATED') return a.includes('GENERATED') || a.includes('UPLOADED') || a.includes('FINALIZED');
        if (selectedAction === 'DOWNLOADS') return a.includes('DOWNLOADED') || a === 'CONTRACT_REVIEWED';
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      logs = logs.filter((l) => {
        const metaStr = Object.values(l.metadata || {}).join(' ').toLowerCase();
        const desc    = (l.description || '').toLowerCase();
        const mod     = (l.module || '').toLowerCase().replace(/_/g, ' ');
        const act     = (l.action || '').toLowerCase().replace(/_/g, ' ');
        return metaStr.includes(q) || desc.includes(q) || mod.includes(q) || act.includes(q);
      });
    }

    if (sortOrder === 'oldest') return [...logs].reverse();
    return logs;
  }, [allLogs, selectedModule, selectedAction, searchQuery, sortOrder]);

  const overviewStats = useMemo(() => {
    const stats = {};
    for (const mod of TRADE_DOC_MODULES) {
      const modLogs = allLogs.filter((l) => l.module === mod);
      stats[mod] = {
        generated: modLogs.filter((l) => getActionPriority(l.action) >= 3).length,
        drafted:   modLogs.filter((l) => (l.action || '').includes('DRAFT_SAVED')).length,
      };
    }
    return stats;
  }, [allLogs]);

  const documentGroups = useMemo(() => buildDocumentGroups(allLogs), [allLogs]);

  const hasMore    = pagination ? currentPage < pagination.totalPages : false;
  const totalLoaded = allLogs.length;

  return {
    loading, loadingMore, error,
    filteredLogs, overviewStats, documentGroups,
    searchQuery,    setSearchQuery,
    selectedModule, setSelectedModule,
    selectedAction, setSelectedAction,
    sortOrder,      setSortOrder,
    loadMore, hasMore, refresh,
    totalLoaded,
  };
}
