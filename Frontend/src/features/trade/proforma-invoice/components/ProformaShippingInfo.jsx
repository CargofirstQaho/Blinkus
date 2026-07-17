import { Ship } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function ProformaShippingInfo({ register, errors }) {
  const si = errors.shippingInfo || {};

  return (
    <Section title="Shipping Information" icon={Ship}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Port Of Loading" required error={si.portOfLoading?.message}>
          <input {...register('shippingInfo.portOfLoading')} className={inputCls(!!si.portOfLoading)} />
        </Field>
        <Field label="Port Of Discharge" required error={si.portOfDischarge?.message}>
          <input {...register('shippingInfo.portOfDischarge')} className={inputCls(!!si.portOfDischarge)} />
        </Field>
        <Field label="Final Destination" required error={si.finalDestination?.message}>
          <input {...register('shippingInfo.finalDestination')} className={inputCls(!!si.finalDestination)} />
        </Field>
        <Field label="Country Of Origin" required error={si.countryOfOrigin?.message}>
          <input {...register('shippingInfo.countryOfOrigin')} className={inputCls(!!si.countryOfOrigin)} />
        </Field>
      </div>
    </Section>
  );
}
