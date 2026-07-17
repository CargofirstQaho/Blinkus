import ComingSoonFeatureCard from './ComingSoonFeatureCard';
import { COMING_SOON_MODULES } from '../data/comingSoonData';

export default function ComingSoonGrid() {
  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-black/70">Feature Showcase</h2>
        <p className="text-xs text-black/40 mt-0.5">
          Eight intelligent trade modules in active development.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {COMING_SOON_MODULES.map((mod) => (
          <ComingSoonFeatureCard key={mod.id} module={mod} />
        ))}
      </div>
    </section>
  );
}
