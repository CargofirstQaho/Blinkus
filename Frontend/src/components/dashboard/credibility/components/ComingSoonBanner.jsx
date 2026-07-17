import { Lock } from 'lucide-react';

export default function ComingSoonBanner() {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden z-10 flex items-center justify-center"
      style={{
        background:           'linear-gradient(145deg, rgba(8,16,50,0.66) 0%, rgba(12,28,76,0.62) 100%)',
        backdropFilter:       'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div className="text-center px-6 py-6 max-w-sm mx-auto">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border:     '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <Lock size={20} className="text-white/70" />
        </div>

        <h3 className="font-bold text-sm text-white/90 mb-2 leading-snug">
          Trade assurance and credibility monitoring features are coming soon.
        </h3>

        <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.52)' }}>
          Upcoming ECGC and global risk intelligence integrations.
        </p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(251,191,36,0.12)',
              border:     '1px solid rgba(251,191,36,0.22)',
              color:      'rgba(252,211,77,0.9)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
           Coming Soon
          </span>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"
              style={{ animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
