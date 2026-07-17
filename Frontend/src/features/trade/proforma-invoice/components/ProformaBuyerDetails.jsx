import { Users } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function ProformaBuyerDetails({ register, errors }) {
  const bd = errors.buyerDetails || {};

  return (
    <Section title="Buyer Details" icon={Users}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Company Name" required error={bd.companyName?.message}>
          <input {...register('buyerDetails.companyName')} className={inputCls(!!bd.companyName)} />
        </Field>
        <Field label="Contact Person" required error={bd.contactPerson?.message}>
          <input {...register('buyerDetails.contactPerson')} className={inputCls(!!bd.contactPerson)} />
        </Field>
        <Field label="Country" required error={bd.country?.message}>
          <input {...register('buyerDetails.country')} className={inputCls(!!bd.country)} />
        </Field>
        <Field label="Email" required error={bd.email?.message}>
          <input type="email" {...register('buyerDetails.email')} className={inputCls(!!bd.email)} />
        </Field>
        <Field label="Phone" required error={bd.phone?.message}>
          <input type="tel" {...register('buyerDetails.phone')} className={inputCls(!!bd.phone)} />
        </Field>
        <Field label="Tax Number" required error={bd.taxNumber?.message}>
          <input {...register('buyerDetails.taxNumber')} className={inputCls(!!bd.taxNumber)} />
        </Field>
        <Field label="Address" required error={bd.address?.message}>
          <textarea rows={2} {...register('buyerDetails.address')} className={`${inputCls(!!bd.address)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
