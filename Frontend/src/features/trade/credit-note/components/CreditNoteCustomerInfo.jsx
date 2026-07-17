import { User } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function CreditNoteCustomerInfo({ register, errors }) {
  const ci = errors.customerInfo || {};

  return (
    <Section title="Customer Information" icon={User}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Customer Name" required error={ci.customerName?.message}>
          <input {...register('customerInfo.customerName')} className={inputCls(!!ci.customerName)} />
        </Field>
        <Field label="Customer Company" required error={ci.customerCompany?.message}>
          <input {...register('customerInfo.customerCompany')} className={inputCls(!!ci.customerCompany)} />
        </Field>
        <Field label="GST Number" required error={ci.gstNumber?.message}>
          <input {...register('customerInfo.gstNumber')} className={inputCls(!!ci.gstNumber)} style={{ textTransform: 'uppercase' }} />
        </Field>
        <Field label="Email" required error={ci.email?.message}>
          <input type="email" {...register('customerInfo.email')} className={inputCls(!!ci.email)} />
        </Field>
        <Field label="Phone" required error={ci.phone?.message}>
          <input type="tel" {...register('customerInfo.phone')} className={inputCls(!!ci.phone)} />
        </Field>
        <Field label="Billing Address" required error={ci.billingAddress?.message}>
          <textarea rows={2} {...register('customerInfo.billingAddress')} className={`${inputCls(!!ci.billingAddress)} resize-none`} />
        </Field>
        <Field label="Shipping Address" required error={ci.shippingAddress?.message}>
          <textarea rows={2} {...register('customerInfo.shippingAddress')} className={`${inputCls(!!ci.shippingAddress)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
