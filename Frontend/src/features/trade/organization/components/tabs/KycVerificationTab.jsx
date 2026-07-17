import { useState } from 'react';
import { ShieldCheck, CreditCard, Receipt } from 'lucide-react';
import KycFieldCard from '../verification/KycFieldCard';

const FIELDS = [
  {
    key: 'aadhaar',
    title: 'Aadhaar Number',
    description: 'Government-issued identity verification',
    icon: ShieldCheck,
    placeholder: 'Enter 12-digit Aadhaar number',
    helperText: 'Your Aadhaar number is used only for identity verification and is securely processed.',
  },
  {
    key: 'pan',
    title: 'PAN Number',
    description: 'Permanent Account Number for tax compliance',
    icon: CreditCard,
    placeholder: 'e.g. ABCDE1234F',
    helperText: 'PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).',
  },
  {
    key: 'gst',
    title: 'GST Number',
    description: 'Goods and Services Tax identification',
    icon: Receipt,
    placeholder: 'e.g. 22ABCDE1234F1Z5',
    helperText: 'GSTIN is a 15-character alphanumeric identifier issued per state of registration.',
  },
];

export default function KycVerificationTab({ organization, onVerify }) {
  const [verifyingField, setVerifyingField] = useState(null);

  const handleVerify = async (field, number) => {
    setVerifyingField(field);
    try {
      await onVerify(field, number);
    } finally {
      setVerifyingField(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ border: '1px solid rgba(37,99,235,0.18)', background: 'rgba(37,99,235,0.04)' }}
      >
        <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>KYC / KYB Verification</p>
        <p className="text-xs mt-1" style={{ color: '#64748b' }}>
          Verify your organization's identity documents to unlock the full ERP workspace. Each
          document is validated for format and then submitted for verification.
        </p>
      </div>

      {FIELDS.map((field) => (
        <KycFieldCard
          key={field.key}
          title={field.title}
          description={field.description}
          icon={field.icon}
          placeholder={field.placeholder}
          helperText={field.helperText}
          fieldData={organization?.kyc?.[field.key]}
          verifying={verifyingField === field.key}
          onVerify={(number) => handleVerify(field.key, number)}
        />
      ))}
    </div>
  );
}
