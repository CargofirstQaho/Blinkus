export default function FormSection({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
        {Icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(37,99,235,0.08)' }}
          >
            <Icon size={14} style={{ color: '#2563eb' }} />
          </div>
        )}
        <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
