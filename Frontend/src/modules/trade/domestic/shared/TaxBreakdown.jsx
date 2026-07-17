function TRow({ label, value, bold, indent, highlight }) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${indent ? 'pl-4' : ''}`}
      style={{ borderBottom: '1px solid #f1f5f9' }}
    >
      <span className="text-xs" style={{ color: bold ? '#0f172a' : '#64748b' }}>{label}</span>
      <span
        className="text-xs tabular-nums"
        style={{ fontWeight: bold ? 700 : 500, color: highlight ? '#2563eb' : '#334155' }}
      >
        {value}
      </span>
    </div>
  );
}

export default function TaxBreakdown({ subtotal, cgst, sgst, igst, totalTax, grandTotal, taxType, otherCharges = 0 }) {
  const other = parseFloat(otherCharges) || 0;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <div className="px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Calculation Summary</p>
      </div>
      <div className="px-4 py-1">
        <TRow label="Taxable Amount (Subtotal)" value={subtotal.toFixed(2)} />
        {taxType === 'cgst_sgst' ? (
          <>
            <TRow label="CGST" value={`+ ${cgst.toFixed(2)}`} indent />
            <TRow label="SGST" value={`+ ${sgst.toFixed(2)}`} indent />
          </>
        ) : (
          <TRow label="IGST" value={`+ ${igst.toFixed(2)}`} indent />
        )}
        {other > 0 && <TRow label="Other Charges / Freight" value={`+ ${other.toFixed(2)}`} />}
      </div>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'rgba(37,99,235,0.04)', borderTop: '2px solid #e2e8f0' }}>
        <span className="text-sm font-bold" style={{ color: '#0f172a' }}>Grand Total</span>
        <span className="text-xl font-bold tabular-nums" style={{ color: '#2563eb' }}>
          {grandTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
