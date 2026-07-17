import { useMemo } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, GRAD, BORDER, MUTED } from './FormUI';
import { UNITS, computeCommercialTotals } from '../constants/commercialInvoiceOptions';

export const DEFAULT_ITEM = {
  commodity: '', hsnCode: '', description: '',
  quantity: 1, unit: 'PCS', unitPrice: 0, taxPercent: 0,
};

const TABLE_HEADERS = [
  { l: '#',           req: false }, { l: 'Commodity',  req: true }, { l: 'HSN Code',   req: true },
  { l: 'Description', req: true }, { l: 'Quantity',   req: true }, { l: 'Unit',       req: true },
  { l: 'Unit Price',  req: true },  { l: 'Tax %',      req: false }, { l: 'Tax Amt', req: false },
  { l: 'Amount',      req: false }, { l: '',           req: false },
];

function NumField({ control, name, placeholder, err }) {
  return (
    <Controller control={control} name={name} render={({ field: { value, onChange, onBlur, ref } }) => (
      <div>
        <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} placeholder={placeholder} className={inputCls(!!err)} style={{ fontSize: 12 }} />
        {err && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{err}</p>}
      </div>
    )} />
  );
}

function TextField({ control, name, placeholder, err, uppercase }) {
  return (
    <Controller control={control} name={name} render={({ field }) => (
      <div>
        <input {...field} placeholder={placeholder} className={`${inputCls(!!err)} ${uppercase ? 'uppercase' : ''}`} style={{ fontSize: 12 }} />
        {err && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{err}</p>}
      </div>
    )} />
  );
}

function ItemAmount({ control, idx }) {
  const qty       = useWatch({ control, name: `goodsItems.${idx}.quantity` });
  const unitPrice = useWatch({ control, name: `goodsItems.${idx}.unitPrice` });
  const amount    = (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0);
  return <span className="text-sm font-semibold" style={{ color: BRAND }}>{amount.toFixed(2)}</span>;
}

function ItemTaxAmount({ control, idx }) {
  const qty       = useWatch({ control, name: `goodsItems.${idx}.quantity` });
  const unitPrice = useWatch({ control, name: `goodsItems.${idx}.unitPrice` });
  const taxPercent = useWatch({ control, name: `goodsItems.${idx}.taxPercent` });
  const amount = (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0);
  const taxAmount = amount * ((parseFloat(taxPercent) || 0) / 100);
  return <span className="text-sm font-semibold" style={{ color: MUTED }}>{taxAmount.toFixed(2)}</span>;
}

function ItemRow({ idx, control, errors, onRemove, canRemove }) {
  const errs = errors?.goodsItems?.[idx] || {};

  return (
    <tr style={{ background: idx % 2 === 0 ? '#fff' : '#F0F7FF' }}>
      <td className="px-2 py-1.5 text-center text-xs font-semibold" style={{ color: MUTED }}>{idx + 1}</td>
      <td className="px-1 py-1" style={{ minWidth: 110 }}>
        <TextField control={control} name={`goodsItems.${idx}.commodity`} placeholder="Commodity *" err={errs.commodity?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 80 }}>
        <TextField control={control} name={`goodsItems.${idx}.hsnCode`} placeholder="HSN Code *" err={errs.hsnCode?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 140 }}>
        <TextField control={control} name={`goodsItems.${idx}.description`} placeholder="Description *" err={errs.description?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 70 }}>
        <NumField control={control} name={`goodsItems.${idx}.quantity`} placeholder="Qty *" err={errs.quantity?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 68 }}>
        <Controller control={control} name={`goodsItems.${idx}.unit`} render={({ field }) => (
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
        <NumField control={control} name={`goodsItems.${idx}.unitPrice`} placeholder="Unit Price *" err={errs.unitPrice?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 64 }}>
        <NumField control={control} name={`goodsItems.${idx}.taxPercent`} placeholder="Tax %" err={errs.taxPercent?.message} />
      </td>
      <td className="px-2 py-1.5 text-right" style={{ minWidth: 70 }}>
        <ItemTaxAmount control={control} idx={idx} />
      </td>
      <td className="px-2 py-1.5 text-right" style={{ minWidth: 80 }}>
        <ItemAmount control={control} idx={idx} />
      </td>
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
  const errs = errors?.goodsItems?.[idx] || {};

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
          <Controller control={control} name={`goodsItems.${idx}.commodity`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.commodity?.message)} />
          )} />
        </Field>
        <Field label="HSN Code" required error={errs.hsnCode?.message}>
          <Controller control={control} name={`goodsItems.${idx}.hsnCode`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.hsnCode?.message)} />
          )} />
        </Field>
        <Field label="Description" required error={errs.description?.message}>
          <Controller control={control} name={`goodsItems.${idx}.description`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.description?.message)} />
          )} />
        </Field>
        <Field label="Quantity" required error={errs.quantity?.message}>
          <Controller control={control} name={`goodsItems.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.quantity?.message)} />
          )} />
        </Field>
        <Field label="Unit" required error={errs.unit?.message}>
          <Controller control={control} name={`goodsItems.${idx}.unit`} render={({ field }) => (
            <select {...field} className={inputCls(!!errs.unit?.message)}>
              <option value="">Select</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          )} />
        </Field>
        <Field label="Unit Price" required error={errs.unitPrice?.message}>
          <Controller control={control} name={`goodsItems.${idx}.unitPrice`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.unitPrice?.message)} />
          )} />
        </Field>
        <Field label="Tax %">
          <NumField control={control} name={`goodsItems.${idx}.taxPercent`} placeholder="0" err={errs.taxPercent?.message} />
        </Field>
        <Field label="Amount">
          <div className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ background: LIGHT, color: BRAND, border: `1px solid ${BORDER}` }}>
            <ItemAmount control={control} idx={idx} />
          </div>
        </Field>
      </div>
    </div>
  );
}

function TotalsBar({ control }) {
  const items     = useWatch({ control, name: 'goodsItems' });
  const financial = useWatch({ control, name: 'financial' });

  const totals = useMemo(() => computeCommercialTotals(items, financial), [items, financial]);

  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        <span className="text-xs" style={{ color: MUTED }}>Sub Total</span>
        <span className="text-sm font-bold" style={{ color: BRAND }}>{totals.subTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default function CommercialGoodsTable({ control, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'goodsItems' });

  return (
    <Section title="Goods Details" icon={Package}>
      {errors.goodsItems?.message && (
        <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{errors.goodsItems.message}</p>
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
        onClick={() => append({ ...DEFAULT_ITEM })}
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ background: LIGHT, color: BRAND, border: `1.5px dashed ${BRAND}` }}>
        <Plus size={15} color={BRAND} /> Add Goods Item
      </button>
      <TotalsBar control={control} />
    </Section>
  );
}
