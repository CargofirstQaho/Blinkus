import { AlertCircle } from 'lucide-react';

export default function FormField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
          {label}
          {required && <span style={{ color: '#dc2626' }}> *</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-[11px] flex items-center gap-1" style={{ color: '#dc2626' }}>
          <AlertCircle size={10} className="shrink-0" />
          {error.message}
        </p>
      )}
    </div>
  );
}
