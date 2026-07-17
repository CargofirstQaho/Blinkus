import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  FileText, Download, ExternalLink, Loader2, ArrowLeft, CheckCircle, AlertCircle,
} from 'lucide-react';
import { usePurchaseOrder } from '../hooks/usePurchaseOrder';
import { calcLineTotal, currencySymbol, getConversionLabel } from '../utils/purchaseOrderCalc';
import GstSummaryReadOnly from '../../shared/components/GstSummaryReadOnly';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmt(n) {
  return (parseFloat(n) || 0).toFixed(2);
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>{label}</span>
      <span className="text-sm" style={{ color: '#0f172a' }}>{value}</span>
    </div>
  );
}

function Box({ title, children, accent = false }) {
  return (
    <div className="rounded-xl p-4" style={{ background: accent ? 'linear-gradient(135deg,#eff6ff,#f0f9ff)' : '#f8fafc', border: `1px solid ${accent ? '#bfdbfe' : '#e2e8f0'}` }}>
      <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: accent ? '#2563eb' : '#64748b' }}>{title}</h3>
      {children}
    </div>
  );
}

export default function PurchaseOrderReviewPage() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const id         = params.get('id');
  const { draft, loading, generating, pdfUrl, error, loadById, generatePdf } = usePurchaseOrder();
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (id) loadById(id);
  }, [id, loadById]);

  useEffect(() => {
    if (draft?.status === 'GENERATED' && draft?.pdfUrl) {
      setConfirmed(true);
    }
  }, [draft]);

  const handleGenerate = async () => {
    if (!draft?._id) return;
    await generatePdf(draft._id);
    setConfirmed(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} style={{ color: '#2563eb' }} />
      </div>
    );
  }

  if (!draft && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <AlertCircle size={40} style={{ color: '#f59e0b' }} />
        <p className="text-sm font-medium" style={{ color: '#64748b' }}>Purchase order not found.</p>
        <button
          type="button"
          onClick={() => navigate('/trade/domestic/purchase-order')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: '#2563eb' }}
        >
          <ArrowLeft size={14} />
          Back to Form
        </button>
      </div>
    );
  }

  const po  = draft || {};
  const bd  = po.buyerDetails    || {};
  const st  = po.shipToDetails   || {};
  const od  = po.orderDetails    || {};
  const bk  = po.bankDetails     || {};
  const nt  = po.notes           || {};
  const sm  = po.summary         || {};
  const sym = currencySymbol(od.currency || 'INR');

  return (
    <div>
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8 pt-5 pb-1">
        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          <button
            type="button"
            onClick={() => navigate('/trade/domestic/purchase-order')}
            className="p-1.5 rounded-xl hover:bg-slate-100 transition-colors mr-1"
            style={{ color: '#64748b' }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}>
            <FileText size={15} color="white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0f172a' }}>Review Purchase Order</h1>
            {po.purchaseOrderNumber && <p className="text-xs font-mono" style={{ color: '#2563eb' }}>{po.purchaseOrderNumber}</p>}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>{po.purchaseOrderNumber || '—'}</span>
            <span
              className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={
                confirmed
                  ? { background: 'rgba(22,163,74,0.1)', color: '#15803d' }
                  : { background: 'rgba(100,116,139,0.1)', color: '#475569' }
              }
            >
              {confirmed ? 'GENERATED' : 'DRAFT'}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {confirmed && (pdfUrl || po.pdfUrl) ? (
              <>
                <a
                  href={pdfUrl || po.pdfUrl}
                  download
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 active:scale-[0.97]"
                  style={{ border: '1px solid #e2e8f0', color: '#475569' }}
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <a
                  href={pdfUrl || po.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97]"
                  style={{ background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">View PDF</span>
                  <span className="sm:hidden">View</span>
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
              >
                {generating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                <span>{generating ? 'Generating…' : 'Confirm & Generate PDF'}</span>
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="px-4 sm:px-6 md:px-8 pb-2 max-w-5xl mx-auto">
            <p className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>{error}</p>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-5xl mx-auto space-y-5">

        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-2xl px-5 py-4"
            style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)' }}
          >
            <CheckCircle size={20} style={{ color: '#15803d', shrink: 0 }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#15803d' }}>PDF Generated Successfully</p>
              <p className="text-xs mt-0.5" style={{ color: '#166534' }}>Your Purchase Order PDF has been generated and stored securely.</p>
            </div>
          </motion.div>
        )}

        {/* Document preview */}
        <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>

          {/* PO Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 px-6 py-5" style={{ background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#94a3b8' }}>Purchase Order</p>
              <p className="text-xl font-bold font-mono" style={{ color: '#0f172a' }}>{po.purchaseOrderNumber || '—'}</p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              {od.poDate && <p className="text-xs" style={{ color: '#64748b' }}>PO Date: <strong style={{ color: '#0f172a' }}>{fmtDate(od.poDate)}</strong></p>}
              {od.expectedDelivery && <p className="text-xs" style={{ color: '#64748b' }}>Delivery: <strong style={{ color: '#0f172a' }}>{fmtDate(od.expectedDelivery)}</strong></p>}
              {od.currency && <p className="text-xs" style={{ color: '#64748b' }}>Currency: <strong style={{ color: '#0f172a' }}>{od.currency}</strong></p>}
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">

            {/* Buyer + Ship To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Box title="Bill To / Buyer">
                <div className="space-y-2">
                  <InfoRow label="Company"     value={bd.buyerCompany}    />
                  <InfoRow label="Contact"     value={bd.buyerName}       />
                  <InfoRow label="Address"     value={[bd.buyerAddress, bd.buyerCity, bd.buyerState].filter(Boolean).join(', ')} />
                  <InfoRow label="Country"     value={bd.buyerCountry}    />
                  <InfoRow label="GST"         value={bd.buyerGstNumber}  />
                  <InfoRow label="Email"       value={bd.buyerEmail}      />
                  <InfoRow label="Phone"       value={bd.buyerPhone}      />
                </div>
              </Box>
              <Box title="Ship To">
                <div className="space-y-2">
                  <InfoRow label="Company"       value={st.companyName}   />
                  <InfoRow label="Contact"       value={st.contactPerson} />
                  <InfoRow label="Address"       value={[st.address, st.city, st.state].filter(Boolean).join(', ')} />
                  <InfoRow label="Country"       value={st.country}       />
                  <InfoRow label="Email"         value={st.email}         />
                  <InfoRow label="Phone"         value={st.phone}         />
                </div>
              </Box>
            </div>

            {/* Order Details */}
            {(od.paymentTerms || od.incoterms || od.shipmentMode || od.portOfLoading || od.portOfDischarge) && (
              <Box title="Order Details">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <InfoRow label="Payment Terms"    value={od.paymentTerms}    />
                  <InfoRow label="Incoterms"        value={od.incoterms}       />
                  <InfoRow label="Shipment Mode"    value={od.shipmentMode}    />
                  <InfoRow label="Port of Loading"  value={od.portOfLoading}   />
                  <InfoRow label="Port of Discharge"value={od.portOfDischarge} />
                </div>
              </Box>
            )}

            {/* Items table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>Line Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['#','Product','Description','HS Code','Qty','Unit','Unit Price','Tax %','Total'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left font-semibold" style={{ color: '#cbd5e1' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(po.items || []).map((it, idx) => {
                      const base  = calcLineTotal(it.quantity, it.unit, it.unitPrice, it.unitsPerPackage);
                      const total = it.total ?? (base + base * ((parseFloat(it.taxPercent) || 0) / 100));
                      const convLabel = getConversionLabel(it.quantity, it.unit, it.unitsPerPackage);
                      return (
                        <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                          <td className="px-3 py-2.5" style={{ color: '#94a3b8' }}>{idx + 1}</td>
                          <td className="px-3 py-2.5 font-medium" style={{ color: '#0f172a' }}>{it.productName}</td>
                          <td className="px-3 py-2.5" style={{ color: '#64748b' }}>{it.description || '—'}</td>
                          <td className="px-3 py-2.5 font-mono" style={{ color: '#64748b' }}>{it.hsCode || '—'}</td>
                          <td className="px-3 py-2.5 text-right">
                            {fmt(it.quantity)}
                            {convLabel && (
                              <span className="block text-[10px] font-mono" style={{ color: '#2563eb' }}>
                                {convLabel}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">{it.unit}</td>
                          <td className="px-3 py-2.5 text-right font-mono">{sym}{fmt(it.unitPrice)}</td>
                          <td className="px-3 py-2.5 text-right font-mono">{fmt(it.taxPercent)}%</td>
                          <td className="px-3 py-2.5 text-right font-mono font-semibold" style={{ color: '#0f172a' }}>{sym}{fmt(total)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-4">
                <div className="w-full max-w-xs">
                  <GstSummaryReadOnly
                    subtotal={sm.subtotal}
                    cgst={sm.cgst}
                    sgst={sm.sgst}
                    igst={sm.igst}
                    grandTotal={sm.grandTotal}
                    currency={sym}
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {(bk.bankName || bk.accountNumber) && (
              <Box title="Bank Details">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <InfoRow label="Bank Name"      value={bk.bankName}      />
                  <InfoRow label="Account Holder Name"   value={bk.accountName}   />
                  <InfoRow label="Account Number" value={bk.accountNumber} />
                  <InfoRow label="IFSC Code"      value={bk.ifsc}          />
                  <InfoRow label="SWIFT Code"     value={bk.swift}         />
                  <InfoRow label="Branch"         value={bk.branch}        />
                </div>
              </Box>
            )}

            {/* Terms */}
            {nt.termsAndConditions && (
              <Box title="Terms &amp; Conditions">
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#475569' }}>{nt.termsAndConditions}</p>
              </Box>
            )}

            {/* Signature */}
            {(nt.signatory || nt.signatoryDesignation) && (
              <div className="flex justify-end">
                <div className="rounded-xl p-4 text-center w-48" style={{ border: '1px solid #e2e8f0' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-wider mb-6" style={{ color: '#94a3b8' }}>Authorized Signatory</p>
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8 }}>
                    <p className="text-xs font-bold" style={{ color: '#0f172a' }}>{nt.signatory}</p>
                    {nt.signatoryDesignation && <p className="text-[10px] mt-0.5" style={{ color: '#64748b' }}>{nt.signatoryDesignation}</p>}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom CTA */}
        {!confirmed && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1px solid #bfdbfe' }}>
            <div>
              <p className="text-sm font-bold" style={{ color: '#0f172a' }}>Ready to generate the PDF?</p>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Review the details above, then click Confirm to generate a print-ready A4 PDF.</p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
            >
              {generating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              {generating ? 'Generating…' : 'Confirm & Generate PDF'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
