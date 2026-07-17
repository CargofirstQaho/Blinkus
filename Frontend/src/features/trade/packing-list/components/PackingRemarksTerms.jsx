import { PenLine } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function PackingRemarksTerms({ register, errors }) {
  return (
    <Section title="Remarks & Terms" icon={PenLine}>
      <div className="grid grid-cols-1 gap-4">
        <Field label="Remarks" required error={errors.remarks?.message}>
          <textarea rows={3} {...register('remarks')} className={`${inputCls(!!errors.remarks)} resize-none`} />
        </Field>
        <Field label="Terms & Conditions" required error={errors.termsAndConditions?.message}>
          <textarea rows={4} {...register('termsAndConditions')} className={`${inputCls(!!errors.termsAndConditions)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
