import {
  ScrollText, FileText, Layers, Users,
  PenLine, ShieldCheck, Globe, CheckCircle2, FilePen,
} from 'lucide-react';
import TradePage from '../../../../components/shared/TradePage';

const features = [
  {
    icon: FileText,
    title: 'Contract Generation',
    description: 'Generate professional international trade contracts from templates covering all Incoterms 2020 terms.',
  },
  {
    icon: Layers,
    title: 'Clause Management',
    description: 'Modular clause library — insert, reorder, and customize standard and custom legal clauses.',
  },
  {
    icon: Users,
    title: 'Buyer & Seller Terms',
    description: 'Define obligations, risk transfer points, payment milestones, and dispute resolution clauses.',
  },
  {
    icon: PenLine,
    title: 'Digital Signature',
    description: 'Collect legally binding e-signatures from both parties with timestamp and audit certificate.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Checks',
    description: 'Validate contracts against export control regulations, FEMA guidelines, and trade sanctions.',
  },
  {
    icon: Globe,
    title: 'Multi-Currency Terms',
    description: 'Specify payment currency, FX rate clauses, and hedging terms within the contract body.',
  },
];

const workflow = [
  { icon: FileText,    title: 'Select Template',     description: 'Choose contract type and Incoterm'   },
  { icon: Layers,      title: 'Configure Clauses',   description: 'Add, remove, and edit standard terms' },
  { icon: Users,       title: 'Send for Review',     description: 'Share draft with buyer for negotiation' },
  { icon: FilePen,     title: 'Sign & Execute',      description: 'Collect digital signatures and archive' },
];

const automation = [
  { title: 'AI clause suggestion engine',           description: 'Recommend relevant clauses based on commodity and country' },
  { title: 'Automatic Incoterm risk allocation',    description: 'Pre-fill responsibilities based on selected Incoterm'     },
  { title: 'Version history and redline comparison', description: 'Track every edit between negotiation rounds'             },
  { title: 'Deadline and milestone alerts',         description: 'Notify parties of upcoming contractual obligations'       },
  { title: 'Contract performance tracking',         description: 'Monitor shipment, payment, and delivery milestones'       },
  { title: 'Export regulation auto-check',          description: 'Flag restricted commodities or embargoed destinations'    },
];

export default function ContractDraftingPage() {
  return (
    <TradePage
      icon={ScrollText}
      title="Contract Drafting"
      description="Generate, negotiate, and execute international trade contracts with a modular clause library, Incoterms 2020 templates, and legally binding digital signatures."
      features={features}
      workflow={workflow}
      automation={automation}
    />
  );
}
