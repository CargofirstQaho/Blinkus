import { useEffect, useMemo, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Wallet } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, BORDER, TEXT, MUTED } from './FormUI';
import { computeProformaTotals } from '../constants/proformaInvoiceOptions';

export default function ProformaFinancialInfo({ control, errors, setValue }) {
  const commercialDetails = useWatch({ control, name: 'commercialDetails' });
  const currency          = useWatch({ control, name: 'invoiceInfo.currency' }) || 'USD';
  const advancePercent    = useWatch({ control, name: 'financialInfo.advancePercent' });
  const advanceAmount     = useWatch({ control, name: 'financialInfo.advanceAmount' });

  const { totalAmount } = useMemo(() => computeProformaTotals(commercialDetails), [commercialDetails]);

  const computedAdvance = totalAmount * ((parseFloat(advancePercent) || 0) / 100);

  const prevAdvanceRef = useRef(computedAdvance);
  useEffect(() => {
    const current = parseFloat(advanceAmount);
    const prev    = prevAdvanceRef.current;
    if (Number.isNaN(current) || Math.abs(current - prev) < 0.005) {
      setValue('financialInfo.advanceAmount', Number(computedAdvance.toFixed(2)), { shouldValidate: true });
    }
    prevAdvanceRef.current = computedAdvance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computedAdvance]);

  const balanceAmount = totalAmount - (parseFloat(advanceAmount) || 0);
  useEffect(() => {
    setValue('financialInfo.balanceAmount', Number(balanceAmount.toFixed(2)), { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceAmount]);

  return (
    <Section title="Financial Information" icon={Wallet}>
      <div className="rounded-xl overflow-hidden mb-4" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex justify-between items-center px-4 py-2.5" style={{ background: LIGHT, borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: BRAND }}>Total Amount</span>
          <span className="font-bold text-sm" style={{ color: BRAND }}>{currency} {totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center px-4 py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>Balance Amount</span>
          <span className="font-bold text-sm" style={{ color: TEXT }}>{currency} {balanceAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Field label="Advance Percentage (%)" required error={errors.financialInfo?.advancePercent?.message}>
          <Controller control={control} name="financialInfo.advancePercent" render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
              onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
              className={inputCls(!!errors.financialInfo?.advancePercent?.message)} />
          )} />
        </Field>
        <Field label="Advance Amount" required error={errors.financialInfo?.advanceAmount?.message}>
          <Controller control={control} name="financialInfo.advanceAmount" render={({ field: { value, onChange, onBlur, ref } }) => (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: MUTED }}>{currency}</span>
              <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
                onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
                className={inputCls(!!errors.financialInfo?.advanceAmount?.message)} />
            </div>
          )} />
        </Field>
      </div>
      <p className="text-xs mt-2" style={{ color: MUTED }}>
        Advance Amount auto-calculates from Total Amount × Advance Percentage. Adjust if a different advance was agreed. Balance Amount is computed automatically.
      </p>
    </Section>
  );
}
