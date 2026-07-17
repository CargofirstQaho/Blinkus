import { Ship } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function PackingShippingDetails({ register, errors }) {
  const sd = errors.shippingDetails || {};

  return (
    <Section title="Shipping Details" icon={Ship}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Port Of Loading" required error={sd.portOfLoading?.message}>
          <input {...register('shippingDetails.portOfLoading')} className={inputCls(!!sd.portOfLoading)} />
        </Field>
        <Field label="Port Of Discharge" required error={sd.portOfDischarge?.message}>
          <input {...register('shippingDetails.portOfDischarge')} className={inputCls(!!sd.portOfDischarge)} />
        </Field>
        <Field label="Vessel" required error={sd.vessel?.message}>
          <input {...register('shippingDetails.vessel')} className={inputCls(!!sd.vessel)} />
        </Field>
        <Field label="Container Number" required error={sd.containerNumber?.message}>
          <input {...register('shippingDetails.containerNumber')} className={`${inputCls(!!sd.containerNumber)} uppercase`} />
        </Field>
        <Field label="Seal Number" required error={sd.sealNumber?.message}>
          <input {...register('shippingDetails.sealNumber')} className={`${inputCls(!!sd.sealNumber)} uppercase`} />
        </Field>
      </div>
    </Section>
  );
}
