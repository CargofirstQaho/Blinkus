import { useEffect, useMemo, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Calculator } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, MUTED } from './FormUI';
import { computeDebitNoteTotals } from '../constants/debitNoteOptions';
import GstSummaryBox from '../../shared/components/GstSummaryBox';

export default function DebitNoteSummary({ control, errors, setValue, orgGstNumber }) {
  const lineItems     = useWatch({ control, name: 'lineItems' });
  const currency      = useWatch({ control, name: 'debitNoteInfo.currency' }) || 'INR';
  const placeOfSupply = useWatch({ control, name: 'debitNoteInfo.placeOfSupply' });
  const balanceDue    = useWatch({ control, name: 'summary.balanceDue' });
  const grandTotal    = useWatch({ control, name: 'summary.grandTotal' });

  const { subtotal, cgst, sgst, igst } = useMemo(
    () => computeDebitNoteTotals(lineItems, currency, placeOfSupply, orgGstNumber),
    [lineItems, currency, placeOfSupply, orgGstNumber]
  );

  const prevTotalRef = useRef(parseFloat(grandTotal) || 0);
  useEffect(() => {
    const current = parseFloat(balanceDue);
    const prev    = prevTotalRef.current;
    const gt      = parseFloat(grandTotal) || 0;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue('summary.balanceDue', Number(gt.toFixed(2)), { shouldValidate: true });
    }
    prevTotalRef.current = gt;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grandTotal]);

  return (
    <Section title="Summary" icon={Calculator}>
      <GstSummaryBox
        control={control}
        setValue={setValue}
        subtotal={subtotal}
        computedCgst={cgst}
        computedSgst={sgst}
        computedIgst={igst}
        currency={currency}
        prefix="summary"
        grandTotalField="grandTotal"
      />

      <div className="mt-4 max-w-xs ml-auto">
        <Field label="Balance Due" required error={errors.summary?.balanceDue?.message}>
          <Controller control={control} name="summary.balanceDue" render={({ field: { value, onChange, onBlur, ref } }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: MUTED }}>{currency}</span>
              <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
                onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
                className={inputCls(!!errors.summary?.balanceDue?.message)} />
            </div>
          )} />
        </Field>
        <p className="text-xs mt-1.5" style={{ color: MUTED }}>Defaults to Grand Total. Adjust if part-paid.</p>
      </div>
    </Section>
  );
}
