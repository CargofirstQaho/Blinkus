import { useMemo } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';
import { Field, Section, inputCls, sanitizeNumber, BRAND, LIGHT, GRAD, BORDER, MUTED } from './FormUI';
import { PACKAGING_TYPES, UNITS, computePackingTotals } from '../constants/packingListOptions';

export const DEFAULT_ITEM = {
  marksAndNumbers: '', packagingType: '', numberOfPackages: 1,
  commodity: '', description: '', hsnCode: '',
  netWeight: 0, grossWeight: 0, quantity: 1, unit: 'PCS',
};

const TABLE_HEADERS = [
  { l: '#',              req: false }, { l: 'Marks & Nos',  req: true }, { l: 'Packaging Type', req: true },
  { l: 'No. Of Pkgs',    req: true },  { l: 'Commodity',    req: true }, { l: 'Description',    req: true },
  { l: 'HSN Code',       req: true },  { l: 'Net Wt (KG)',  req: true }, { l: 'Gross Wt (KG)',  req: true },
  { l: 'Quantity',       req: true },  { l: 'Unit',         req: true }, { l: '',               req: false },
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

function TextField({ control, name, placeholder, err }) {
  return (
    <Controller control={control} name={name} render={({ field }) => (
      <div>
        <input {...field} placeholder={placeholder} className={inputCls(!!err)} style={{ fontSize: 12 }} />
        {err && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{err}</p>}
      </div>
    )} />
  );
}

function ItemRow({ idx, control, errors, onRemove, canRemove }) {
  const errs = errors?.packingItems?.[idx] || {};

  return (
    <tr style={{ background: idx % 2 === 0 ? '#fff' : '#F0F7FF' }}>
      <td className="px-2 py-1.5 text-center text-xs font-semibold" style={{ color: MUTED }}>{idx + 1}</td>
      <td className="px-1 py-1" style={{ minWidth: 100 }}>
        <TextField control={control} name={`packingItems.${idx}.marksAndNumbers`} placeholder="Marks & Nos *" err={errs.marksAndNumbers?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 100 }}>
        <Controller control={control} name={`packingItems.${idx}.packagingType`} render={({ field }) => (
          <div>
            <select {...field} className={inputCls(!!errs.packagingType?.message)} style={{ fontSize: 12 }}>
              <option value="">Type *</option>
              {PACKAGING_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errs.packagingType?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.packagingType.message}</p>}
          </div>
        )} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 70 }}>
        <NumField control={control} name={`packingItems.${idx}.numberOfPackages`} placeholder="Pkgs *" err={errs.numberOfPackages?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 110 }}>
        <TextField control={control} name={`packingItems.${idx}.commodity`} placeholder="Commodity *" err={errs.commodity?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 130 }}>
        <TextField control={control} name={`packingItems.${idx}.description`} placeholder="Description *" err={errs.description?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 80 }}>
        <TextField control={control} name={`packingItems.${idx}.hsnCode`} placeholder="HSN Code *" err={errs.hsnCode?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 80 }}>
        <NumField control={control} name={`packingItems.${idx}.netWeight`} placeholder="Net Wt *" err={errs.netWeight?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 80 }}>
        <NumField control={control} name={`packingItems.${idx}.grossWeight`} placeholder="Gross Wt *" err={errs.grossWeight?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 70 }}>
        <NumField control={control} name={`packingItems.${idx}.quantity`} placeholder="Qty *" err={errs.quantity?.message} />
      </td>
      <td className="px-1 py-1" style={{ minWidth: 68 }}>
        <Controller control={control} name={`packingItems.${idx}.unit`} render={({ field }) => (
          <div>
            <select {...field} className={inputCls(!!errs.unit?.message)} style={{ fontSize: 12 }}>
              <option value="">Unit *</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            {errs.unit?.message && <p className="text-xs mt-0.5" style={{ color: '#ef4444' }}>{errs.unit.message}</p>}
          </div>
        )} />
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
  const errs = errors?.packingItems?.[idx] || {};

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
        <Field label="Marks & Nos" required error={errs.marksAndNumbers?.message}>
          <Controller control={control} name={`packingItems.${idx}.marksAndNumbers`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.marksAndNumbers?.message)} />
          )} />
        </Field>
        <Field label="Packaging Type" required error={errs.packagingType?.message}>
          <Controller control={control} name={`packingItems.${idx}.packagingType`} render={({ field }) => (
            <select {...field} className={inputCls(!!errs.packagingType?.message)}>
              <option value="">Select</option>
              {PACKAGING_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )} />
        </Field>
        <Field label="No. Of Packages" required error={errs.numberOfPackages?.message}>
          <Controller control={control} name={`packingItems.${idx}.numberOfPackages`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.numberOfPackages?.message)} />
          )} />
        </Field>
        <Field label="Commodity" required error={errs.commodity?.message}>
          <Controller control={control} name={`packingItems.${idx}.commodity`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.commodity?.message)} />
          )} />
        </Field>
        <Field label="Description" required error={errs.description?.message}>
          <Controller control={control} name={`packingItems.${idx}.description`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.description?.message)} />
          )} />
        </Field>
        <Field label="HSN Code" required error={errs.hsnCode?.message}>
          <Controller control={control} name={`packingItems.${idx}.hsnCode`} render={({ field }) => (
            <input {...field} className={inputCls(!!errs.hsnCode?.message)} />
          )} />
        </Field>
        <Field label="Net Weight (KG)" required error={errs.netWeight?.message}>
          <Controller control={control} name={`packingItems.${idx}.netWeight`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.netWeight?.message)} />
          )} />
        </Field>
        <Field label="Gross Weight (KG)" required error={errs.grossWeight?.message}>
          <Controller control={control} name={`packingItems.${idx}.grossWeight`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.grossWeight?.message)} />
          )} />
        </Field>
        <Field label="Quantity" required error={errs.quantity?.message}>
          <Controller control={control} name={`packingItems.${idx}.quantity`} render={({ field: { value, onChange, onBlur, ref } }) => (
            <input ref={ref} type="text" inputMode="decimal" value={value == null ? '' : String(value)} onChange={(e) => onChange(sanitizeNumber(e.target.value))} onBlur={onBlur} className={inputCls(!!errs.quantity?.message)} />
          )} />
        </Field>
        <Field label="Unit" required error={errs.unit?.message}>
          <Controller control={control} name={`packingItems.${idx}.unit`} render={({ field }) => (
            <select {...field} className={inputCls(!!errs.unit?.message)}>
              <option value="">Select</option>
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          )} />
        </Field>
      </div>
    </div>
  );
}

function TotalsBar({ control }) {
  const items = useWatch({ control, name: 'packingItems' });

  const totals = useMemo(() => computePackingTotals(items), [items]);

  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Total Packages',    value: totals.totalNumberOfPackages },
        { label: 'Total Net Weight',  value: totals.totalNetWeight },
        { label: 'Total Gross Weight', value: totals.totalGrossWeight },
        { label: 'Total Quantity',    value: totals.totalQuantity },
      ].map(({ label, value }) => (
        <div key={label} className="flex flex-col gap-0.5 px-3 py-2 rounded-lg" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
          <span className="text-xs" style={{ color: MUTED }}>{label}</span>
          <span className="text-sm font-bold" style={{ color: BRAND }}>{Number.isInteger(value) ? value : value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function PackingItemsTable({ control, errors }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'packingItems' });

  return (
    <Section title="Packing & Goods Details" icon={Package}>
      {errors.packingItems?.message && (
        <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{errors.packingItems.message}</p>
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
        <Plus size={15} color={BRAND} /> Add Packing Item
      </button>
      <TotalsBar control={control} />
    </Section>
  );
}
