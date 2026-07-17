import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { COMING_SOON_MODULES } from '../coming-soon/data/comingSoonData';
import ComingSoonCard from './ComingSoonCard';
import FeaturePreviewModal from './FeaturePreviewModal';

export default function ComingSoonSection() {
  const [previewModule, setPreviewModule] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <section aria-label="Upcoming Blinkus Modules" className="mt-8 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={13} className="text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/70">
                Coming Soon
              </span>
            </div>
            <h2 className="text-lg font-bold text-black/80">Upcoming Blinkus Modules</h2>
            <p className="text-xs text-black/40 mt-1 max-w-lg leading-relaxed">
              Explore the next generation of trade intelligence tools currently being built for global traders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard/coming-soon')}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline focus-visible:outline-none focus-visible:underline"
            aria-label="View all upcoming modules"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {COMING_SOON_MODULES.map((mod) => (
            <ComingSoonCard key={mod.id} module={mod} onPreview={setPreviewModule} />
          ))}
        </div>
      </section>

      <FeaturePreviewModal module={previewModule} onClose={() => setPreviewModule(null)} />
    </>
  );
}
