import { Landmark } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function ProformaBankInfo({ register, errors }) {
  const bi = errors.bankInfo || {};

  return (
    <Section title="Bank Information" icon={Landmark}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Bank Name" required error={bi.bankName?.message}>
          <input {...register('bankInfo.bankName')} className={inputCls(!!bi.bankName)} />
        </Field>
        <Field label="Account Number" required error={bi.accountNumber?.message}>
          <input {...register('bankInfo.accountNumber')} className={inputCls(!!bi.accountNumber)} />
        </Field>
        <Field label="IFSC" required error={bi.ifsc?.message}>
          <input {...register('bankInfo.ifsc')} className={inputCls(!!bi.ifsc)} style={{ textTransform: 'uppercase' }} />
        </Field>
        <Field label="SWIFT" required error={bi.swift?.message}>
          <input {...register('bankInfo.swift')} className={inputCls(!!bi.swift)} style={{ textTransform: 'uppercase' }} />
        </Field>
      </div>
    </Section>
  );
}
