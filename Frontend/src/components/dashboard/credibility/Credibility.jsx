import CredibilityHero from './components/CredibilityHero';
import IntegrationsSection from './sections/IntegrationsSection';
import VerificationSection from './sections/VerificationSection';
import FutureIntegrationsSection from './sections/FutureIntegrationsSection';

export default function Credibility() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <CredibilityHero />
      <IntegrationsSection />
      <VerificationSection />
      <FutureIntegrationsSection />
    </div>
  );
}
