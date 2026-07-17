import { Building2 } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function CommercialExporterDetails({ register, errors }) {
  const ed = errors.exporterDetails || {};

  return (
    <Section title="Exporter Details" icon={Building2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Company Name" required error={ed.companyName?.message}>
          <input {...register('exporterDetails.companyName')} className={inputCls(!!ed.companyName)} />
        </Field>
        <Field label="Country" required error={ed.country?.message}>
          <input {...register('exporterDetails.country')} className={inputCls(!!ed.country)} />
        </Field>
        <Field label="Tax Number" required error={ed.taxNumber?.message}>
          <input {...register('exporterDetails.taxNumber')} className={inputCls(!!ed.taxNumber)} />
        </Field>
        <Field label="Email" required error={ed.email?.message}>
          <input type="email" {...register('exporterDetails.email')} className={inputCls(!!ed.email)} />
        </Field>
        <Field label="Phone" required error={ed.phone?.message}>
          <input type="tel" {...register('exporterDetails.phone')} className={inputCls(!!ed.phone)} />
        </Field>
        <Field label="Address" required error={ed.address?.message}>
          <textarea rows={2} {...register('exporterDetails.address')} className={`${inputCls(!!ed.address)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
