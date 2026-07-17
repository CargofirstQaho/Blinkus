import ComingSoonHero from './components/ComingSoonHero';
import ComingSoonGrid from './components/ComingSoonGrid';
import RoadmapSection from './components/RoadmapSection';

export default function ComingSoonPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <ComingSoonHero />
      <ComingSoonGrid />
      {/* <RoadmapSection /> */}
    </div>
  );
}
