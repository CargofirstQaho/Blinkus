import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Ship, Loader2, AlertCircle, ArrowLeft, Building2, Package2, Globe2, CheckCircle2, XCircle, Check } from 'lucide-react';
import { useShipmentOverview } from '../../../../features/trade/shipment/hooks/useShipmentOverview';
import { useContract } from '../../../../features/trade/international/contracts/hooks/useContract';
import ShipmentDocumentCard from '../../../../features/trade/shipment/components/ShipmentDocumentCard';
import { MODULE_COLORS, MODULE_LABELS, DOCUMENT_ROUTES } from '../../../../features/trade/history/utils/historyUtils';
import { SHIPMENT_STATUS_STYLES } from '../../../../features/trade/history/utils/shipmentStatusStyles';

const BRAND  = '#2563EB';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const DARK   = '#0F172A';
const MUTED  = '#64748B';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';

const PLACEHOLDER_STAGE_TYPES = new Set([
  'QUALITY_INSPECTION',
  'CERTIFICATE_OF_ORIGIN',
  'BILL_OF_LADING',
  'INSURANCE',
  'SHIPPING',
  'PAYMENT',
  'CUSTOMS',
]);

function DocGroup({ title, moduleKey, docs, numberKey, onOpen }) {
  if (!docs || docs.length === 0) return null;
  const color = MODULE_COLORS[moduleKey] || BRAND;
  return (
    <div className="space-y-2.5">
      <p className="text-sm font-bold" style={{ color: DARK }}>{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {docs.map((doc) => (
          <ShipmentDocumentCard
            key={doc._id}
            color={color}
            label={MODULE_LABELS[moduleKey] || title}
            number={doc[numberKey]}
            status={doc.status}
            updatedAt={doc.updatedAt}
            pdfUrl={doc.pdfUrl}
            onOpen={() => onOpen(moduleKey, doc._id)}
          />
        ))}
      </div>
    </div>
  );
}

function Timeline({ stages }) {
  if (!stages || stages.length === 0) return null;
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
      <p className="text-sm font-bold mb-4" style={{ color: DARK }}>Shipment Timeline</p>
      <ol className="space-y-0">
        {stages.map((stage, idx) => {
          const isLast = idx === stages.length - 1;
          return (
            <li key={stage.stage} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={stage.completed ? { background: GRAD } : { background: '#e2e8f0' }}
                >
                  {stage.completed && <Check size={12} color="#fff" />}
                </div>
                {!isLast && <div className="w-px flex-1 my-0.5" style={{ background: stage.completed ? '#93c5fd' : '#e2e8f0', minHeight: '1.25rem' }} />}
              </div>
              <div className={isLast ? 'pb-0' : 'pb-4'}>
                <p className="text-sm font-semibold" style={{ color: stage.completed ? DARK : MUTED }}>{stage.label}</p>
                {stage.date && (
                  <p className="text-xs mt-0.5" style={{ color: MUTED }}>{new Date(stage.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ShipmentOverviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');

  const { data, loading, error, refresh } = useShipmentOverview(id);
  const { updateShipmentStatus } = useContract();
  const [updating, setUpdating] = useState(false);

  const openDocument = (moduleKey, docId) => {
    const routes = DOCUMENT_ROUTES[moduleKey];
    if (!routes) return;
    navigate(routes.review(docId));
  };

  const handleStatusChange = async (status) => {
    if (!id || updating) return;
    setUpdating(true);
    await updateShipmentStatus(id, status);
    await Promise.resolve(refresh());
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: MUTED }}>Loading shipment…</p>
      </div>
    );
  }

  if (error || !data?.contract) {
    return (
      <div className="max-w-xl mx-auto mt-16 px-4">
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="font-semibold" style={{ color: '#B91C1C' }}>{error || 'Shipment not found'}</p>
            <button onClick={() => navigate('/trade/history')} className="text-sm mt-2 underline" style={{ color: '#DC2626' }}>
              Back to Trade History
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { contract, commercialInvoices, proformaInvoices, packingLists, timeline } = data;
  const realTimeline = (timeline || []).filter((stage) => !PLACEHOLDER_STAGE_TYPES.has(stage.stage));
  const pill = SHIPMENT_STATUS_STYLES[contract.businessStatus] || SHIPMENT_STATUS_STYLES.DRAFT;
  const totalDocs = (commercialInvoices?.length || 0) + (proformaInvoices?.length || 0) + (packingLists?.length || 0);
  const country = contract.buyer?.country || contract.commodity?.originCountry || '';
  const isFinal = contract.businessStatus === 'COMPLETED' || contract.businessStatus === 'CANCELLED';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <button
        onClick={() => navigate('/trade/history')}
        className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
        style={{ color: MUTED }}
      >
        <ArrowLeft size={14} /> Back to Trade History
      </button>

      <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#fff', border: `1px solid ${BORDER}` }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: GRAD, boxShadow: '0 4px 14px rgba(37,99,235,0.25)' }}>
              <Ship size={20} color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: DARK }}>Shipment Overview</h1>
              <p className="text-xs mt-0.5 font-mono" style={{ color: MUTED }}>{contract.contractNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: pill.bg, color: pill.color }}>
              {pill.label}
            </span>
            {!isFinal && (
              <>
                <button
                  onClick={() => handleStatusChange('COMPLETED')}
                  disabled={updating}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-green-50 disabled:opacity-50"
                  style={{ border: '1px solid #bbf7d0', color: '#15803d' }}
                >
                  <CheckCircle2 size={12} /> Mark Completed
                </button>
                <button
                  onClick={() => handleStatusChange('CANCELLED')}
                  disabled={updating}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
                  style={{ border: '1px solid #fecaca', color: '#dc2626' }}
                >
                  <XCircle size={12} /> Cancel
                </button>
              </>
            )}
            {isFinal && (
              <button
                onClick={() => handleStatusChange(null)}
                disabled={updating}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hover:bg-black/5 disabled:opacity-50"
                style={{ border: `1px solid ${BORDER}`, color: MUTED }}
              >
                Reopen Shipment
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
          <div className="flex items-start gap-2.5">
            <Building2 size={14} className="mt-0.5 shrink-0" style={{ color: MUTED }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: MUTED }}>Buyer</p>
              <p className="text-sm font-semibold" style={{ color: DARK }}>{contract.buyerName || contract.buyer?.companyName || '—'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <Building2 size={14} className="mt-0.5 shrink-0" style={{ color: MUTED }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: MUTED }}>Seller</p>
              <p className="text-sm font-semibold" style={{ color: DARK }}>{contract.sellerName || contract.seller?.companyName || '—'}</p>
            </div>
          </div>
          {contract.commodity?.commodity && (
            <div className="flex items-start gap-2.5">
              <Package2 size={14} className="mt-0.5 shrink-0" style={{ color: MUTED }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: MUTED }}>Commodity</p>
                <p className="text-sm font-semibold" style={{ color: DARK }}>{contract.commodity.commodity}</p>
              </div>
            </div>
          )}
          {country && (
            <div className="flex items-start gap-2.5">
              <Globe2 size={14} className="mt-0.5 shrink-0" style={{ color: MUTED }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: MUTED }}>Country</p>
                <p className="text-sm font-semibold" style={{ color: DARK }}>{country}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Timeline stages={realTimeline} />

      <div className="space-y-2.5">
        <p className="text-sm font-bold" style={{ color: DARK }}>Contract</p>
        <ShipmentDocumentCard
          color={MODULE_COLORS.CONTRACT}
          label={MODULE_LABELS.CONTRACT}
          number={contract.contractNumber}
          status={contract.activationStatus}
          updatedAt={contract.updatedAt}
          pdfUrl={contract.pdfUrl}
          onOpen={() => navigate(`/trade/international/contract-drafting/review?id=${contract._id}`)}
        />
      </div>

      <DocGroup title="Commercial Invoices" moduleKey="COMMERCIAL_INVOICE" docs={commercialInvoices} numberKey="commercialInvoiceNumber" onOpen={openDocument} />
      <DocGroup title="Proforma Invoices"   moduleKey="PROFORMA_INVOICE"   docs={proformaInvoices}   numberKey="proformaInvoiceNumber"   onOpen={openDocument} />
      <DocGroup title="Packing Lists"       moduleKey="PACKING_LIST"       docs={packingLists}       numberKey="packingListNumber"       onOpen={openDocument} />

      {totalDocs === 0 && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl" style={{ background: LIGHT, border: `1px dashed ${BORDER}` }}>
          <p className="text-sm font-semibold" style={{ color: MUTED }}>No documents created against this contract yet</p>
        </div>
      )}

    </div>
  );
}
