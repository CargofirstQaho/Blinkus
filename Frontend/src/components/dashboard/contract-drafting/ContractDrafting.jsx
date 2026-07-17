import ContractHero from './components/ContractHero';
import PreviewSection from './sections/PreviewSection';
import FeaturesSection from './sections/FeaturesSection';
import WorkflowSection from './sections/WorkflowSection';

export default function ContractDrafting() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <ContractHero />
      <PreviewSection />
      <FeaturesSection />
      <WorkflowSection />
    </div>
  );
}
