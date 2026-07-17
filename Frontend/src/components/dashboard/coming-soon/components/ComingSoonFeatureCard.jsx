export default function ComingSoonFeatureCard({ module }) {
  const { icon: Icon, name, description, status, eta, color } = module;

  const isBuilding = status === 'Building';

  return (
    <div className="relative bg-white rounded-2xl border border-black/5 p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
            isBuilding
              ? 'bg-blue-50 text-blue-600'
              : 'bg-amber-50 text-amber-600'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold text-black/80 leading-snug">{name}</h3>
        <p className="text-xs text-black/45 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center gap-1.5 pt-1 border-t border-black/5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
        <span className="text-[11px] text-black/35 font-medium">{eta}</span>
      </div>
    </div>
  );
}
