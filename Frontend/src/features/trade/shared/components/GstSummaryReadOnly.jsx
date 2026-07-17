const BRAND  = '#2563eb';
const LIGHT  = '#eff6ff';
const BORDER = '#bfdbfe';
const TEXT   = '#0f172a';
const MUTED  = '#64748b';

function fmt(n) {
  return (parseFloat(n) || 0).toFixed(2);
}

export default function GstSummaryReadOnly({ subtotal, cgst, sgst, igst, grandTotal, currency, extraRows = [] }) {
  const rows = [
    { label: 'Sub Total', value: subtotal, grand: false },
    { label: 'CGST',      value: cgst,      grand: false },
    { label: 'SGST',      value: sgst,      grand: false },
    { label: 'IGST',      value: igst,      grand: false },
    ...extraRows,
    { label: 'Grand Total', value: grandTotal, grand: true },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map(({ label, value, grand }) => (
        <div key={label}
          className={`flex justify-between px-3 py-2 rounded-lg ${grand ? 'font-bold' : ''}`}
          style={{ background: grand ? LIGHT : '#F8FAFC', border: `1px solid ${BORDER}`, color: grand ? BRAND : TEXT }}>
          <span className="text-sm">{label}</span>
          <span className="text-sm">{currency} {fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}
