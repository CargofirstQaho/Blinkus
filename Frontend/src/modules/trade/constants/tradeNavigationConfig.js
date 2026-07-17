import {
  ClipboardList, FileMinus, FilePlus, Truck,
  ScrollText, Receipt, Package, FileCheck2,
  MapPin, Globe,
} from 'lucide-react';

export const TRADE_NAV_CONFIG = {
  domestic: {
    icon: MapPin,
    label: 'Domestic',
    basePath: '/trade/domestic',
    items: [
      { id: 'purchase-order', to: '/trade/domestic/purchase-order', label: 'Purchase Order', icon: ClipboardList },
      { id: 'credit-note',    to: '/trade/domestic/credit-note',    label: 'Credit Note',    icon: FileMinus    },
      { id: 'debit-note',     to: '/trade/domestic/debit-note',     label: 'Debit Note',     icon: FilePlus     },
      // { id: 'e-way-bill',     to: '/trade/domestic/e-way-bill',     label: 'E-Way Bill',     icon: Truck        },
    ],
  },
  international: {
    icon: Globe,
    label: 'International',
    basePath: '/trade/international',
    items: [
      { id: 'contract-drafting',  to: '/trade/international/contract-drafting',  label: 'Contract Drafting',  icon: ScrollText  },
      { id: 'proforma-invoice',   to: '/trade/international/proforma-invoice',   label: 'Proforma Invoice',   icon: Receipt     },
      { id: 'packing-list',       to: '/trade/international/packing-list',       label: 'Packing List',       icon: Package     },
      { id: 'commercial-invoice', to: '/trade/international/commercial-invoice', label: 'Commercial Invoice', icon: FileCheck2  },
    ],
  },
};
