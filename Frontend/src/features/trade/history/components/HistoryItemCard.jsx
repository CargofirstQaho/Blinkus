import { memo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FileText, Ship, Building2, Package2, Globe2, Clock, Link2 } from 'lucide-react';
import { MODULE_COLORS, MODULE_LABELS, DOCUMENT_ROUTES, formatRelativeDate, formatFullDate } from '../utils/historyUtils';
import { SHIPMENT_STATUS_STYLES } from '../utils/shipmentStatusStyles';

const BORDER = '#e2e8f0';
const MUTED  = '#64748b';
const TEXT   = '#0f172a';
const BRAND  = '#2563eb';

function Field({ icon: Icon, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-1.5 truncate">
      <Icon size={12} className="shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  );
}

function HistoryItemCard({ doc }) {
  const navigate = useNavigate();
  const color = MODULE_COLORS[doc.documentType] || BRAND;
  const label = MODULE_LABELS[doc.documentType] || doc.documentType;
  const statusStyle = SHIPMENT_STATUS_STYLES[doc.status] || SHIPMENT_STATUS_STYLES.DRAFT;
  const isContract = doc.documentType === 'CONTRACT';
  const isLinked = doc.documentType === 'COMMERCIAL_INVOICE' || doc.documentType === 'PROFORMA_INVOICE' || doc.documentType === 'PACKING_LIST';

  const open = () => {
    if (isContract) {
      navigate(`/trade/shipment?id=${doc.id}`);
      return;
    }
    if (isLinked) {
      navigate(`/trade/shipment?id=${doc.contractId}`);
      return;
    }
    const routes = DOCUMENT_ROUTES[doc.documentType];
    if (!routes) return;
    navigate(doc.status === 'GENERATED' ? routes.review(doc.id) : routes.form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-3 rounded-2xl p-4 sm:p-5 bg-white cursor-pointer transition-shadow hover:shadow-md"
      style={{ border: `1px solid ${BORDER}` }}
      onClick={open}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}>
            {isContract ? <Ship size={16} style={{ color }} /> : <FileText size={16} style={{ color }} />}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>{label}</p>
            <p className="text-sm font-bold truncate" style={{ color: TEXT }}>{doc.number || 'Untitled'}</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: statusStyle.bg, color: statusStyle.color }}>
          {statusStyle.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs" style={{ color: MUTED }}>
        <Field icon={Building2} value={doc.buyer && `Buyer: ${doc.buyer}`} />
        <Field icon={Building2} value={doc.seller && `Seller: ${doc.seller}`} />
        <Field icon={Package2} value={doc.commodity} />
        <Field icon={Globe2} value={doc.country} />
        <Field icon={Building2} value={doc.organization && `Org: ${doc.organization}`} />
      </div>

      {isLinked && doc.contractNumber && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); navigate(`/trade/shipment?id=${doc.contractId}`); }}
          className="self-start flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full transition-opacity hover:opacity-75"
          style={{ background: '#eff6ff', color: BRAND, border: '1px solid #bfdbfe' }}
        >
          <Link2 size={11} /> Linked to Contract {doc.contractNumber}
        </button>
      )}

      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #f8fafc' }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }} title={formatFullDate(doc.createdAt)}>
          <Clock size={11} className="shrink-0" />
          <span>Created {formatRelativeDate(doc.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: MUTED }} title={formatFullDate(doc.updatedAt)}>
          <Clock size={11} className="shrink-0" />
          <span>Updated {formatRelativeDate(doc.updatedAt)}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(HistoryItemCard);
