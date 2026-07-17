import {
  CreditCard,
  Ship,
  Globe,
  Banknote,
  Scale,
  Umbrella,
  BarChart3,
} from 'lucide-react';
import VerificationInfoCard from '../components/VerificationInfoCard';

const CAPABILITIES = [
  {
    icon:        CreditCard,
    title:       'Live Credit Scores',
    description: 'Real-time business credit ratings pulled from D&B, Experian, and regional credit bureaus.',
  },
  {
    icon:        Ship,
    title:       'Shipment Risk Analysis',
    description: 'Route and carrier risk scoring based on historical trade data and geopolitical indices.',
  },
  {
    icon:        Globe,
    title:       'Country Risk Intelligence',
    description: 'Sovereign risk ratings, sanction exposure, and political stability scores per trade nation.',
  },
  {
    icon:        Banknote,
    title:       'Payment Behavior',
    description: 'Historical payment performance and days-past-due analytics for trade counterparties.',
  },
  {
    icon:        Scale,
    title:       'Legal Disputes',
    description: 'Active litigation, arbitration filings, and regulatory enforcement action monitoring.',
  },
  {
    icon:        Umbrella,
    title:       'Trade Insurance Eligibility',
    description: 'Automated eligibility checks for ECGC policies, COFACE cover, and export credit facilities.',
  },
  {
    icon:        BarChart3,
    title:       'Financial Credibility Scoring',
    description: 'Composite financial health scores derived from audit reports, GST filings, and annual returns.',
  },
];

export default function FutureIntegrationsSection() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
      <div className="p-5 sm:p-6 border-b border-black/5">
        <h2 className="font-display font-bold text-base text-black mb-1">
          Trade assurance and credibility monitoring features are coming soon.
        </h2>
        <p className="text-xs text-black/50">
          Intelligence capabilities powered by live data feeds across global trade risk providers.
        </p>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {CAPABILITIES.map((item) => (
          <VerificationInfoCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
