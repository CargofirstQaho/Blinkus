import {
  Truck, MapPin, ShieldCheck, PackageCheck,
  ScanLine, BarChart3, RefreshCcw, FileText, ClipboardCheck,
} from 'lucide-react';
import TradePage from '../../../../components/shared/TradePage';

const features = [
  {
    icon: MapPin,
    title: 'Transport Details',
    description: 'Capture transporter name, vehicle number, and GR/RR number for road, rail, air, and ship movements.',
  },
  {
    icon: ShieldCheck,
    title: 'GST Compliance',
    description: 'Auto-validate GSTIN of consignor and consignee and generate Part-A and Part-B of e-Way bill.',
  },
  {
    icon: PackageCheck,
    title: 'Shipment Tracking',
    description: 'Track consignment status with real-time updates from GSTN portal against e-Way bill number.',
  },
  {
    icon: ScanLine,
    title: 'QR Code Generation',
    description: 'Auto-generate QR code embedded in the printed e-Way bill for checkpoint verification.',
  },
  {
    icon: RefreshCcw,
    title: 'Extension & Cancellation',
    description: 'Extend validity before expiry or cancel within 24 hours if the movement is aborted.',
  },
  {
    icon: BarChart3,
    title: 'Consolidated e-Way Bills',
    description: 'Merge multiple e-Way bills into a single consolidated bill for bulk shipments.',
  },
];

const workflow = [
  { icon: FileText,      title: 'Create Invoice',      description: 'Raise tax invoice for the goods'       },
  { icon: Truck,         title: 'Enter Transport',      description: 'Add vehicle and transporter details'   },
  { icon: ShieldCheck,   title: 'Generate e-Way Bill',  description: 'Submit to GSTN and receive EWB number' },
  { icon: ClipboardCheck, title: 'Print & Dispatch',   description: 'Attach bill and release goods'          },
];

const automation = [
  { title: 'Auto e-Way bill on invoice creation',    description: 'Trigger NIC API call when invoice is saved'         },
  { title: 'Threshold value detection',              description: 'Alert when consignment value crosses Rs. 50,000'     },
  { title: 'Validity expiry notifications',          description: 'Remind transporter 6 hours before EWB expires'      },
  { title: 'Vehicle number auto-populate',           description: 'Pull vehicle details from registered fleet'          },
  { title: 'Multi-vehicle consignment splitting',    description: 'Split single EWB across multiple vehicles'           },
  { title: 'Returns and rejection e-Way bills',      description: 'Auto-generate reverse movement bills'                },
];

export default function EWayBillPage() {
  return (
    <TradePage
      icon={Truck}
      title="E-Way Bill"
      description="Generate, manage, and track GST-compliant electronic way bills for domestic goods movement with direct GSTN integration and real-time validation."
      features={features}
      workflow={workflow}
      automation={automation}
    />
  );
}
