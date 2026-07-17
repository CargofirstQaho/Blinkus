import { LIGHT, BORDER, GRAD, TEXT, MUTED } from './FormUI';
import GstSummaryReadOnly from '../../shared/components/GstSummaryReadOnly';

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
      <span className="text-xs font-semibold w-40 shrink-0" style={{ color: MUTED }}>{label}</span>
      <span className="text-sm" style={{ color: TEXT }}>{value}</span>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-2.5 text-xs font-bold text-white" style={{ background: GRAD }}>{title}</div>
      <div className="px-4 py-3 bg-white">{children}</div>
    </div>
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmt(n) { return (parseFloat(n) || 0).toFixed(2); }

export default function DebitNoteReview({ debitNote, org }) {
  const dn  = debitNote || {};
  const dni = dn.debitNoteInfo || {};
  const sup = dn.supplierInfo  || {};
  const sum = dn.summary       || {};
  const cur = dni.currency || 'INR';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        {org?.logoUrl && <img src={org.logoUrl} alt="logo" className="w-14 h-14 rounded-xl object-contain border-2" style={{ borderColor: BORDER }} />}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base truncate" style={{ color: TEXT }}>{org?.organizationName || '—'}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{org?.contact?.address || '—'}</p>
          <p className="text-xs truncate" style={{ color: MUTED }}>
            {[
              (org?.gstNumber || org?.kyc?.gst?.number) && `GSTIN: ${org.gstNumber || org.kyc.gst.number}`,
              org?.kyc?.pan?.number && `PAN: ${org.kyc.pan.number}`,
              org?.contact?.phone   && `Ph: ${org.contact.phone}`,
              org?.organizationEmail,
            ].filter(Boolean).join('  |  ')}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest" style={{ background: GRAD, color: '#fff' }}>
            DEBIT NOTE
          </span>
          <p className="text-xs mt-1.5 font-mono" style={{ color: MUTED }}>{dn.debitNoteNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="DEBIT NOTE INFORMATION">
          <InfoRow label="Debit Note Number"      value={dn.debitNoteNumber} />
          <InfoRow label="Debit Note Date"        value={fmtDate(dni.debitNoteDate)} />
          <InfoRow label="Reference Invoice No."  value={dni.referenceInvoiceNumber} />
          <InfoRow label="Reference Invoice Date" value={fmtDate(dni.referenceInvoiceDate)} />
          <InfoRow label="Currency"               value={dni.currency} />
          <InfoRow label="Place Of Supply"        value={dni.placeOfSupply} />
        </Box>

        <Box title="SUPPLIER INFORMATION">
          <InfoRow label="Supplier Name"    value={sup.supplierName} />
          <InfoRow label="Supplier Company" value={sup.supplierCompany} />
          <InfoRow label="GST Number"       value={sup.gstNumber} />
          <InfoRow label="Email"            value={sup.email} />
          <InfoRow label="Phone"            value={sup.phone} />
          <InfoRow label="Address"          value={sup.address} />
        </Box>
      </div>

      <Box title="LINE ITEMS">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: GRAD }}>
                {['#', 'Item Name', 'Description', 'HSN Code', 'Qty', 'Unit', 'Rate', 'Tax %', 'Tax Amount', 'Total'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-bold text-white whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(dn.lineItems || []).map((it, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F0F7FF', borderBottom: `1px solid ${BORDER}` }}>
                  <td className="px-3 py-2 text-xs" style={{ color: MUTED }}>{i + 1}</td>
                  <td className="px-3 py-2 font-medium" style={{ color: TEXT }}>{it.itemName}</td>
                  <td className="px-3 py-2" style={{ color: MUTED }}>{it.description}</td>
                  <td className="px-3 py-2 text-center" style={{ color: MUTED }}>{it.hsnCode || '—'}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{it.quantity}</td>
                  <td className="px-3 py-2 text-center" style={{ color: TEXT }}>{it.unit}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{fmt(it.rate)}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{fmt(it.taxPercent)}%</td>
                  <td className="px-3 py-2 text-right" style={{ color: MUTED }}>{fmt(it.taxAmount)}</td>
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: '#2563EB' }}>{fmt(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-1.5">
            <GstSummaryReadOnly
              subtotal={sum.subtotal}
              cgst={sum.cgst}
              sgst={sum.sgst}
              igst={sum.igst}
              grandTotal={sum.grandTotal}
              currency={cur}
            />
            <div className="flex justify-between px-3 py-2 rounded-lg font-bold" style={{ background: LIGHT, border: `1px solid ${BORDER}`, color: '#2563EB' }}>
              <span className="text-sm">Balance Due</span>
              <span className="text-sm">{cur} {fmt(sum.balanceDue)}</span>
            </div>
          </div>
        </div>
      </Box>

      <Box title="ADDITIONAL INFORMATION">
        <InfoRow label="Reason For Debit Note" value={dn.reasonForDebitNote} />
        <InfoRow label="Notes"                 value={dn.notes} />
        <InfoRow label="Terms & Conditions"    value={dn.termsAndConditions} />
      </Box>
    </div>
  );
}
