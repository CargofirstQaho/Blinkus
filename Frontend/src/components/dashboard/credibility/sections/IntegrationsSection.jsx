import IntegrationCard from '../components/IntegrationCard';

const INTEGRATIONS = [
  {
    name:        'ECGC',
    description: 'Export Credit Guarantee Corporation of India — sovereign-backed credit risk cover and buyer credit ratings for Indian exporters.',
    category:    'Credit Insurance',
  },
  // {
  //   name:        'COFACE',
  //   description: 'Global trade credit insurance and risk management covering 200+ countries with real-time business intelligence.',
  //   category:    'Trade Credit',
  // },
  // {
  //   name:        'Dun & Bradstreet',
  //   description: 'Business credit reporting and commercial data analytics across 300M+ global business entities with D-U-N-S verification.',
  //   category:    'Business Intelligence',
  // },
  // {
  //   name:        'CreditSafe',
  //   description: 'Real-time business credit scores, financial health reports, and payment behavior data for companies worldwide.',
  //   category:    'Credit Scoring',
  // },
  // {
  //   name:        'EXIM Intelligence',
  //   description: 'Export-import trade data analytics and buyer intelligence derived from global customs and shipment datasets.',
  //   category:    'Trade Analytics',
  // },
];

export default function IntegrationsSection() {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-base text-black">Upcoming Integrations</h2>
          <p className="text-xs text-black/40 mt-0.5">
            Global credibility data partners currently in development
          </p>
        </div>
        <span className="px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0">
          {INTEGRATIONS.length} Providers
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {INTEGRATIONS.map((item) => (
          <IntegrationCard key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}
