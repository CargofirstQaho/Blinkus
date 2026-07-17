import { PenLine } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';
import { DN_REASONS } from '../constants/debitNoteOptions';

export default function DebitNoteTerms({ register, errors }) {
  return (
    <Section title="Additional Information" icon={PenLine}>
      <div className="grid grid-cols-1 gap-4">
        <Field label="Reason For Debit Note" required error={errors.reasonForDebitNote?.message}>
          <select {...register('reasonForDebitNote')} className={inputCls(!!errors.reasonForDebitNote)}>
            <option value="">Select reason…</option>
            {DN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
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
