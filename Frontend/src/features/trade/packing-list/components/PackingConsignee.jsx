import { MapPin } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function PackingConsignee({ register, errors }) {
  const cn = errors.consignee || {};

  return (
    <Section title="Consignee" icon={MapPin}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Name" required error={cn.name?.message}>
          <input {...register('consignee.name')} className={inputCls(!!cn.name)} />
        </Field>
        <Field label="Country" required error={cn.country?.message}>
          <input {...register('consignee.country')} className={inputCls(!!cn.country)} />
        </Field>
        <Field label="Phone" required error={cn.phone?.message}>
          <input type="tel" {...register('consignee.phone')} className={inputCls(!!cn.phone)} />
        </Field>
        <Field label="Email" required error={cn.email?.message}>
          <input type="email" {...register('consignee.email')} className={inputCls(!!cn.email)} />
        </Field>
        <Field label="Address" required error={cn.address?.message}>
          <textarea rows={2} {...register('consignee.address')} className={`${inputCls(!!cn.address)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
