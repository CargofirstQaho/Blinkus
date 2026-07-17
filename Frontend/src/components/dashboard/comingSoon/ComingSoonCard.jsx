import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ComingSoonCard({ module, onPreview }) {
  const navigate = useNavigate();
  const { icon: Icon, name, description, status, eta, color, route } = module;
  const isBuilding = status === 'Building';

  const handleAction = () => {
    if (route) navigate(route);
    else onPreview(module);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleAction}
      onKeyDown={(e) => e.key === 'Enter' && handleAction()}
      aria-label={`${name} — ${eta}`}
      className="group relative bg-white rounded-2xl border border-black/5 p-5 flex flex-col gap-4 cursor-pointer select-none
        hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-accent
        transition-all duration-200 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${color}0d 0%, transparent 65%)`,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: `${color}14` }}
        >
          <Icon size={21} style={{ color }} />
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0 ${
            isBuilding ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="relative flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold text-black/80 leading-snug">{name}</h3>
        <p className="text-xs text-black/42 leading-relaxed">{description}</p>
      </div>

      <div className="relative flex items-center justify-between pt-3 border-t border-black/5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="text-[11px] text-black/35 font-medium">{eta}</span>
        </div>
        <span
          className="flex items-center gap-1 text-[11px] font-semibold transition-all group-hover:gap-1.5"
          style={{ color }}
        >
          {route ? 'Preview Feature' : 'Learn More'}
          <ArrowRight size={11} />
        </span>
      </div>
    </div>
  );
}
