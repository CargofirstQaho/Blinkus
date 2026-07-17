import { Ship } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function CommercialShippingDetails({ register, errors }) {
  const sd = errors.shippingDetails || {};

  return (
    <Section title="Shipping Information" icon={Ship}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Vessel" required error={sd.vessel?.message}>
          <input {...register('shippingDetails.vessel')} className={inputCls(!!sd.vessel)} />
        </Field>
        <Field label="BL Number" required error={sd.blNumber?.message}>
          <input {...register('shippingDetails.blNumber')} className={`${inputCls(!!sd.blNumber)} uppercase`} />
        </Field>
        <Field label="Port Of Loading" required error={sd.portOfLoading?.message}>
          <input {...register('shippingDetails.portOfLoading')} className={inputCls(!!sd.portOfLoading)} />
        </Field>
        <Field label="Port Of Discharge" required error={sd.portOfDischarge?.message}>
          <input {...register('shippingDetails.portOfDischarge')} className={inputCls(!!sd.portOfDischarge)} />
        </Field>
        <Field label="Final Destination" required error={sd.finalDestination?.message}>
          <input {...register('shippingDetails.finalDestination')} className={inputCls(!!sd.finalDestination)} />
        </Field>
      </div>
    </Section>
  );
}
