import { PenLine } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function ProformaNotesTerms({ register, errors }) {
  return (
    <Section title="Notes & Terms" icon={PenLine}>
      <div className="grid grid-cols-1 gap-4">
        <Field label="Notes" required error={errors.notes?.message}>
          <textarea rows={3} {...register('notes')} className={`${inputCls(!!errors.notes)} resize-none`} />
        </Field>
        <Field label="Terms & Conditions" required error={errors.termsAndConditions?.message}>
          <textarea rows={4} {...register('termsAndConditions')} className={`${inputCls(!!errors.termsAndConditions)} resize-none`} />
        </Field>
      </div>
    </Section>
  );
}
