import { ROADMAP_HIGHLIGHTS } from '../data/comingSoonData';

export default function RoadmapSection() {
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-black/70">What&apos;s Coming to Blinkus</h2>
        <p className="text-xs text-black/40 mt-0.5">
          A platform built for the full trade lifecycle — from discovery to settlement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ROADMAP_HIGHLIGHTS.map((item) => (
          <div
            key={item.id}
            className="bg-gradient-to-br from-[#0a1628] to-[#1a2f5e] rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(100,149,237,0.12) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6495ED]/80 mb-2 block">
                {item.label}
              </span>
              <h3 className="text-sm font-semibold text-white mb-2">{item.headline}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
