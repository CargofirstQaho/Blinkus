import { PenLine, Signature } from 'lucide-react';
import { Field, Section, inputCls } from './FormUI';

export default function CommercialDeclarationTerms({ register, errors }) {
  const sig = errors.signatory || {};

  return (
    <>
      <Section title="Declaration & Terms" icon={PenLine}>
        <div className="grid grid-cols-1 gap-4">
          <Field label="Declaration" required error={errors.declaration?.message}>
            <textarea rows={3} {...register('declaration')} className={`${inputCls(!!errors.declaration)} resize-none`} />
          </Field>
          <Field label="Terms & Conditions" required error={errors.termsAndConditions?.message}>
            <textarea rows={4} {...register('termsAndConditions')} className={`${inputCls(!!errors.termsAndConditions)} resize-none`} />
          </Field>
        </div>
      </Section>

      <Section title="Signature" icon={Signature}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Authorized Signatory Name" required error={sig.name?.message}>
            <input {...register('signatory.name')} className={inputCls(!!sig.name)} />
          </Field>
          <Field label="Designation" required error={sig.designation?.message}>
            <input {...register('signatory.designation')} className={inputCls(!!sig.designation)} />
          </Field>
        </div>
      </Section>
    </>
  );
}
