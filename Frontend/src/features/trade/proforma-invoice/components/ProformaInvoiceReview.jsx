import { LIGHT, BORDER, GRAD, TEXT, MUTED, BRAND } from './FormUI';

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

export default function ProformaInvoiceReview({ proformaInvoice, org }) {
  const pi   = proformaInvoice || {};
  const ii   = pi.invoiceInfo     || {};
  const exp  = pi.exporterDetails || {};
  const buyer = pi.buyerDetails   || {};
  const notify = pi.notifyParty   || {};
  const consignee = pi.consignee  || {};
  const ship = pi.shippingInfo    || {};
  const fin  = pi.financialInfo   || {};
  const bank = pi.bankInfo        || {};
  const items = pi.commercialDetails || [];
  const cur  = ii.currency || 'USD';

  const totalAmount = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);

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
              org?.contact?.phone   && `Ph: ${org.contact.phone}`,
              org?.organizationEmail,
            ].filter(Boolean).join('  |  ')}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold tracking-widest" style={{ background: GRAD, color: '#fff' }}>
            PROFORMA INVOICE
          </span>
          <p className="text-xs mt-1.5 font-mono" style={{ color: MUTED }}>{pi.proformaInvoiceNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="PROFORMA INVOICE INFORMATION">
          <InfoRow label="PI Number"       value={pi.proformaInvoiceNumber} />
          <InfoRow label="Invoice Date"    value={fmtDate(ii.invoiceDate)} />
          <InfoRow label="Currency"        value={ii.currency} />
          <InfoRow label="Contract Number" value={pi.contractNumber} />
          <InfoRow label="Status"          value={pi.status} />
        </Box>

        <Box title="EXPORTER DETAILS">
          <InfoRow label="Company Name" value={exp.companyName} />
          <InfoRow label="Country"      value={exp.country} />
          <InfoRow label="Tax Number"   value={exp.taxNumber} />
          <InfoRow label="Email"        value={exp.email} />
          <InfoRow label="Phone"        value={exp.phone} />
          <InfoRow label="Address"      value={exp.address} />
        </Box>

        <Box title="BUYER DETAILS">
          <InfoRow label="Company Name"   value={buyer.companyName} />
          <InfoRow label="Contact Person" value={buyer.contactPerson} />
          <InfoRow label="Country"        value={buyer.country} />
          <InfoRow label="Email"          value={buyer.email} />
          <InfoRow label="Phone"          value={buyer.phone} />
          <InfoRow label="Tax Number"     value={buyer.taxNumber} />
          <InfoRow label="Address"        value={buyer.address} />
        </Box>

        <Box title="NOTIFY PARTY">
          <InfoRow label="Name"    value={notify.name} />
          <InfoRow label="Country" value={notify.country} />
          <InfoRow label="Phone"   value={notify.phone} />
          <InfoRow label="Email"   value={notify.email} />
          <InfoRow label="Address" value={notify.address} />
        </Box>

        <Box title="CONSIGNEE">
          <InfoRow label="Name"    value={consignee.name} />
          <InfoRow label="Country" value={consignee.country} />
          <InfoRow label="Phone"   value={consignee.phone} />
          <InfoRow label="Email"   value={consignee.email} />
          <InfoRow label="Address" value={consignee.address} />
        </Box>

        <Box title="SHIPPING INFORMATION">
          <InfoRow label="Port Of Loading"    value={ship.portOfLoading} />
          <InfoRow label="Port Of Discharge"  value={ship.portOfDischarge} />
          <InfoRow label="Final Destination"  value={ship.finalDestination} />
          <InfoRow label="Country Of Origin"  value={ship.countryOfOrigin} />
        </Box>
      </div>

      <Box title="COMMERCIAL DETAILS">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: GRAD }}>
                {['#', 'Commodity', 'HSN Code', 'Qty', 'Unit', 'Rate', 'Amount'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-bold text-white whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F0F7FF', borderBottom: `1px solid ${BORDER}` }}>
                  <td className="px-3 py-2 text-xs" style={{ color: MUTED }}>{i + 1}</td>
                  <td className="px-3 py-2 font-medium" style={{ color: TEXT }}>{it.commodity}</td>
                  <td className="px-3 py-2 text-center" style={{ color: MUTED }}>{it.hsnCode || '—'}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{it.quantity}</td>
                  <td className="px-3 py-2 text-center" style={{ color: TEXT }}>{it.unit}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{fmt(it.rate)}</td>
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: BRAND }}>{fmt(it.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="FINANCIAL INFORMATION">
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Total Amount',             value: totalAmount, grand: false },
              { label: `Advance (${fmt(fin.advancePercent)}%)`, value: fin.advanceAmount, grand: false },
              { label: 'Balance Amount',           value: fin.balanceAmount, grand: true },
            ].map(({ label, value, grand }) => (
              <div key={label}
                className={`flex justify-between px-3 py-2 rounded-lg ${grand ? 'font-bold' : ''}`}
                style={{ background: grand ? LIGHT : '#F8FAFC', border: `1px solid ${BORDER}`, color: grand ? BRAND : TEXT }}>
                <span className="text-sm">{label}</span>
                <span className="text-sm">{cur} {fmt(value)}</span>
              </div>
            ))}
          </div>
        </Box>

        <Box title="BANK INFORMATION">
          <InfoRow label="Bank Name"      value={bank.bankName} />
          <InfoRow label="Account Number" value={bank.accountNumber} />
          <InfoRow label="IFSC"           value={bank.ifsc} />
          <InfoRow label="SWIFT"          value={bank.swift} />
        </Box>
      </div>

      <Box title="NOTES & TERMS">
        <InfoRow label="Notes"              value={pi.notes} />
        <InfoRow label="Terms & Conditions" value={pi.termsAndConditions} />
      </Box>
    </div>
  );
}
