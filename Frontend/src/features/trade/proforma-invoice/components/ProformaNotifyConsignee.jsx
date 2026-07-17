import { Bell, MapPin } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function ProformaNotifyConsignee({ register, errors }) {
  const np = errors.notifyParty || {};
  const cn = errors.consignee   || {};

  return (
    <>
      <Section title="Notify Party" icon={Bell}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Name" required error={np.name?.message}>
            <input {...register('notifyParty.name')} className={inputCls(!!np.name)} />
          </Field>
          <Field label="Country" required error={np.country?.message}>
            <input {...register('notifyParty.country')} className={inputCls(!!np.country)} />
          </Field>
          <Field label="Phone" required error={np.phone?.message}>
            <input type="tel" {...register('notifyParty.phone')} className={inputCls(!!np.phone)} />
          </Field>
          <Field label="Email" required error={np.email?.message}>
            <input type="email" {...register('notifyParty.email')} className={inputCls(!!np.email)} />
          </Field>
          <Field label="Address" required error={np.address?.message}>
            <textarea rows={2} {...register('notifyParty.address')} className={`${inputCls(!!np.address)} resize-none`} />
          </Field>
        </div>
      </Section>

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
    </>
  );
}
