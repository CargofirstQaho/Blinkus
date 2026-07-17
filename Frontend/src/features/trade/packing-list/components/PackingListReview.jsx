import { LIGHT, BORDER, GRAD, TEXT, MUTED, BRAND } from './FormUI';
import { computePackingTotals } from '../constants/packingListOptions';

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

function fmtNum(n) {
  const v = parseFloat(n) || 0;
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

export default function PackingListReview({ packingList, org }) {
  const pl    = packingList || {};
  const pli   = pl.packingListInfo || {};
  const exp   = pl.exporterDetails || {};
  const buyer = pl.buyerDetails    || {};
  const cn    = pl.consignee       || {};
  const ship  = pl.shippingDetails || {};
  const items = pl.packingItems    || [];

  const totals = computePackingTotals(items);

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
            PACKING LIST
          </span>
          <p className="text-xs mt-1.5 font-mono" style={{ color: MUTED }}>{pl.packingListNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="PACKING LIST INFORMATION">
          <InfoRow label="PL Number"       value={pl.packingListNumber} />
          <InfoRow label="Date"            value={fmtDate(pli.date)} />
          <InfoRow label="Contract Number" value={pl.contractNumber} />
          <InfoRow label="Status"          value={pl.status} />
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

        <Box title="CONSIGNEE">
          <InfoRow label="Name"    value={cn.name} />
          <InfoRow label="Country" value={cn.country} />
          <InfoRow label="Phone"   value={cn.phone} />
          <InfoRow label="Email"   value={cn.email} />
          <InfoRow label="Address" value={cn.address} />
        </Box>

        <Box title="SHIPPING DETAILS">
          <InfoRow label="Port Of Loading"   value={ship.portOfLoading} />
          <InfoRow label="Port Of Discharge" value={ship.portOfDischarge} />
          <InfoRow label="Vessel"            value={ship.vessel} />
          <InfoRow label="Container Number"  value={ship.containerNumber} />
          <InfoRow label="Seal Number"       value={ship.sealNumber} />
        </Box>
      </div>

      <Box title="PACKING & GOODS DETAILS">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: GRAD }}>
                {['#', 'Marks & Nos', 'Description Of Goods', 'HSN Code', 'Pkgs', 'Net Wt (KG)', 'Gross Wt (KG)', 'Quantity'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-bold text-white whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F0F7FF', borderBottom: `1px solid ${BORDER}` }}>
                  <td className="px-3 py-2 text-xs" style={{ color: MUTED }}>{i + 1}</td>
                  <td className="px-3 py-2 font-medium" style={{ color: TEXT }}>{it.marksAndNumbers}</td>
                  <td className="px-3 py-2" style={{ color: TEXT }}>{it.commodity}{it.description ? ` — ${it.description}` : ''}</td>
                  <td className="px-3 py-2 text-center" style={{ color: MUTED }}>{it.hsnCode || '—'}</td>
                  <td className="px-3 py-2 text-center" style={{ color: TEXT }}>{fmtNum(it.numberOfPackages)} {it.packagingType}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{fmtNum(it.netWeight)}</td>
                  <td className="px-3 py-2 text-right" style={{ color: TEXT }}>{fmtNum(it.grossWeight)}</td>
                  <td className="px-3 py-2 text-right font-semibold" style={{ color: BRAND }}>{fmtNum(it.quantity)} {it.unit}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: LIGHT, borderTop: `2px solid ${BORDER}` }}>
                <td colSpan={4} className="px-3 py-2 text-right font-bold text-xs" style={{ color: BRAND }}>TOTAL</td>
                <td className="px-3 py-2 text-center font-bold text-sm" style={{ color: BRAND }}>{fmtNum(totals.totalNumberOfPackages)}</td>
                <td className="px-3 py-2 text-right font-bold text-sm" style={{ color: BRAND }}>{fmtNum(totals.totalNetWeight)}</td>
                <td className="px-3 py-2 text-right font-bold text-sm" style={{ color: BRAND }}>{fmtNum(totals.totalGrossWeight)}</td>
                <td className="px-3 py-2 text-right font-bold text-sm" style={{ color: BRAND }}>{fmtNum(totals.totalQuantity)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Box>

      <Box title="REMARKS & TERMS">
        <InfoRow label="Remarks"            value={pl.remarks} />
        <InfoRow label="Terms & Conditions" value={pl.termsAndConditions} />
      </Box>
    </div>
  );
}
