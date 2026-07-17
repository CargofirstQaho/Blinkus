export default function IntegrationCard({ name, description, category }) {
  const monogram = name.replace(/[^A-Z&]/g, '').slice(0, 2) || name.slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-xl border border-black/5 p-4 sm:p-5 flex flex-col gap-3 hover:border-accent/25 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
          <span className="text-accent font-black text-[11px] leading-none tracking-tight select-none">
            {monogram}
          </span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">
          Upcoming
        </span>
      </div>

      <div>
        <div className="font-bold text-sm text-black mb-1">{name}</div>
        <div className="text-xs text-black/50 leading-relaxed">{description}</div>
      </div>

      {category && (
        <div className="mt-auto pt-1">
          <span className="text-[10px] font-bold text-black/25 uppercase tracking-widest">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
