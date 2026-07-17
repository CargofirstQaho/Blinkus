import { useEffect, useMemo, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Calculator } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, BORDER, TEXT, MUTED } from './FormUI';
import { computeCreditNoteTotals } from '../constants/creditNoteOptions';

function ReadOnlyTaxRow({ label, value, currency }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <span className="text-sm font-semibold" style={{ color: MUTED }}>{label}</span>
      <span className="font-bold text-sm text-right" style={{ color: TEXT }}>{currency} {(parseFloat(value) || 0).toFixed(2)}</span>
    </div>
  );
}

function useSyncedValue(setValue, name, computed) {
  useEffect(() => {
    setValue(name, Number(computed.toFixed(2)), { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed]);
}

export default function CreditNoteSummary({ control, errors, setValue, orgGstNumber }) {
  const lineItems     = useWatch({ control, name: 'lineItems' });
  const placeOfSupply = useWatch({ control, name: 'creditNoteInfo.placeOfSupply' });
  const currency      = useWatch({ control, name: 'creditNoteInfo.currency' }) || 'INR';
  const creditAmount  = useWatch({ control, name: 'summary.creditAmount' });

  const { subTotal, cgst: cgstComputed, sgst: sgstComputed, igst: igstComputed } = useMemo(
    () => computeCreditNoteTotals(lineItems, placeOfSupply, orgGstNumber),
    [lineItems, placeOfSupply, orgGstNumber]
  );

  useSyncedValue(setValue, 'summary.cgst', cgstComputed);
  useSyncedValue(setValue, 'summary.sgst', sgstComputed);
  useSyncedValue(setValue, 'summary.igst', igstComputed);

  const total = subTotal + cgstComputed + sgstComputed + igstComputed;

  const prevTotalRef = useRef(total);
  useEffect(() => {
    const current = parseFloat(creditAmount);
    const prev    = prevTotalRef.current;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue('summary.creditAmount', Number(total.toFixed(2)), { shouldValidate: true });
    }
    prevTotalRef.current = total;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  return (
    <Section title="Summary" icon={Calculator}>
      <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>Sub Total</span>
          <span className="font-bold text-sm" style={{ color: TEXT }}>{currency} {subTotal.toFixed(2)}</span>
        </div>

        <ReadOnlyTaxRow label="CGST" value={cgstComputed} currency={currency} />
        <ReadOnlyTaxRow label="SGST" value={sgstComputed} currency={currency} />
        <ReadOnlyTaxRow label="IGST" value={igstComputed} currency={currency} />

        <div className="flex justify-between items-center px-4 py-2.5" style={{ background: LIGHT, borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: BRAND }}>Total</span>
          <span className="font-bold text-sm" style={{ color: BRAND }}>{currency} {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 max-w-xs ml-auto">
        <Field label="Credit Amount" required error={errors.summary?.creditAmount?.message}>
          <Controller control={control} name="summary.creditAmount" render={({ field: { value, onChange, onBlur, ref } }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: MUTED }}>{currency}</span>
              <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
                onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
                className={inputCls(!!errors.summary?.creditAmount?.message)} />
            </div>
          )} />
        </Field>
        <p className="text-xs mt-1.5" style={{ color: MUTED }}>Defaults to Total. Adjust for partial credit.</p>
      </div>
    </Section>
  );
}
