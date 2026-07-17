import { Truck } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function DebitNoteSupplierInfo({ register, errors }) {
  const si = errors.supplierInfo || {};

  return (
    <Section title="Supplier Information" icon={Truck}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Supplier Name" required error={si.supplierName?.message}>
          <input {...register('supplierInfo.supplierName')} className={inputCls(!!si.supplierName)} />
        </Field>
        <Field label="Supplier Company" required error={si.supplierCompany?.message}>
          <input {...register('supplierInfo.supplierCompany')} className={inputCls(!!si.supplierCompany)} />
        </Field>
        <Field label="GST Number" required error={si.gstNumber?.message}>
          <input {...register('supplierInfo.gstNumber')} className={inputCls(!!si.gstNumber)} style={{ textTransform: 'uppercase' }} />
        </Field>
        <Field label="Email" required error={si.email?.message}>
          <input type="email" {...register('supplierInfo.email')} className={inputCls(!!si.email)} />
        </Field>
        <Field label="Phone" required error={si.phone?.message}>
          <input type="tel" {...register('supplierInfo.phone')} className={inputCls(!!si.phone)} />
        </Field>
        <Field label="Address" required error={si.address?.message}>
          <textarea rows={2} {...register('supplierInfo.address')} className={`${inputCls(!!si.address)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
