import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, List } from 'lucide-react';
import { computeLineTotal } from './utils';

const UNITS = ['PCS', 'KG', 'LTR', 'MTR', 'SQM', 'MT', 'BOX', 'SET', 'NOS', 'DOZ', 'PAIR', 'ROLL'];
const TAX_OPTS = ['0', '5', '12', '18', '28'];

const tbase = 'w-full px-2 py-1.5 rounded-lg text-xs outline-none transition-all bg-white placeholder:text-slate-400';
const tbdr = (err) => ({ border: `1px solid ${err ? '#fca5a5' : '#e2e8f0'}`, color: '#0f172a' });
const tfOn = (ev) => {
  ev.target.style.borderColor = '#3b82f6';
  ev.target.style.boxShadow = '0 0 0 2px rgba(59,130,246,0.12)';
};
const tfOff = (ev, err) => {
  ev.target.style.borderColor = err ? '#fca5a5' : '#e2e8f0';
  ev.target.style.boxShadow = 'none';
};

function ItemRow({ index, register, errors, remove, watch, mode }) {
  const p = `lineItems.${index}`;
  const errs = errors?.lineItems?.[index] || {};
  const taxable = computeLineTotal(watch(`${p}.quantity`), watch(`${p}.unitPrice`), watch(`${p}.discount`));
  const taxRate = parseFloat(watch(`${p}.taxPercentage`)) || 0;
  const lineTotal = taxable + taxable * (taxRate / 100);

  const showItemCode = mode !== 'cn';
  const showDiscount = mode !== 'dn';
  const codeLabel = mode === 'dn' ? 'Charge Type' : 'Item Code';

  return (
    <>
      {/* ── Desktop row ── */}
      <tr className="hidden sm:table-row group hover:bg-blue-50/20 transition-colors">
        <td className="px-3 py-2 text-xs text-center tabular-nums" style={{ color: '#94a3b8' }}>
          {index + 1}
        </td>

        {showItemCode && (
          <td className="px-2 py-2">
            <input
              {...register(`${p}.itemCode`)}
              placeholder={codeLabel}
              className={tbase}
              style={tbdr(false)}
              onFocus={tfOn}
              onBlur={(ev) => tfOff(ev, false)}
            />
          </td>
        )}

        <td className="px-2 py-2">
          <input
            {...register(`${p}.description`)}
            placeholder="Item / service description"
            className={tbase}
            style={tbdr(!!errs.description)}
            onFocus={tfOn}
            onBlur={(ev) => tfOff(ev, !!errs.description)}
          />
          {errs.description && (
            <p className="text-[10px] mt-0.5 ml-1" style={{ color: '#dc2626' }}>{errs.description.message}</p>
          )}
        </td>

        <td className="px-2 py-2">
          <input
            {...register(`${p}.hsnCode`)}
            placeholder="HSN"
            className={tbase}
            style={tbdr(false)}
            onFocus={tfOn}
            onBlur={(ev) => tfOff(ev, false)}
          />
        </td>

        <td className="px-2 py-2">
          <input
            {...register(`${p}.quantity`)}
            type="number"
            min="0"
            step="any"
            placeholder="1"
            className={`${tbase} text-right`}
            style={tbdr(!!errs.quantity)}
            onFocus={tfOn}
            onBlur={(ev) => tfOff(ev, !!errs.quantity)}
          />
        </td>

        <td className="px-2 py-2">
          <select
            {...register(`${p}.unit`)}
            className={`${tbase} cursor-pointer`}
            style={tbdr(false)}
          >
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </td>

        <td className="px-2 py-2">
          <input
            {...register(`${p}.unitPrice`)}
            type="number"
            min="0"
            step="any"
            placeholder="0.00"
            className={`${tbase} text-right`}
            style={tbdr(!!errs.unitPrice)}
            onFocus={tfOn}
            onBlur={(ev) => tfOff(ev, !!errs.unitPrice)}
          />
        </td>

        {showDiscount && (
          <td className="px-2 py-2">
            <input
              {...register(`${p}.discount`)}
              type="number"
              min="0"
              max="100"
              step="any"
              placeholder="0"
              className={`${tbase} text-right`}
              style={tbdr(false)}
              onFocus={tfOn}
              onBlur={(ev) => tfOff(ev, false)}
            />
          </td>
        )}

        <td className="px-2 py-2">
          <select
            {...register(`${p}.taxPercentage`)}
            className={`${tbase} cursor-pointer`}
            style={tbdr(false)}
          >
            {TAX_OPTS.map((r) => <option key={r} value={r}>{r}%</option>)}
          </select>
        </td>

        <td className="px-3 py-2 text-right">
          <span className="text-xs font-semibold tabular-nums" style={{ color: '#0f172a' }}>
            {lineTotal.toFixed(2)}
          </span>
        </td>

        <td className="px-2 py-2 text-center">
          <button
            type="button"
            onClick={() => remove(index)}
            className="w-6 h-6 rounded-lg flex items-center justify-center mx-auto transition-colors hover:bg-red-50 opacity-0 group-hover:opacity-100"
            style={{ color: '#dc2626' }}
          >
            <Trash2 size={12} />
          </button>
        </td>
      </tr>

      {/* ── Mobile card ── */}
      <tr className="sm:hidden">
        <td colSpan={12} className="py-1.5 px-0">
          <div className="rounded-xl p-3.5 space-y-3" style={{ border: '1px solid #e2e8f0', background: '#fafbfc' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: '#64748b' }}>
                Item #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                style={{ color: '#dc2626' }}
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>
                Description <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                {...register(`${p}.description`)}
                placeholder="Item / service description"
                className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all bg-white"
                style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
              />
              {errs.description && (
                <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {showItemCode && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>
                    {codeLabel}
                  </label>
                  <input
                    {...register(`${p}.itemCode`)}
                    placeholder="Code"
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white"
                    style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>HSN/SAC</label>
                <input
                  {...register(`${p}.hsnCode`)}
                  placeholder="Code"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>Qty *</label>
                <input
                  {...register(`${p}.quantity`)}
                  type="number" min="0" step="any" placeholder="1"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white text-right"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>Unit *</label>
                <select
                  {...register(`${p}.unit`)}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white cursor-pointer"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                >
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>Rate *</label>
                <input
                  {...register(`${p}.unitPrice`)}
                  type="number" min="0" step="any" placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white text-right"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {showDiscount && (
                <div>
                  <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>Disc %</label>
                  <input
                    {...register(`${p}.discount`)}
                    type="number" min="0" max="100" step="any" placeholder="0"
                    className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white text-right"
                    style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                  />
                </div>
              )}
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider block mb-1" style={{ color: '#64748b' }}>Tax %</label>
                <select
                  {...register(`${p}.taxPercentage`)}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none bg-white cursor-pointer"
                  style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
                >
                  {TAX_OPTS.map((r) => <option key={r} value={r}>{r}%</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2.5" style={{ borderTop: '1px solid #e2e8f0' }}>
              <span className="text-xs" style={{ color: '#64748b' }}>Line Total (incl. tax)</span>
              <span className="text-sm font-bold tabular-nums" style={{ color: '#0f172a' }}>
                {lineTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

export default function LineItemsTable({ control, register, errors, watch, mode = 'po' }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'lineItems' });

  const newRow = () => ({
    itemCode: '', description: '', hsnCode: '',
    quantity: 1, unit: 'PCS', unitPrice: 0, discount: 0, taxPercentage: '18',
  });

  const thCls = 'px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider text-left whitespace-nowrap';
  const thStyle = { color: '#94a3b8' };

  const showItemCode = mode !== 'cn';
  const showDiscount = mode !== 'dn';

  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.08)' }}>
          <List size={14} style={{ color: '#2563eb' }} />
        </div>
        <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>Line Items</h2>
        <span
          className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(37,99,235,0.08)', color: '#2563eb' }}
        >
          {fields.length} {fields.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: mode === 'dn' ? 640 : 700 }}>
          <thead style={{ borderBottom: '2px solid #f1f5f9' }}>
            <tr>
              <th className={thCls} style={{ ...thStyle, width: 40 }}>#</th>
              {showItemCode && <th className={thCls} style={{ ...thStyle, width: 100 }}>{mode === 'dn' ? 'Charge Type' : 'Item Code'}</th>}
              <th className={thCls} style={thStyle}>Description *</th>
              <th className={thCls} style={{ ...thStyle, width: 90 }}>HSN/SAC</th>
              <th className={thCls} style={{ ...thStyle, width: 70 }}>Qty *</th>
              <th className={thCls} style={{ ...thStyle, width: 80 }}>Unit *</th>
              <th className={thCls} style={{ ...thStyle, width: 100 }}>{mode === 'dn' ? 'Rate' : 'Unit Price'} *</th>
              {showDiscount && <th className={thCls} style={{ ...thStyle, width: 65 }}>Disc %</th>}
              <th className={thCls} style={{ ...thStyle, width: 75 }}>Tax %</th>
              <th className={`${thCls} text-right`} style={{ ...thStyle, width: 110 }}>Total (incl. tax)</th>
              <th className={thCls} style={{ ...thStyle, width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <ItemRow
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                remove={remove}
                watch={watch}
                mode={mode}
              />
            ))}
          </tbody>
        </table>
      </div>

      {errors?.lineItems?.message && (
        <p className="px-5 pt-2 text-xs" style={{ color: '#dc2626' }}>{errors.lineItems.message}</p>
      )}
      {errors?.lineItems?.root?.message && (
        <p className="px-5 pt-2 text-xs" style={{ color: '#dc2626' }}>{errors.lineItems.root.message}</p>
      )}

      <div className="px-5 pt-3 pb-4" style={{ borderTop: '1px solid #f8fafc' }}>
        <button
          type="button"
          onClick={() => append(newRow())}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all hover:bg-blue-50 active:scale-[0.98]"
          style={{ color: '#2563eb', border: '1px dashed rgba(37,99,235,0.3)' }}
        >
          <Plus size={14} />
          Add Row
        </button>
      </div>
    </div>
  );
}
