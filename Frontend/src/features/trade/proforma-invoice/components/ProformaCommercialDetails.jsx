import { useMemo } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, GRAD, BORDER, MUTED } from './FormUI';
import { UNITS } from '../constants/proformaInvoiceOptions';

export const DEFAULT_ITEM = {
  commodity: '', hsnCode: '', quantity: 1, unit: 'PCS', rate: 0,
};

const TABLE_HEADERS = [
  { l: '#',         req: false }, { l: 'Commodity', req: true }, { l: 'HSN Code', req: true },
  { l: 'Qty',       req: true },  { l: 'Unit',      req: true }, { l: 'Rate',     req: true },
  { l: 'Amount',    req: false }, { l: '',          req: false },
];

function useItemAmount(control, idx) {
  const qty  = useWatch({ control, name: `commercialDetails.${idx}.quantity` });
  const rate = useWatch({ control, name: `commercialDetails.${idx}.rate` });

  return useMemo(() => {
    const q = parseFloat(qty)  || 0;
    const r = parseFloat(rate) || 0;
    return q * r;
  }, [qty, rate]);
}

function ItemRow({ idx, control, errors, onRemove, canRemove, currency }) {
  const errs   = errors?.commercialDetails?.[idx] || {};
  const amount = useItemAmount(control, idx);

  return (
    <tr style={{ background: idx % 2 === 0 ? '#fff' : '#F0F7FF' }}>
      <td className="px-2 py-1.5 text-center text-xs font-semibold" style={{ color: MUTED }}>{idx + 1}</td>
      <td className="px-1 py-1" style={{ minWidth: 140 }}>
        <Controller control={control} name={`commercialDetails.${idx}.commodity`} render={({ field }) => (
          <div>
            <input {...field} placeholder="Commodity *" className={inputCls(!!errs.commodity?.message)} style={{ fontSize: 12 }} />
            {errs.commodity?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.commodity.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 90 }}>
        <Controller control={control} name={`commercialDetails.${idx}.hsnCode`} render={({ field }) => (
          <div>
            <input {...field} placeholder="HSN Code *" className={inputCls(!!errs.hsnCode?.message)} style={{ fontSize: 12 }} />
            {errs.hsnCode?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.hsnCode.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 56 }}>
        <Controller control={control} name={`commercialDetails.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
          <div>
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder="Qty *" className={inputCls(!!errs.quantity?.message)} style={{ fontSize: 12 }} />
            {errs.quantity?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.quantity.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 68 }}>
        <Controller control={control} name={`commercialDetails.${idx}.unit`} render={({ field }) => (
          <div>
            <select {...field} className={inputCls(!!errs.unit?.message)} style={{ fontSize: 12 }}>
              <option value="">Unit *</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            {errs.unit?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.unit.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 80 }}>
        <Controller control={control} name={`commercialDetails.${idx}.rate`} render={({ field: { value, onChange, onBlur, ref } }) => (
          <div>
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder="Rate *" className={inputCls(!!errs.rate?.message)} style={{ fontSize: 12 }} />
            {errs.rate?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.rate.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-2 py-1.5 text-right text-sm font-bold whitespace-nowrap" style={{ color: BRAND }}>{currency} {amount.toFixed(2)}</td>
      <td className="px-2 py-1.5 text-center">
        {canRemove && (
          <button type="button" onClick={onRemove} className="p-1.5 rounded-lg transition-colors" style={{ background: '#FEF2F2' }}>
            <Trash2 size={13} color="#DC2626" />
          </button>
        )}
      </td>
    </tr>
  );
}

function MobileItemCard({ idx, control, errors, onRemove, canRemove, currency }) {
  const errs   = errors?.commercialDetails?.[idx] || {};
  const amount = useItemAmount(control, idx);

  return (
    <div className="rounded-xl p-4 mb-3" style={{ border: `1px solid ${BORDER}`, background: '#F0F7FF' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: GRAD, color: '#fff' }}>Item {idx + 1}</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="p-1.5 rounded-lg" style={{ background: '#FEF2F2' }}>
            <Trash2 size={13} color="#DC2626" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Commodity" required error={errs.commodity?.message}>
          <Controller control={control} name={`commercialDetails.${idx}.commodity`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.commodity?.message)} />
          )} />
        </Field>
        <Field label="HSN Code" required error={errs.hsnCode?.message}>
          <Controller control={control} name={`commercialDetails.${idx}.hsnCode`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.hsnCode?.message)} />
          )} />
        </Field>
        <Field label="Quantity" required error={errs.quantity?.message}>
          <Controller control={control} name={`commercialDetails.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.quantity?.message)} />
          )} />
        </Field>
        <Field label="Unit" required error={errs.unit?.message}>
          <Controller control={control} name={`commercialDetails.${idx}.unit`} render={({ field }) => (
            <select {...field} className={inputCls(!!errs.unit?.message)}>
              <option value="">Select</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          )} />
        </Field>
        <Field label="Rate" required error={errs.rate?.message}>
          <Controller control={control} name={`commercialDetails.${idx}.rate`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.rate?.message)} />
          )} />
        </Field>
      </div>
      <div className="mt-3 pt-2.5 flex justify-between items-center" style={{ borderTop: `1px solid ${BORDER}` }}>
        <span className="text-xs" style={{ color: MUTED }}>Amount</span>
        <span className="text-sm font-bold" style={{ color: BRAND }}>{currency} {amount.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function ProformaCommercialDetails({ control, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'commercialDetails' });
  const currency = useWatch({ control, name: 'invoiceInfo.currency' }) || 'USD';

  return (
    <Section title="Commercial Details" icon={Package}>
      {errors.commercialDetails?.message && (
        <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{errors.commercialDetails.message}</p>
      )}
      <div className="hidden lg:block overflow-x-auto rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ background: GRAD }}>
              {TABLE_HEADERS.map((h, i) => (
                <th key={i} className="px-2 py-2.5 text-left text-xs font-bold text-white whitespace-nowrap">
                  {h.l}{h.req && <span style={{ color: '#BFDBFE' }}> *</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => (
              <ItemRow key={field.id} idx={idx} control={control} errors={errors} currency={currency} onRemove={() => remove(idx)} canRemove={fields.length > 1} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden">
        {fields.map((field, idx) => (
          <MobileItemCard key={field.id} idx={idx} control={control} errors={errors} currency={currency} onRemove={() => remove(idx)} canRemove={fields.length > 1} />
        ))}
      </div>
      <button type="button"
        onClick={() => append({ ...DEFAULT_ITEM })}
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ background: LIGHT, color: BRAND, border: `1.5px dashed ${BRAND}` }}>
        <Plus size={15} color={BRAND} /> Add Commercial Item
      </button>
    </Section>
  );
}
