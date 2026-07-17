import { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, Save, FileCheck, Plus, Trash2, Loader2,
  Users, MapPin, Calendar, Landmark, MessageSquare, ChevronRight,
} from 'lucide-react';
import { useOrganization } from '../../organization/hooks/useOrganization';
import OrgRequiredGate from '../../organization/components/OrgRequiredGate';
import { usePurchaseOrder } from '../hooks/usePurchaseOrder';
import { calcLineTotal, currencySymbol, getConversionLabel, needsUnitsPerPackage } from '../utils/purchaseOrderCalc';
import GstSummaryBox from '../../shared/components/GstSummaryBox';
import { computeSupplyType } from '../../shared/utils/gstCalculator';

function computePoGstSplit(items, currency, orgGstNumber, placeOfSupply) {
  const totalTax = (items || []).reduce((s, it) => {
    const base = calcLineTotal(it?.quantity, it?.unit, it?.unitPrice, it?.unitsPerPackage);
    return s + base * ((parseFloat(it?.taxPercent) || 0) / 100);
  }, 0);

  if ((currency || '').toUpperCase() !== 'INR') {
    return { cgst: 0, sgst: 0, igst: 0 };
  }
  const supplyType = computeSupplyType(orgGstNumber, placeOfSupply);
  if (supplyType === 'INTRA') {
    return { cgst: totalTax / 2, sgst: totalTax / 2, igst: 0 };
  }
  return { cgst: 0, sgst: 0, igst: totalTax };
}


const HS_RE    = /^\d{4,8}$/;
const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;

const itemSchema = z.object({
  itemNumber:      z.string().optional().default(''),
  productName:     z.string().min(1, 'Required'),
  description:     z.string().min(1, 'Required'),
  hsCode:          z.string().regex(HS_RE, 'Must be 4–8 digits'),
  quantity:        z.coerce.number().positive('Must be > 0'),
  unit:            z.string().min(1, 'Required'),
  unitsPerPackage: z.string().optional().default(''),
  unitPrice:       z.coerce.number().positive('Must be > 0'),
  taxPercent:      z.coerce.number().min(0, 'Must be ≥ 0').max(100, 'Max 100'),
});

const schema = z.object({
  buyerDetails: z.object({
    buyerName:       z.string().min(1, 'Required'),
    buyerCompany:    z.string().min(1, 'Required'),
    buyerAddress:    z.string().min(1, 'Required'),
    buyerCountry:    z.string().min(1, 'Required'),
    buyerState:      z.string().optional().default(''),
    buyerCity:       z.string().optional().default(''),
    buyerPostalCode: z.string().optional().default(''),
    buyerEmail:      z.string().min(1, 'Required').email('Invalid email'),
    buyerPhone:      z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone number'),
    buyerGstNumber:  z.string().optional().default(''),
  }),
  shipToDetails: z.object({
    companyName:   z.string().min(1, 'Required'),
    address:       z.string().min(1, 'Required'),
    country:       z.string().min(1, 'Required'),
    state:         z.string().optional().default(''),
    city:          z.string().optional().default(''),
    postalCode:    z.string().optional().default(''),
    contactPerson: z.string().min(1, 'Required'),
    phone:         z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone number'),
    email:         z.string().email('Invalid email').optional().or(z.literal('')).default(''),
  }),
  orderDetails: z.object({
    poDate: z.string().min(1, 'Required').refine(
      (val) => {
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      },
      'Order date cannot be in the past.'
    ),
    expectedDelivery: z.string().min(1, 'Required').refine(
      (val) => {
        if (!val) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(val) >= today;
      },
      'Expected delivery date cannot be in the past.'
    ),
    currency:         z.string().min(1, 'Required').default('INR'),
    paymentTerms:     z.string().min(1, 'Required'),
    incoterms:        z.string().min(1, 'Required'),
    portOfLoading:    z.string().optional().default(''),
    portOfDischarge:  z.string().optional().default(''),
    shipmentMode:     z.string().optional().default(''),
  }),
  items: z.array(itemSchema).min(1, 'At least one item is required'),
  summary: z.object({
    cgst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    sgst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    igst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    grandTotal: z.coerce.number(),
  }),
  bankDetails: z.object({
    bankName:      z.string().min(1, 'Required'),
    accountName:   z.string().min(1, 'Required'),
    accountNumber: z.string().min(1, 'Required'),
    ifsc:          z.string().optional().default(''),
    swift:         z.string().optional().default(''),
    branch:        z.string().optional().default(''),
  }).superRefine((data, ctx) => {
    if (!data.ifsc?.trim() && !data.swift?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'IFSC or SWIFT code required', path: ['ifsc'] });
    }
  }),
  notes: z.object({
    termsAndConditions:   z.string().optional().default(''),
    additionalNotes:      z.string().optional().default(''),
    signatory:            z.string().min(1, 'Required'),
    signatoryDesignation: z.string().min(1, 'Required'),
  }),
});

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULTS = {
  buyerDetails:  { buyerName:'', buyerCompany:'', buyerAddress:'', buyerCountry:'India', buyerState:'', buyerCity:'', buyerPostalCode:'', buyerEmail:'', buyerPhone:'', buyerGstNumber:'' },
  shipToDetails: { companyName:'', address:'', country:'India', state:'', city:'', postalCode:'', contactPerson:'', phone:'', email:'' },
  orderDetails:  { poDate: TODAY, expectedDelivery:'', currency:'INR', paymentTerms:'', incoterms:'', portOfLoading:'', portOfDischarge:'', shipmentMode:'' },
  items:         [{ itemNumber:'', productName:'', description:'', hsCode:'', quantity:1, unit:'PCS', unitsPerPackage:'', unitPrice:0, taxPercent:0 }],
  summary:       { cgst:0, sgst:0, igst:0, grandTotal:0 },
  bankDetails:   { bankName:'', accountName:'', accountNumber:'', ifsc:'', swift:'', branch:'' },
  notes:         { termsAndConditions:'', additionalNotes:'', signatory:'', signatoryDesignation:'' },
};

const CURRENCIES = ['INR', 'USD'];
const INCOTERMS  = ['','EXW','FCA','FOB','CFR','CIF','CPT','CIP','DAP','DPU','DDP'];
const PAYMENT    = ['','Net 30','Net 60','Net 90','Immediate','50% Advance','Full Advance','LC at Sight'];
const SHIPMENT   = ['','Road','Rail','Air','Sea','Courier','Hand Delivery'];
const UNITS      = ['PCS','KG','MTR','LTR','BOX','PAIR','SET','MT','ROLL','BAG','NOS'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toISOString().split('T')[0];
}

function draftToForm(draft) {
  const od = draft.orderDetails || {};
  return {
    buyerDetails:  { ...DEFAULTS.buyerDetails,  ...(draft.buyerDetails  || {}) },
    shipToDetails: { ...DEFAULTS.shipToDetails, ...(draft.shipToDetails || {}) },
    orderDetails:  {
      ...DEFAULTS.orderDetails,
      ...od,
      poDate:           fmtDate(od.poDate) || TODAY,
      expectedDelivery: fmtDate(od.expectedDelivery) || '',
    },
    items: (draft.items || []).length > 0
      ? draft.items.map(it => ({
          itemNumber:      it.itemNumber      || '',
          productName:     it.productName     || '',
          description:     it.description     || '',
          hsCode:          it.hsCode          || '',
          quantity:        it.quantity        || 1,
          unit:            it.unit            || 'PCS',
          unitsPerPackage: it.unitsPerPackage != null ? String(it.unitsPerPackage) : '',
          unitPrice:       it.unitPrice       || 0,
          taxPercent:      it.taxPercent      ?? 0,
        }))
      : DEFAULTS.items,
    summary: {
      cgst:       draft.summary?.cgst       ?? 0,
      sgst:       draft.summary?.sgst       ?? 0,
      igst:       draft.summary?.igst       ?? 0,
      grandTotal: draft.summary?.grandTotal ?? 0,
    },
    bankDetails: { ...DEFAULTS.bankDetails, ...(draft.bankDetails || {}) },
    notes:       { ...DEFAULTS.notes,       ...(draft.notes       || {}) },
  };
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inp = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white placeholder:text-slate-400';
const inpSm = 'w-full px-2 py-1.5 rounded-lg text-xs outline-none bg-white placeholder:text-slate-400';

function bdrStyle(hasError) {
  return { border: `1px solid ${hasError ? '#fca5a5' : '#e2e8f0'}`, color: '#0f172a' };
}

function focusStyle(el, hasError) {
  el.style.borderColor = hasError ? '#dc2626' : '#3b82f6';
  el.style.boxShadow   = hasError ? '0 0 0 3px rgba(220,38,38,0.12)' : '0 0 0 3px rgba(59,130,246,0.12)';
}

function blurStyle(el, hasError) {
  el.style.borderColor = hasError ? '#fca5a5' : '#e2e8f0';
  el.style.boxShadow   = 'none';
}

function sanitizeNumber(raw) {
  return raw.replace(/[^0-9.]/g, '').replace(/^(\d*\.?\d*).*$/, '$1');
}

function getFirstErrorName(errors, prefix) {
  if (!errors || typeof errors !== 'object') return null;
  const entries = Array.isArray(errors)
    ? errors.map((v, i) => [String(i), v]).filter(([, v]) => v != null)
    : Object.entries(errors).filter(([, v]) => v != null);
  for (const [key, val] of entries) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (val?.message || val?.type) return path;
    const nested = getFirstErrorName(val, path);
    if (nested) return nested;
  }
  return null;
}

// ─── Shared UI components ─────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {error && <p className="text-[11px] font-medium mt-0.5" style={{ color: '#dc2626' }}>{error.message}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6" style={{ border: '1px solid #e2e8f0' }}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
          <Icon size={14} style={{ color: '#2563eb' }} />
        </div>
        <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PaymentTermsComboBox({ value, onChange, onBlur, inputRef, hasError }) {
  const [open, setOpen] = useState(false);
  const localRef = useRef(null);
  const options = PAYMENT.filter(p => p);
  const filtered = value
    ? options.filter(o => o.toLowerCase().includes(value.toLowerCase()))
    : options;

  const setRefs = node => {
    localRef.current = node;
    if (typeof inputRef === 'function') inputRef(node);
    else if (inputRef) inputRef.current = node;
  };

  return (
    <div className="relative">
      <input
        ref={setRefs}
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { setOpen(true); focusStyle(e.target, hasError); }}
        onBlur={e => { setTimeout(() => setOpen(false), 150); blurStyle(e.target, hasError); onBlur(); }}
        placeholder="Enter Your Payment Terms"
        className={inp}
        style={bdrStyle(hasError)}
      />
      {open && (
        <div
          className="absolute z-50 left-0 right-0 overflow-y-auto rounded-xl shadow-lg"
          style={{ top: 'calc(100% + 4px)', background: '#fff', border: '1px solid #e2e8f0', maxHeight: 192 }}
        >
          {filtered.map(opt => (
            <button
              key={opt}
              type="button"
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50"
              style={{ color: '#0f172a' }}
            >
              {opt}
            </button>
          ))}
          <button
            type="button"
            onMouseDown={e => {
              e.preventDefault();
              onChange('');
              setOpen(false);
              localRef.current?.focus();
            }}
            className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50"
            style={{ color: '#0f172a' }}
          >
            Custom
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ItemRow — Controller for every field; useWatch only for total display ────

function ItemRow({ idx, control, errors, onRemove, canRemove, currency }) {
  const qty   = useWatch({ control, name: `items.${idx}.quantity`,        defaultValue: 1     });
  const price = useWatch({ control, name: `items.${idx}.unitPrice`,       defaultValue: 0     });
  const unit  = useWatch({ control, name: `items.${idx}.unit`,            defaultValue: 'PCS' });
  const upp   = useWatch({ control, name: `items.${idx}.unitsPerPackage`, defaultValue: ''    });
  const taxPercent = useWatch({ control, name: `items.${idx}.taxPercent`, defaultValue: 0     });
  const base = useMemo(
    () => calcLineTotal(qty, unit, price, upp),
    [qty, unit, price, upp]
  );
  const taxAmount = base * ((parseFloat(taxPercent) || 0) / 100);
  const total = base + taxAmount;
  const errs = errors?.items?.[idx];

  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td className="px-3 py-2 text-center text-xs" style={{ color: '#94a3b8', minWidth: 32 }}>
        {idx + 1}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 140 }}>
        <Controller
          control={control}
          name={`items.${idx}.productName`}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Product name"
              className={inpSm}
              style={bdrStyle(!!errs?.productName)}
              onFocus={e => focusStyle(e.target, !!errs?.productName)}
              onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.productName); }}
            />
          )}
        />
        {errs?.productName && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.productName.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 120 }}>
        <Controller
          control={control}
          name={`items.${idx}.description`}
          render={({ field }) => (
            <input
              {...field}
              placeholder="Brief description"
              className={inpSm}
              style={bdrStyle(!!errs?.description)}
              onFocus={e => focusStyle(e.target, !!errs?.description)}
              onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.description); }}
            />
          )}
        />
        {errs?.description && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.description.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 80 }}>
        <Controller
          control={control}
          name={`items.${idx}.hsCode`}
          render={({ field }) => (
            <input
              {...field}
              placeholder="732690"
              className={`${inpSm} font-mono`}
              style={bdrStyle(!!errs?.hsCode)}
              onFocus={e => focusStyle(e.target, !!errs?.hsCode)}
              onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.hsCode); }}
            />
          )}
        />
        {errs?.hsCode && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.hsCode.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 80 }}>
        <Controller
          control={control}
          name={`items.${idx}.quantity`}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <input
              ref={ref}
              type="text"
              inputMode="decimal"
              placeholder="1"
              value={value == null ? '' : String(value)}
              onChange={e => onChange(sanitizeNumber(e.target.value))}
              onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.quantity); }}
              onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.quantity); }}
              className={`${inpSm} text-right`}
              style={bdrStyle(!!errs?.quantity)}
            />
          )}
        />
        {needsUnitsPerPackage(unit) && (
          <Controller
            control={control}
            name={`items.${idx}.unitsPerPackage`}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                type="text"
                inputMode="decimal"
                placeholder="/pkg"
                title="Units per package"
                value={value == null ? '' : String(value)}
                onChange={e => onChange(sanitizeNumber(e.target.value))}
                onFocus={e => e.target.select()}
                onBlur={onBlur}
                className={`${inpSm} text-right mt-1`}
                style={bdrStyle(false)}
              />
            )}
          />
        )}
        {getConversionLabel(qty, unit, upp) && (
          <p className="text-[10px] mt-0.5 font-mono" style={{ color: '#2563eb' }}>
            {getConversionLabel(qty, unit, upp)}
          </p>
        )}
        {errs?.quantity && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.quantity.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 74 }}>
        <Controller
          control={control}
          name={`items.${idx}.unit`}
          render={({ field }) => (
            <select
              {...field}
              className={`${inpSm} cursor-pointer`}
              style={bdrStyle(!!errs?.unit)}
            >
              {UNITS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        />
        {errs?.unit && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.unit.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 90 }}>
        <Controller
          control={control}
          name={`items.${idx}.unitPrice`}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <input
              ref={ref}
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={value == null ? '' : String(value)}
              onChange={e => onChange(sanitizeNumber(e.target.value))}
              onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.unitPrice); }}
              onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.unitPrice); }}
              className={`${inpSm} text-right`}
              style={bdrStyle(!!errs?.unitPrice)}
            />
          )}
        />
        {errs?.unitPrice && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.unitPrice.message}</p>
        )}
      </td>

      <td className="px-2 py-2" style={{ minWidth: 64 }}>
        <Controller
          control={control}
          name={`items.${idx}.taxPercent`}
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <input
              ref={ref}
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={value == null ? '' : String(value)}
              onChange={e => onChange(sanitizeNumber(e.target.value))}
              onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.taxPercent); }}
              onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.taxPercent); }}
              className={`${inpSm} text-right`}
              style={bdrStyle(!!errs?.taxPercent)}
            />
          )}
        />
        {errs?.taxPercent && (
          <p className="text-[10px] mt-0.5" style={{ color: '#dc2626' }}>{errs.taxPercent.message}</p>
        )}
      </td>

      <td className="px-2 py-2 text-right font-semibold font-mono text-xs" style={{ color: '#0f172a', minWidth: 80 }}>
        {currencySymbol(currency)}{total.toFixed(2)}
      </td>

      <td className="px-2 py-2 text-center" style={{ minWidth: 36 }}>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </td>
    </tr>
  );
}

// ─── MobileItemCard — Controller for every field; useWatch only for total ──────

function MobileItemCard({ idx, control, errors, onRemove, canRemove, currency }) {
  const qty   = useWatch({ control, name: `items.${idx}.quantity`,        defaultValue: 1     });
  const price = useWatch({ control, name: `items.${idx}.unitPrice`,       defaultValue: 0     });
  const unit  = useWatch({ control, name: `items.${idx}.unit`,            defaultValue: 'PCS' });
  const upp   = useWatch({ control, name: `items.${idx}.unitsPerPackage`, defaultValue: ''    });
  const taxPercent = useWatch({ control, name: `items.${idx}.taxPercent`, defaultValue: 0     });
  const base = useMemo(
    () => calcLineTotal(qty, unit, price, upp),
    [qty, unit, price, upp]
  );
  const taxAmount = base * ((parseFloat(taxPercent) || 0) / 100);
  const total = base + taxAmount;
  const errs = errors?.items?.[idx];

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: '#2563eb' }}>Item {idx + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            style={{ color: '#ef4444' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Product Name" required error={errs?.productName}>
          <Controller
            control={control}
            name={`items.${idx}.productName`}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Product name"
                className={inp}
                style={bdrStyle(!!errs?.productName)}
                onFocus={e => focusStyle(e.target, !!errs?.productName)}
                onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.productName); }}
              />
            )}
          />
        </Field>

        <Field label="Description" required error={errs?.description}>
          <Controller
            control={control}
            name={`items.${idx}.description`}
            render={({ field }) => (
              <input
                {...field}
                placeholder="Brief description"
                className={inp}
                style={bdrStyle(!!errs?.description)}
                onFocus={e => focusStyle(e.target, !!errs?.description)}
                onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.description); }}
              />
            )}
          />
        </Field>

        <Field label="HS Code" required error={errs?.hsCode}>
          <Controller
            control={control}
            name={`items.${idx}.hsCode`}
            render={({ field }) => (
              <input
                {...field}
                placeholder="732690"
                className={`${inp} font-mono`}
                style={bdrStyle(!!errs?.hsCode)}
                onFocus={e => focusStyle(e.target, !!errs?.hsCode)}
                onBlur={e => { field.onBlur(); blurStyle(e.target, !!errs?.hsCode); }}
              />
            )}
          />
        </Field>

        <Field label="Unit" required error={errs?.unit}>
          <Controller
            control={control}
            name={`items.${idx}.unit`}
            render={({ field }) => (
              <select
                {...field}
                className={`${inp} cursor-pointer`}
                style={bdrStyle(!!errs?.unit)}
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            )}
          />
        </Field>

        <Field label="Quantity" required error={errs?.quantity}>
          <Controller
            control={control}
            name={`items.${idx}.quantity`}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                type="text"
                inputMode="decimal"
                placeholder="1"
                value={value == null ? '' : String(value)}
                onChange={e => onChange(sanitizeNumber(e.target.value))}
                onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.quantity); }}
                onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.quantity); }}
                className={inp}
                style={bdrStyle(!!errs?.quantity)}
              />
            )}
          />
          {getConversionLabel(qty, unit, upp) && (
            <p className="text-[11px] mt-1 font-mono" style={{ color: '#2563eb' }}>
              {getConversionLabel(qty, unit, upp)}
            </p>
          )}
        </Field>

        {needsUnitsPerPackage(unit) && (
          <Field label="Units Per Package">
            <Controller
              control={control}
              name={`items.${idx}.unitsPerPackage`}
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <input
                  ref={ref}
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g. 50"
                  value={value == null ? '' : String(value)}
                  onChange={e => onChange(sanitizeNumber(e.target.value))}
                  onFocus={e => e.target.select()}
                  onBlur={onBlur}
                  className={inp}
                  style={bdrStyle(false)}
                />
              )}
            />
          </Field>
        )}

        <Field label="Unit Price" required error={errs?.unitPrice}>
          <Controller
            control={control}
            name={`items.${idx}.unitPrice`}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={value == null ? '' : String(value)}
                onChange={e => onChange(sanitizeNumber(e.target.value))}
                onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.unitPrice); }}
                onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.unitPrice); }}
                className={inp}
                style={bdrStyle(!!errs?.unitPrice)}
              />
            )}
          />
        </Field>

        <Field label="Tax %" error={errs?.taxPercent}>
          <Controller
            control={control}
            name={`items.${idx}.taxPercent`}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <input
                ref={ref}
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={value == null ? '' : String(value)}
                onChange={e => onChange(sanitizeNumber(e.target.value))}
                onFocus={e => { e.target.select(); focusStyle(e.target, !!errs?.taxPercent); }}
                onBlur={e => { onBlur(); blurStyle(e.target, !!errs?.taxPercent); }}
                className={inp}
                style={bdrStyle(!!errs?.taxPercent)}
              />
            )}
          />
        </Field>
      </div>

      <div className="flex justify-end">
        <span className="text-xs font-bold font-mono px-3 py-1.5 rounded-lg" style={{ background: '#eff6ff', color: '#2563eb' }}>
          {currencySymbol(currency)} {total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

// ─── SummaryTotals — isolated so only it re-renders when items change ─────────

function SummaryTotals({ control, setValue, currency, orgGstNumber, draftPoNumber }) {
  const items       = useWatch({ control, name: 'items' });
  const buyerState  = useWatch({ control, name: 'buyerDetails.buyerState' });

  const subtotal = useMemo(
    () => (items || []).reduce(
      (s, it) => s + calcLineTotal(it?.quantity, it?.unit, it?.unitPrice, it?.unitsPerPackage),
      0
    ),
    [items]
  );
  const { cgst, sgst, igst } = useMemo(
    () => computePoGstSplit(items, currency, orgGstNumber, buyerState),
    [items, currency, orgGstNumber, buyerState]
  );
  const sym = currencySymbol(currency);

  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-14">
      <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1px solid #bfdbfe' }}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#2563eb' }}>Order Summary</h3>
        <div className="flex justify-between text-xs mb-3">
          <span style={{ color: '#64748b' }}>Items</span>
          <span className="font-semibold" style={{ color: '#0f172a' }}>{(items || []).length}</span>
        </div>

        <GstSummaryBox
          control={control}
          setValue={setValue}
          subtotal={subtotal}
          computedCgst={cgst}
          computedSgst={sgst}
          computedIgst={igst}
          currency={sym}
          prefix="summary"
          grandTotalField="grandTotal"
        />

        {draftPoNumber && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #bfdbfe' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>PO Number</p>
            <p className="text-xs font-mono font-bold" style={{ color: '#0f172a' }}>{draftPoNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PurchaseOrderPage() {
  const { organization: org } = useOrganization();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const { draft, loading, saving, error, saveDraft, saveAndNavigateToReview, loadById, clearDraft } = usePurchaseOrder();

  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    resolver:         zodResolver(schema),
    defaultValues:    DEFAULTS,
    mode:             'all',
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const currency = watch('orderDetails.currency') || 'INR';

  useEffect(() => {
    if (draftId) {
      loadById(draftId);
    } else {
      clearDraft();
      reset(DEFAULTS);
    }
  }, [draftId, loadById, clearDraft, reset]);

  useEffect(() => {
    if (draft) reset(draftToForm(draft));
  }, [draft, reset]);

  const onInvalid = useCallback((errs) => {
    const name = getFirstErrorName(errs);
    if (!name) return;
    try { setFocus(name); } catch (_) {}
    requestAnimationFrame(() => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [setFocus]);

  const onSaveDraft = useCallback(
    () => {
      setSubmitError('');
      handleSubmit(async (data) => { await saveDraft({ ...data, documentId: draft?._id }); }, onInvalid)();
    },
    [handleSubmit, saveDraft, onInvalid, draft]
  );

  const onSaveAndGenerate = useCallback(
    () => {
      setSubmitError('');
      handleSubmit(async (data) => { await saveAndNavigateToReview({ ...data, documentId: draft?._id }); }, onInvalid)();
    },
    [handleSubmit, saveAndNavigateToReview, onInvalid, draft]
  );

  return (
    <OrgRequiredGate>
    {loading ? (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={32} style={{ color: '#2563eb' }} />
      </div>
    ) : (
    <div>
      {/* Page title */}
      <div className="px-4 sm:px-6 md:px-8 pt-5 pb-1">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
          >
            <FileText size={15} color="white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0f172a' }}>Purchase Order</h1>
            {draft?.purchaseOrderNumber
              ? <p className="text-xs font-mono" style={{ color: '#2563eb' }}>{draft.purchaseOrderNumber}</p>
              : <p className="text-xs" style={{ color: '#94a3b8' }}>Auto-number on first save</p>
            }
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm" style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold truncate" style={{ color: '#0f172a' }}>
              {draft?.purchaseOrderNumber || 'New Purchase Order'}
            </span>
            <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(100,116,139,0.1)', color: '#475569' }}>
              DRAFT
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={saving}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all hover:bg-slate-50 active:scale-[0.97] disabled:opacity-50"
              style={{ border: '1px solid #e2e8f0', color: '#475569' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <button
              type="button"
              onClick={onSaveAndGenerate}
              disabled={saving || !isValid}
              title={!isValid ? 'Complete all required fields to enable' : undefined}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <FileCheck size={14} />}
              <span className="hidden sm:inline">Save &amp; Generate</span>
              <span className="sm:hidden">Generate</span>
            </button>
          </div>
        </div>
        {(error || submitError) && (
          <div className="px-4 sm:px-6 md:px-8 pb-2 max-w-7xl mx-auto">
            <p className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#dc2626' }}>{error || submitError}</p>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

          <div className="flex-1 min-w-0 space-y-5">

            {org && (
              <div className="rounded-2xl p-4 sm:p-5 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1px solid #bfdbfe' }}>
                {org.logoUrl
                  ? <img src={org.logoUrl} alt="logo" className="w-12 h-12 rounded-xl object-contain shrink-0" style={{ border: '1px solid #dbeafe' }} />
                  : <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold" style={{ background: '#2563eb', color: '#fff' }}>{(org.organizationName || '?')[0]}</div>
                }
                <div>
                  <p className="font-bold text-sm" style={{ color: '#0f172a' }}>{org.organizationName}</p>
                  {org.contact?.address && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{org.contact.address}</p>}
                  {(org.gstNumber || org.kyc?.gst?.number) && <p className="text-xs mt-0.5 font-mono" style={{ color: '#2563eb' }}>GST: {org.gstNumber || org.kyc.gst.number}</p>}
                </div>
              </div>
            )}

            <Section title="Buyer / Bill-To Details" icon={Users}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Name" required error={errors.buyerDetails?.buyerName}>
                  <input {...register('buyerDetails.buyerName')} placeholder="John Smith" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerName)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerName)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerName)} />
                </Field>
                <Field label="Company Name" required error={errors.buyerDetails?.buyerCompany}>
                  <input {...register('buyerDetails.buyerCompany')} placeholder="Acme Corp" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerCompany)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerCompany)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerCompany)} />
                </Field>
                <Field label="Address" required error={errors.buyerDetails?.buyerAddress}>
                  <input {...register('buyerDetails.buyerAddress')} placeholder="Street address" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerAddress)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerAddress)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerAddress)} />
                </Field>
                <Field label="City" error={errors.buyerDetails?.buyerCity}>
                  <input {...register('buyerDetails.buyerCity')} placeholder="Mumbai" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="State" error={errors.buyerDetails?.buyerState}>
                  <input {...register('buyerDetails.buyerState')} placeholder="Maharashtra" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Postal Code" error={errors.buyerDetails?.buyerPostalCode}>
                  <input {...register('buyerDetails.buyerPostalCode')} placeholder="400001" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Country" required error={errors.buyerDetails?.buyerCountry}>
                  <input {...register('buyerDetails.buyerCountry')} placeholder="India" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerCountry)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerCountry)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerCountry)} />
                </Field>
                <Field label="GST Number" error={errors.buyerDetails?.buyerGstNumber}>
                  <input {...register('buyerDetails.buyerGstNumber')} placeholder="22AAAAA0000A1Z5" className={`${inp} font-mono uppercase`} style={bdrStyle(!!errors.buyerDetails?.buyerGstNumber)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerGstNumber)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerGstNumber)} />
                </Field>
                <Field label="Email" required error={errors.buyerDetails?.buyerEmail}>
                  <input {...register('buyerDetails.buyerEmail')} type="email" placeholder="buyer@company.com" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerEmail)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerEmail)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerEmail)} />
                </Field>
                <Field label="Phone" required error={errors.buyerDetails?.buyerPhone}>
                  <input {...register('buyerDetails.buyerPhone')} placeholder="+91 98765 43210" className={inp} style={bdrStyle(!!errors.buyerDetails?.buyerPhone)} onFocus={e => focusStyle(e.target, !!errors.buyerDetails?.buyerPhone)} onBlur={e => blurStyle(e.target, !!errors.buyerDetails?.buyerPhone)} />
                </Field>
              </div>
            </Section>

            <Section title="Ship To Details" icon={MapPin}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" required error={errors.shipToDetails?.companyName}>
                  <input {...register('shipToDetails.companyName')} placeholder="Warehouse LLC" className={inp} style={bdrStyle(!!errors.shipToDetails?.companyName)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.companyName)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.companyName)} />
                </Field>
                <Field label="Contact Person" required error={errors.shipToDetails?.contactPerson}>
                  <input {...register('shipToDetails.contactPerson')} placeholder="Store Manager" className={inp} style={bdrStyle(!!errors.shipToDetails?.contactPerson)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.contactPerson)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.contactPerson)} />
                </Field>
                <Field label="Address" required error={errors.shipToDetails?.address}>
                  <input {...register('shipToDetails.address')} placeholder="Delivery address" className={inp} style={bdrStyle(!!errors.shipToDetails?.address)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.address)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.address)} />
                </Field>
                <Field label="City" error={errors.shipToDetails?.city}>
                  <input {...register('shipToDetails.city')} placeholder="Delhi" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="State" error={errors.shipToDetails?.state}>
                  <input {...register('shipToDetails.state')} placeholder="Delhi" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Postal Code" error={errors.shipToDetails?.postalCode}>
                  <input {...register('shipToDetails.postalCode')} placeholder="110001" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Country" required error={errors.shipToDetails?.country}>
                  <input {...register('shipToDetails.country')} placeholder="India" className={inp} style={bdrStyle(!!errors.shipToDetails?.country)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.country)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.country)} />
                </Field>
                <Field label="Phone" required error={errors.shipToDetails?.phone}>
                  <input {...register('shipToDetails.phone')} placeholder="+91 98765 43210" className={inp} style={bdrStyle(!!errors.shipToDetails?.phone)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.phone)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.phone)} />
                </Field>
                <Field label="Email" error={errors.shipToDetails?.email}>
                  <input {...register('shipToDetails.email')} type="email" placeholder="warehouse@company.com" className={inp} style={bdrStyle(!!errors.shipToDetails?.email)} onFocus={e => focusStyle(e.target, !!errors.shipToDetails?.email)} onBlur={e => blurStyle(e.target, !!errors.shipToDetails?.email)} />
                </Field>
              </div>
            </Section>

            <Section title="Order Details" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="PO Date" required error={errors.orderDetails?.poDate}>
                  <input {...register('orderDetails.poDate')} type="date" min={TODAY} className={inp} style={bdrStyle(!!errors.orderDetails?.poDate)} onFocus={e => focusStyle(e.target, !!errors.orderDetails?.poDate)} onBlur={e => blurStyle(e.target, !!errors.orderDetails?.poDate)} />
                </Field>
                <Field label="Expected Delivery" required error={errors.orderDetails?.expectedDelivery}>
                  <input {...register('orderDetails.expectedDelivery')} type="date" min={TODAY} className={inp} style={bdrStyle(!!errors.orderDetails?.expectedDelivery)} onFocus={e => focusStyle(e.target, !!errors.orderDetails?.expectedDelivery)} onBlur={e => blurStyle(e.target, !!errors.orderDetails?.expectedDelivery)} />
                </Field>
                <Field label="Currency" required error={errors.orderDetails?.currency}>
                  <select {...register('orderDetails.currency')} className={`${inp} cursor-pointer`} style={bdrStyle(!!errors.orderDetails?.currency)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{currencySymbol(c)} {c}</option>)}
                  </select>
                </Field>
                <Field label="Payment Terms" required error={errors.orderDetails?.paymentTerms}>
                  <Controller
                    control={control}
                    name="orderDetails.paymentTerms"
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <PaymentTermsComboBox
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputRef={ref}
                        hasError={!!errors.orderDetails?.paymentTerms}
                      />
                    )}
                  />
                </Field>
                <Field label="Incoterms" required error={errors.orderDetails?.incoterms}>
                  <select {...register('orderDetails.incoterms')} className={`${inp} cursor-pointer`} style={bdrStyle(!!errors.orderDetails?.incoterms)}>
                    {INCOTERMS.map(t => <option key={t} value={t}>{t || '— Select —'}</option>)}
                  </select>
                </Field>
                <Field label="Shipment Mode" error={errors.orderDetails?.shipmentMode}>
                  <select {...register('orderDetails.shipmentMode')} className={`${inp} cursor-pointer`} style={bdrStyle(false)}>
                    {SHIPMENT.map(s => <option key={s} value={s}>{s || '— Select —'}</option>)}
                  </select>
                </Field>
                <Field label="Port of Loading" error={errors.orderDetails?.portOfLoading}>
                  <input {...register('orderDetails.portOfLoading')} placeholder="INBOM — Mumbai" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Port of Discharge" error={errors.orderDetails?.portOfDischarge}>
                  <input {...register('orderDetails.portOfDischarge')} placeholder="INDEL — Delhi" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
              </div>
            </Section>

            {/* ── Line Items ── */}
            <div className="rounded-2xl bg-white p-5 sm:p-6" style={{ border: '1px solid #e2e8f0' }}>
              <div className="flex items-center justify-between gap-2 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,99,235,0.1)' }}>
                    <ChevronRight size={14} style={{ color: '#2563eb' }} />
                  </div>
                  <h2 className="text-sm font-bold" style={{ color: '#0f172a' }}>Line Items</h2>
                </div>
                <button
                  type="button"
                  onClick={() => append({ itemNumber:'', productName:'', description:'', hsCode:'', quantity:1, unit:'PCS', unitsPerPackage:'', unitPrice:0, taxPercent:0 })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-blue-50 active:scale-[0.97]"
                  style={{ border: '1px solid #bfdbfe', color: '#2563eb' }}
                >
                  <Plus size={12} />
                  Add Item
                </button>
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {[
                        { h: '#',            req: false },
                        { h: 'Product Name', req: true  },
                        { h: 'Description',  req: true  },
                        { h: 'HS Code',      req: true  },
                        { h: 'Qty',          req: true  },
                        { h: 'Unit',         req: true  },
                        { h: 'Unit Price',   req: true  },
                        { h: 'Tax %',        req: false },
                        { h: 'Total',        req: false },
                        { h: '',             req: false },
                      ].map(({ h, req }) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider"
                          style={{ color: '#64748b' }}
                        >
                          {h}{req && <span style={{ color: '#ef4444' }}> *</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, idx) => (
                      <ItemRow
                        key={field.id}
                        idx={idx}
                        control={control}
                        errors={errors}
                        onRemove={() => remove(idx)}
                        canRemove={fields.length > 1}
                        currency={currency}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden space-y-3">
                <AnimatePresence initial={false}>
                  {fields.map((field, idx) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <MobileItemCard
                        idx={idx}
                        control={control}
                        errors={errors}
                        onRemove={() => remove(idx)}
                        canRemove={fields.length > 1}
                        currency={currency}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {errors.items && typeof errors.items.message === 'string' && (
                <p className="mt-3 text-xs font-medium" style={{ color: '#dc2626' }}>{errors.items.message}</p>
              )}
            </div>

            <Section title="Bank Details" icon={Landmark}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Bank Name" required error={errors.bankDetails?.bankName}>
                  <input {...register('bankDetails.bankName')} placeholder="State Bank of India" className={inp} style={bdrStyle(!!errors.bankDetails?.bankName)} onFocus={e => focusStyle(e.target, !!errors.bankDetails?.bankName)} onBlur={e => blurStyle(e.target, !!errors.bankDetails?.bankName)} />
                </Field>
                <Field label="Account Holder Name" required error={errors.bankDetails?.accountName}>
                  <input {...register('bankDetails.accountName')} placeholder="Acme Corp" className={inp} style={bdrStyle(!!errors.bankDetails?.accountName)} onFocus={e => focusStyle(e.target, !!errors.bankDetails?.accountName)} onBlur={e => blurStyle(e.target, !!errors.bankDetails?.accountName)} />
                </Field>
                <Field label="Account Number" required error={errors.bankDetails?.accountNumber}>
                  <input {...register('bankDetails.accountNumber')} placeholder="0001234567890" className={`${inp} font-mono`} style={bdrStyle(!!errors.bankDetails?.accountNumber)} onFocus={e => focusStyle(e.target, !!errors.bankDetails?.accountNumber)} onBlur={e => blurStyle(e.target, !!errors.bankDetails?.accountNumber)} />
                </Field>
                <Field label="IFSC Code (or SWIFT)" required error={errors.bankDetails?.ifsc}>
                  <input {...register('bankDetails.ifsc')} placeholder="SBIN0001234" className={`${inp} font-mono uppercase`} style={bdrStyle(!!errors.bankDetails?.ifsc)} onFocus={e => focusStyle(e.target, !!errors.bankDetails?.ifsc)} onBlur={e => blurStyle(e.target, !!errors.bankDetails?.ifsc)} />
                </Field>
                <Field label="SWIFT Code" error={errors.bankDetails?.swift}>
                  <input {...register('bankDetails.swift')} placeholder="SBININBB" className={`${inp} font-mono uppercase`} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Branch" error={errors.bankDetails?.branch}>
                  <input {...register('bankDetails.branch')} placeholder="Nariman Point Branch" className={inp} style={bdrStyle(false)} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
              </div>
            </Section>

            <Section title="Notes &amp; Signatures" icon={MessageSquare}>
              <div className="space-y-4">
                <Field label="Terms &amp; Conditions" error={errors.notes?.termsAndConditions}>
                  <textarea {...register('notes.termsAndConditions')} rows={3} placeholder="E.g. All goods must be delivered in original packaging..." className={inp} style={{ ...bdrStyle(false), resize: 'vertical' }} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <Field label="Additional Notes" error={errors.notes?.additionalNotes}>
                  <textarea {...register('notes.additionalNotes')} rows={2} placeholder="Any other instructions..." className={inp} style={{ ...bdrStyle(false), resize: 'vertical' }} onFocus={e => focusStyle(e.target, false)} onBlur={e => blurStyle(e.target, false)} />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Authorized Signatory" required error={errors.notes?.signatory}>
                    <input {...register('notes.signatory')} placeholder="Full name" className={inp} style={bdrStyle(!!errors.notes?.signatory)} onFocus={e => focusStyle(e.target, !!errors.notes?.signatory)} onBlur={e => blurStyle(e.target, !!errors.notes?.signatory)} />
                  </Field>
                  <Field label="Designation" required error={errors.notes?.signatoryDesignation}>
                    <input {...register('notes.signatoryDesignation')} placeholder="Procurement Manager" className={inp} style={bdrStyle(!!errors.notes?.signatoryDesignation)} onFocus={e => focusStyle(e.target, !!errors.notes?.signatoryDesignation)} onBlur={e => blurStyle(e.target, !!errors.notes?.signatoryDesignation)} />
                  </Field>
                </div>
              </div>
            </Section>

          </div>

          <SummaryTotals
            control={control}
            setValue={setValue}
            currency={currency}
            orgGstNumber={org?.gstNumber || org?.kyc?.gst?.number}
            draftPoNumber={draft?.purchaseOrderNumber}
          />
        </div>
      </div>
    </div>
    )}
    </OrgRequiredGate>
  );
}
