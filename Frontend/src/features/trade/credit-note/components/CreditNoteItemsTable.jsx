import { useMemo } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, GRAD, BORDER, MUTED } from './FormUI';
import { UNITS } from '../constants/creditNoteOptions';

export const DEFAULT_ITEM = {
  itemName: '', description: '', hsnCode: '', quantity: 1, unit: 'PCS', unitPrice: 0, taxPercent: 18,
};

const TABLE_HEADERS = [
  { l: '#',           req: false }, { l: 'Item Name',  req: true }, { l: 'Description', req: true },
  { l: 'HSN Code',    req: true },  { l: 'Qty',        req: true }, { l: 'Unit',        req: true },
  { l: 'Unit Price',  req: true },  { l: 'Tax %',      req: true }, { l: 'Tax Amount',  req: false },
  { l: 'Total',       req: false }, { l: '',           req: false },
];

function useItemTotals(control, idx) {
  const qty   = useWatch({ control, name: `lineItems.${idx}.quantity` });
  const price = useWatch({ control, name: `lineItems.${idx}.unitPrice` });
  const tax   = useWatch({ control, name: `lineItems.${idx}.taxPercent` });

  return useMemo(() => {
    const q = parseFloat(qty)   || 0;
    const p = parseFloat(price) || 0;
    const t = parseFloat(tax)   || 0;
    const base      = q * p;
    const taxAmount = base * (t / 100);
    return { taxAmount, total: base + taxAmount };
  }, [qty, price, tax]);
}

function ItemRow({ idx, control, errors, onRemove, canRemove }) {
  const errs = errors?.lineItems?.[idx] || {};
  const { taxAmount, total } = useItemTotals(control, idx);

  return (
    <tr style={{ background: idx % 2 === 0 ? '#fff' : '#F0F7FF' }}>
      <td className="px-2 py-1.5 text-center text-xs font-semibold" style={{ color: MUTED }}>{idx + 1}</td>
      {[
        { name: `lineItems.${idx}.itemName`,    placeholder: 'Item Name *',    err: errs.itemName?.message,    w: 110 },
        { name: `lineItems.${idx}.description`, placeholder: 'Description *',  err: errs.description?.message, w: 110 },
        { name: `lineItems.${idx}.hsnCode`,     placeholder: 'HSN Code *',     err: errs.hsnCode?.message,     w: 80  },
      ].map((f) => (
        <td key={f.name} className="px-1 py-1" style={{ minWidth: f.w }}>
          <Controller control={control} name={f.name} render={({ field }) => (
            <div>
              <input {...field} placeholder={f.placeholder} className={inputCls(!!f.err)} style={{ fontSize: 12 }} />
              {f.err && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{f.err}</p>}
            </div>
          )} />
        </td>
      ))}
      <td className="px-1 py-1" style={{ minWidth: 56 }}>
        <Controller control={control} name={`lineItems.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
          <div>
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder="Qty *" className={inputCls(!!errs.quantity?.message)} style={{ fontSize: 12 }} />
            {errs.quantity?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.quantity.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 68 }}>
        <Controller control={control} name={`lineItems.${idx}.unit`} render={({ field }) => (
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
        <Controller control={control} name={`lineItems.${idx}.unitPrice`} render={({ field: { value, onChange, onBlur, ref } }) => (
          <div>
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder="Price *" className={inputCls(!!errs.unitPrice?.message)} style={{ fontSize: 12 }} />
            {errs.unitPrice?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.unitPrice.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 64 }}>
        <Controller control={control} name={`lineItems.${idx}.taxPercent`} render={({ field: { value, onChange, onBlur, ref } }) => (
          <div>
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder="Tax % *" className={inputCls(!!errs.taxPercent?.message)} style={{ fontSize: 12 }} />
            {errs.taxPercent?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.taxPercent.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-2 py-1.5 text-right text-sm font-semibold" style={{ color: MUTED }}>{taxAmount.toFixed(2)}</td>
      <td className="px-2 py-1.5 text-right text-sm font-bold" style={{ color: BRAND }}>{total.toFixed(2)}</td>
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

function MobileItemCard({ idx, control, errors, onRemove, canRemove }) {
  const errs = errors?.lineItems?.[idx] || {};
  const { taxAmount, total } = useItemTotals(control, idx);

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
        <Field label="Item Name" required error={errs.itemName?.message}>
          <Controller control={control} name={`lineItems.${idx}.itemName`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.itemName?.message)} />
          )} />
        </Field>
        <Field label="Description" required error={errs.description?.message}>
          <Controller control={control} name={`lineItems.${idx}.description`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.description?.message)} />
          )} />
        </Field>
        <Field label="HSN Code" required error={errs.hsnCode?.message}>
          <Controller control={control} name={`lineItems.${idx}.hsnCode`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.hsnCode?.message)} />
          )} />
        </Field>
        <Field label="Quantity" required error={errs.quantity?.message}>
          <Controller control={control} name={`lineItems.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.quantity?.message)} />
          )} />
        </Field>
        <Field label="Unit" required error={errs.unit?.message}>
          <Controller control={control} name={`lineItems.${idx}.unit`} render={({ field }) => (
            <select {...field} className={inputCls(!!errs.unit?.message)}>
              <option value="">Select</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          )} />
        </Field>
        <Field label="Unit Price" required error={errs.unitPrice?.message}>
          <Controller control={control} name={`lineItems.${idx}.unitPrice`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.unitPrice?.message)} />
          )} />
        </Field>
        <Field label="Tax %" required error={errs.taxPercent?.message}>
          <Controller control={control} name={`lineItems.${idx}.taxPercent`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.taxPercent?.message)} />
          )} />
        </Field>
      </div>
      <div className="mt-3 pt-2.5 flex flex-col gap-1" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: MUTED }}>Tax Amount</span>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>{taxAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: MUTED }}>Total</span>
          <span className="text-sm font-bold" style={{ color: BRAND }}>{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function CreditNoteItemsTable({ control, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'lineItems' });

  return (
    <Section title="Item Table" icon={Package}>
      {errors.lineItems?.message && (
        <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{errors.lineItems.message}</p>
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
              <ItemRow key={field.id} idx={idx} control={control} errors={errors} onRemove={() => remove(idx)} canRemove={fields.length > 1} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden">
        {fields.map((field, idx) => (
          <MobileItemCard key={field.id} idx={idx} control={control} errors={errors} onRemove={() => remove(idx)} canRemove={fields.length > 1} />
        ))}
      </div>
      <button type="button"
        onClick={() => append(DEFAULT_ITEM)}
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ background: LIGHT, color: BRAND, border: `1.5px dashed ${BRAND}` }}>
        <Plus size={15} color={BRAND} /> Add Line Item
      </button>
    </Section>
  );
}
