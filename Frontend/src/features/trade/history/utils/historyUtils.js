export const TRADE_MODULES = new Set([
  'PURCHASE_ORDER', 'CREDIT_NOTE', 'DEBIT_NOTE',
  'PROFORMA_INVOICE', 'PACKING_LIST', 'COMMERCIAL_INVOICE',
  'CONTRACT', 'ORGANIZATION',
]);

export const EXCLUDED_ACTIONS = new Set([
  'ORGANIZATION_LOGO_UPLOADED',
]);

export const TRADE_DOC_MODULES = [
  'PURCHASE_ORDER', 'CREDIT_NOTE', 'DEBIT_NOTE',
  'PROFORMA_INVOICE', 'PACKING_LIST', 'COMMERCIAL_INVOICE', 'CONTRACT',
];

export const MODULE_LABELS = {
  PURCHASE_ORDER:     'Purchase Order',
  CREDIT_NOTE:        'Credit Note',
  DEBIT_NOTE:         'Debit Note',
  PROFORMA_INVOICE:   'Proforma Invoice',
  PACKING_LIST:       'Packing List',
  COMMERCIAL_INVOICE: 'Commercial Invoice',
  CONTRACT:           'Contract',
  ORGANIZATION:       'Organization',
};

export const MODULE_COLORS = {
  PURCHASE_ORDER:     '#2563eb',
  CREDIT_NOTE:        '#7c3aed',
  DEBIT_NOTE:         '#0891b2',
  PROFORMA_INVOICE:   '#dc2626',
  PACKING_LIST:       '#7c3aed',
  COMMERCIAL_INVOICE: '#0369a1',
  CONTRACT:           '#d97706',
  ORGANIZATION:       '#059669',
};

export const DOCUMENT_ROUTES = {
  PURCHASE_ORDER: {
    form:   '/trade/domestic/purchase-order/form',
    review: (id) => `/trade/domestic/purchase-order/review?id=${id}`,
  },
  CREDIT_NOTE: {
    form:   '/trade/domestic/credit-note/form',
    review: (id) => `/trade/domestic/credit-note/review?id=${id}`,
  },
  DEBIT_NOTE: {
    form:   '/trade/domestic/debit-note/form',
    review: (id) => `/trade/domestic/debit-note/review?id=${id}`,
  },
  PROFORMA_INVOICE: {
    form:   '/trade/international/proforma-invoice/form',
    review: (id) => `/trade/international/proforma-invoice/review?id=${id}`,
  },
  PACKING_LIST: {
    form:   '/trade/international/packing-list/form',
    review: (id) => `/trade/international/packing-list/review?id=${id}`,
  },
  COMMERCIAL_INVOICE: {
    form:   '/trade/international/commercial-invoice/form',
    review: (id) => `/trade/international/commercial-invoice/review?id=${id}`,
  },
  CONTRACT: {
    form:   '/trade/international/contract-drafting/draft',
    review: (id) => `/trade/international/contract-drafting/review?id=${id}`,
  },
};

const METADATA_NUMBER_KEYS = {
  PURCHASE_ORDER:     'purchaseOrderNumber',
  CREDIT_NOTE:        'creditNoteNumber',
  DEBIT_NOTE:         'debitNoteNumber',
  PROFORMA_INVOICE:   'proformaInvoiceNumber',
  PACKING_LIST:       'packingListNumber',
  COMMERCIAL_INVOICE: 'commercialInvoiceNumber',
  CONTRACT:           'contractNumber',
};

const ACTION_SUFFIX_LABELS = {
  DRAFT_SAVED:   (mod) => `Saved ${MODULE_LABELS[mod] || mod} Draft`,
  GENERATED:     (mod) => `Generated ${MODULE_LABELS[mod] || mod}`,
  DOWNLOADED:    (mod) => `Downloaded ${MODULE_LABELS[mod] || mod}`,
  REVIEWED:      (mod) => `Reviewed ${MODULE_LABELS[mod] || mod}`,
  UPLOADED:      (mod) => `Uploaded ${MODULE_LABELS[mod] || mod}`,
  DRAFT_DELETED: (mod) => `Deleted ${MODULE_LABELS[mod] || mod} Draft`,
  CREATED:       (mod) => `Created ${MODULE_LABELS[mod] || mod}`,
  UPDATED:       (mod) => `Updated ${MODULE_LABELS[mod] || mod}`,
};

export function formatActionLabel(action, module) {
  if (!action) return 'Unknown Action';
  const prefix = module ? `${module}_` : '';
  const suffix = prefix && action.startsWith(prefix) ? action.slice(prefix.length) : action;
  const fn = ACTION_SUFFIX_LABELS[suffix];
  if (fn) return fn(module);
  return action.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getDocumentNumber(log) {
  if (!log?.metadata) return null;
  const key = METADATA_NUMBER_KEYS[log.module];
  return key ? (log.metadata[key] ?? null) : null;
}

export function getActionPriority(action) {
  if (!action) return 1;
  if (action.includes('GENERATED') || action.includes('UPLOADED') || action.includes('FINALIZED')) return 3;
  if (action.includes('DOWNLOADED') || action.includes('REVIEWED') || action.includes('CREATED') || action.includes('UPDATED')) return 2;
  if (action.includes('DRAFT_SAVED')) return 1;
  if (action.includes('DELETED')) return 0;
  return 1;
}

export function getDocumentAction(log) {
  if (!log) return null;
  const routes = DOCUMENT_ROUTES[log.module];
  if (!routes || !log.resourceId) return null;
  const { action, resourceId } = log;

  if (action.includes('GENERATED') || action.includes('UPLOADED') || action.includes('FINALIZED')) {
    return { label: 'View PDF', route: routes.review(resourceId), type: 'view' };
  }
  if (action.includes('DOWNLOADED') || action === 'CONTRACT_REVIEWED') {
    return { label: 'View PDF', route: routes.review(resourceId), type: 'view' };
  }
  if (action.includes('DRAFT_SAVED')) {
    return { label: 'Continue Editing', route: routes.form, type: 'edit' };
  }
  return null;
}

export function getShipmentAction(log) {
  if (!log) return null;
  const contractId = log.metadata?.contractId || (log.module === 'CONTRACT' ? log.resourceId : null);
  if (!contractId) return null;
  return { label: 'View Shipment', route: `/trade/shipment?id=${contractId}`, type: 'shipment' };
}

export function getDocHistoryShipmentAction(doc) {
  if (!doc) return null;
  return getShipmentAction(doc.latestLog);
}

export function getDocHistoryAction(doc) {
  if (!doc) return null;
  const routes = DOCUMENT_ROUTES[doc.module];
  if (!routes) return null;
  if (doc.priority >= 2) {
    return { label: 'View PDF', route: routes.review(doc.docId), type: 'view' };
  }
  if (doc.priority === 1) {
    return { label: 'Continue Editing', route: routes.form, type: 'edit' };
  }
  return null;
}

export function getDocStatusInfo(module, action, priority) {
  if (priority < 2) return { label: 'Draft', bg: 'rgba(100,116,139,0.12)', color: '#475569' };
  if (module === 'CONTRACT' && action && action.includes('UPLOADED') && !action.includes('GENERATED')) {
    return { label: 'Uploaded', bg: 'rgba(139,92,246,0.12)', color: '#6d28d9' };
  }
  return { label: 'Generated', bg: 'rgba(22,163,74,0.12)', color: '#15803d' };
}

export function buildDocumentGroups(allLogs) {
  const groups = {};
  for (const mod of TRADE_DOC_MODULES) groups[mod] = {};

  for (const log of allLogs) {
    if (!TRADE_DOC_MODULES.includes(log.module)) continue;
    if (!log.resourceId) continue;
    if (EXCLUDED_ACTIONS.has(log.action)) continue;

    const docId    = String(log.resourceId);
    const priority = getActionPriority(log.action);
    const docNumber = getDocumentNumber(log);
    const existing  = groups[log.module][docId];

    if (!existing) {
      groups[log.module][docId] = {
        docId,
        module:    log.module,
        latestLog: log,
        docNumber: docNumber || null,
        priority,
      };
    } else {
      if (priority > existing.priority) {
        existing.priority  = priority;
        existing.latestLog = log;
      }
      if (docNumber && !existing.docNumber) {
        existing.docNumber = docNumber;
      }
    }
  }

  const result = {};
  for (const mod of TRADE_DOC_MODULES) {
    result[mod] = Object.values(groups[mod])
      .filter((d) => d.priority > 0)
      .sort((a, b) => new Date(b.latestLog.createdAt) - new Date(a.latestLog.createdAt));
  }
  return result;
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return '—';
  const date   = new Date(dateStr);
  const now    = new Date();
  const diffMs  = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1)   return 'Just now';
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffHr  < 24)  return `${diffHr}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7)   return date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatFullDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}
