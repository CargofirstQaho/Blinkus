import { Landmark } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function CommercialBankDetails({ register, errors }) {
  const bd = errors.bankDetails || {};

  return (
    <Section title="Bank Details" icon={Landmark}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Bank Name" required error={bd.bankName?.message}>
          <input {...register('bankDetails.bankName')} className={inputCls(!!bd.bankName)} />
        </Field>
        <Field label="Account Number" required error={bd.accountNumber?.message}>
          <input {...register('bankDetails.accountNumber')} className={inputCls(!!bd.accountNumber)} />
        </Field>
        <Field label="SWIFT" required error={bd.swift?.message}>
          <input {...register('bankDetails.swift')} className={inputCls(!!bd.swift)} style={{ textTransform: 'uppercase' }} />
        </Field>
        <Field label="IFSC" required error={bd.ifsc?.message}>
          <input {...register('bankDetails.ifsc')} className={inputCls(!!bd.ifsc)} style={{ textTransform: 'uppercase' }} />
        </Field>
      </div>
    </Section>
  );
}
