import { useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Wallet } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, MUTED } from './FormUI';
import { CURRENCIES, INDIAN_STATES, computeCommercialTotals } from '../constants/commercialInvoiceOptions';
import GstSummaryBox from '../../shared/components/GstSummaryBox';

export default function CommercialFinancialInfo({ control, errors, setValue, orgGstNumber }) {
  const goodsItems = useWatch({ control, name: 'goodsItems' });
  const financial  = useWatch({ control, name: 'financial' }) || {};
  const currency   = financial.currency || 'USD';
  const isInr      = currency.toUpperCase() === 'INR';

  const { subTotal, cgst, sgst, igst } = useMemo(
    () => computeCommercialTotals(goodsItems, financial, orgGstNumber),
    [goodsItems, financial, orgGstNumber]
  );

  return (
    <Section title="Financial Information" icon={Wallet}>
      <div className="mb-4">
        <GstSummaryBox
          control={control}
          setValue={setValue}
          subtotal={subTotal}
          computedCgst={cgst}
          computedSgst={sgst}
          computedIgst={igst}
          currency={currency}
          prefix="financial"
          grandTotalField="total"
          extraRows={[
            { label: 'Freight', value: financial.freight },
            { label: 'Insurance', value: financial.insurance },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Currency" required error={errors.financial?.currency?.message}>
          <Controller control={control} name="financial.currency" render={({ field }) => (
            <select {...field} className={inputCls(!!errors.financial?.currency)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )} />
        </Field>
        {isInr && (
          <Field label="Place of Supply" error={errors.financial?.placeOfSupply?.message}>
            <Controller control={control} name="financial.placeOfSupply" render={({ field }) => (
              <select {...field} className={inputCls(!!errors.financial?.placeOfSupply)}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}
              </select>
            )} />
          </Field>
        )}
        <Field label="Freight" required error={errors.financial?.freight?.message}>
          <Controller control={control} name="financial.freight" render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
              onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
              className={inputCls(!!errors.financial?.freight?.message)} />
          )} />
        </Field>
        <Field label="Insurance" required error={errors.financial?.insurance?.message}>
          <Controller control={control} name="financial.insurance" render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)}
              onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur}
              className={inputCls(!!errors.financial?.insurance?.message)} />
          )} />
        </Field>
      </div>
      <p className="text-xs mt-2" style={{ color: MUTED }}>
        CGST/SGST/IGST are auto-calculated for INR invoices based on place of supply, and Total updates automatically. All GST amounts and the Total are editable.
      </p>
    </Section>
  );
}
