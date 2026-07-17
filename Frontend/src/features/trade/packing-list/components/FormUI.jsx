export const BRAND  = '#2563EB';
export const BRAND2 = '#1D4ED8';
export const LIGHT  = '#EFF6FF';
export const BORDER = '#BFDBFE';
export const TEXT   = '#0F172A';
export const MUTED  = '#64748B';
export const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';

export function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold" style={{ color: '#374151' }}>
          {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}

export function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${BORDER}`, background: '#fff' }}>
      <div className="flex items-center gap-2.5 px-5 py-3.5" style={{ background: GRAD, borderBottom: `1px solid ${BORDER}` }}>
        {Icon && <Icon size={15} color="#fff" strokeWidth={2.5} />}
        <span className="font-bold text-sm tracking-wide text-white">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function inputCls(hasError) {
  return `w-full px-3 py-2 rounded-lg text-sm outline-none transition-all border ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-100'
      : 'border-blue-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;
}

export function sanitizeNumber(raw) {
  return raw.replace(/[^0-9.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1');
}
