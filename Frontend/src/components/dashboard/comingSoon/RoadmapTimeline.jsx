import { forwardRef } from 'react';
import { CheckCircle2, Hammer, Clock, Lightbulb } from 'lucide-react';
import { ROADMAP_PHASES } from '../coming-soon/data/comingSoonData';

const STATUS_CONFIG = {
  live:     { label: 'Live',     bg: 'bg-emerald-500',  text: 'text-white',        ring: 'ring-emerald-200', icon: CheckCircle2 },
  building: { label: 'Building', bg: 'bg-accent',       text: 'text-white',        ring: 'ring-accent/30',   icon: Hammer       },
  planned:  { label: 'Planned',  bg: 'bg-amber-400',    text: 'text-white',        ring: 'ring-amber-200',   icon: Clock        },
  vision:   { label: 'Vision',   bg: 'bg-black/10',     text: 'text-black/40',     ring: 'ring-black/10',    icon: Lightbulb    },
};

const RoadmapTimeline = forwardRef(function RoadmapTimeline(_, ref) {
  return (
    <section ref={ref} aria-label="Blinkus Product Roadmap" className="mt-8 mb-8">
      <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
        <div className="p-5 border-b border-black/5 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-black/80">Blinkus Product Roadmap</h2>
            <p className="text-xs text-black/40 mt-0.5">Our journey to a complete global trade operating system.</p>
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="hidden md:block">
            <div className="relative grid grid-cols-5 gap-2">
              <div
                className="absolute h-px bg-gradient-to-r from-emerald-300 via-accent/40 to-black/8"
                style={{ top: '20px', left: 'calc(10% + 8px)', right: 'calc(10% + 8px)' }}
              />
              {ROADMAP_PHASES.map((phase) => {
                const cfg = STATUS_CONFIG[phase.status];
                return (
                  <div key={phase.id} className="flex flex-col items-center text-center gap-3 relative z-10">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                    >
                      <cfg.icon size={16} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5 px-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-accent/55">
                        {phase.phase}
                      </span>
                      <p className="text-[11px] font-semibold text-black/72 leading-snug">{phase.title}</p>
                      <p className="text-[10px] text-black/38 leading-relaxed">{phase.description}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${
                        phase.status === 'live'     ? 'bg-emerald-50 text-emerald-600'  :
                        phase.status === 'building' ? 'bg-blue-50 text-blue-600'        :
                        phase.status === 'planned'  ? 'bg-amber-50 text-amber-600'      :
                        'bg-black/5 text-black/35'
                      }`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden space-y-0">
            {ROADMAP_PHASES.map((phase, i) => {
              const cfg = STATUS_CONFIG[phase.status];
              const isLast = i === ROADMAP_PHASES.length - 1;
              return (
                <div key={phase.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 z-10 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
                    >
                      <cfg.icon size={14} />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-black/8 my-1" />}
                  </div>
                  <div className={`flex-1 pb-5 ${isLast ? '' : ''}`}>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-accent/55 block mb-0.5">
                      {phase.phase}
                    </span>
                    <p className="text-sm font-semibold text-black/75">{phase.title}</p>
                    <p className="text-xs text-black/40 mt-1 leading-relaxed">{phase.description}</p>
                    <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 ${
                      phase.status === 'live'     ? 'bg-emerald-50 text-emerald-600'  :
                      phase.status === 'building' ? 'bg-blue-50 text-blue-600'        :
                      phase.status === 'planned'  ? 'bg-amber-50 text-amber-600'      :
                      'bg-black/5 text-black/35'
                    }`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default RoadmapTimeline;
