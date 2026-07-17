export default function ProgressBar({ value = 0, color = '#2563eb' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#f1f5f9' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
