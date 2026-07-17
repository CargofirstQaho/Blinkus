import {
  Sparkles,
  ListChecks,
  Globe,
  ShieldCheck,
  FolderOpen,
  BarChart3,
  ClipboardCheck,
  FileDown,
  PenLine,
  GitBranch,
} from 'lucide-react';
import ContractFeatureCard from '../components/ContractFeatureCard';

const FEATURES = [
  {
    icon:        Sparkles,
    title:       'AI Contract Generation',
    description: 'Generate complete, clause-level contracts from trade inputs using large language models.',
  },
  {
    icon:        ListChecks,
    title:       'Clause Recommendations',
    description: 'Smart suggestions for standard and custom trade clauses based on jurisdiction and product type.',
  },
  {
    icon:        Globe,
    title:       'Incoterm Intelligence',
    description: 'Automatic Incoterms 2020 selection and risk allocation with plain-language explanations.',
  },
  {
    icon:        ShieldCheck,
    title:       'Trade Compliance Checks',
    description: 'Real-time validation against sanctions lists, embargoes, and export control regulations.',
  },
  {
    icon:        FolderOpen,
    title:       'Multi-country Templates',
    description: 'Jurisdiction-specific contract templates covering 50+ trade nations and bilateral agreements.',
  },
  {
    icon:        BarChart3,
    title:       'Contract Risk Scoring',
    description: 'AI-powered risk scoring for payment terms, delivery clauses, and dispute resolution provisions.',
  },
  {
    icon:        ClipboardCheck,
    title:       'Digital Approval Workflows',
    description: 'Structured review and sign-off pipelines with role-based access and full audit trail.',
  },
  {
    icon:        FileDown,
    title:       'PDF Export',
    description: 'Export professionally formatted, print-ready contract PDFs with company branding.',
  },
  {
    icon:        PenLine,
    title:       'Electronic Signatures',
    description: 'Legally binding e-signatures for all parties with timestamped verification records.',
  },
  {
    icon:        GitBranch,
    title:       'Version Control',
    description: 'Full revision history, diff tracking, and rollback capability for all contract changes.',
  },
];

export default function FeaturesSection() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
      <div className="p-5 sm:p-6 border-b border-black/5">
        <h2 className="font-display font-bold text-base text-black mb-1">Platform Capabilities</h2>
        <p className="text-xs text-black/50">
           Trade contract automation — available once AI and legal integrations are live.
        </p>
      </div>
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {FEATURES.map((item) => (
          <ContractFeatureCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}
