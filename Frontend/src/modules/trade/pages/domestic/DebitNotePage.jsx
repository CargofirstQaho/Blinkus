import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FilePlus, Hash, Building2, Calculator, MessageSquare, Truck } from 'lucide-react';

import { debitNoteSchema, debitNoteDefaults } from '../../domestic/debit-note/debitNoteSchema';
import FormSection from '../../domestic/shared/FormSection';
import FormField from '../../domestic/shared/FormField';
import PartySection from '../../domestic/shared/PartySection';
import LineItemsTable from '../../domestic/shared/LineItemsTable';
import TaxBreakdown from '../../domestic/shared/TaxBreakdown';
import DocumentActions from '../../domestic/shared/DocumentActions';
import DocumentSummaryCard from '../../domestic/shared/DocumentSummaryCard';
import { computeTotals } from '../../domestic/shared/utils';

const base = 'w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all bg-white placeholder:text-slate-400';
const bdr = (err) => ({ border: `1px solid ${err ? '#fca5a5' : '#e2e8f0'}`, color: '#0f172a' });
const fOn = (ev, err) => {
  ev.target.style.borderColor = err ? '#dc2626' : '#3b82f6';
  ev.target.style.boxShadow = err ? '0 0 0 3px rgba(220,38,38,0.12)' : '0 0 0 3px rgba(59,130,246,0.12)';
};
const fOff = (ev, err) => {
  ev.target.style.borderColor = err ? '#fca5a5' : '#e2e8f0';
  ev.target.style.boxShadow = 'none';
};

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD'];
const STATUSES   = [
  { value: 'draft',    label: 'Draft'    },
  { value: 'pending',  label: 'Pending'  },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];
const DEBIT_REASONS = [
  'Price Difference / Undercharge',
  'Additional Freight Charges',
  'Insurance Charges',
  'Loading / Unloading Charges',
  'Quality Penalty',
  'Late Delivery Penalty',
  'Short Supply Recovery',
  'Other',
];

export default function DebitNotePage() {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(debitNoteSchema),
    defaultValues: debitNoteDefaults,
    mode: 'onBlur',
  });

  const lineItems    = watch('lineItems') || [];
  const taxType      = watch('taxType') || 'cgst_sgst';
  const dnNumber     = watch('dnNumber');
  const status       = watch('status') || 'draft';
  const freight      = parseFloat(watch('freight'))      || 0;
  const insurance    = parseFloat(watch('insurance'))    || 0;
  const handling     = parseFloat(watch('handling'))     || 0;
  const otherCharges = parseFloat(watch('otherCharges')) || 0;
  const addlCharges  = freight + insurance + handling + otherCharges;

  const totals     = computeTotals(lineItems, 0);
  const grandTotal = totals.grandTotal + addlCharges;

  const onSubmit      = (_data) => { /* API integration — to be implemented */ };
  const onSaveAsDraft = ()      => { /* Draft save — to be implemented */     };

  return (
    <div>
      {/* Page title */}
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-1">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)', boxShadow: '0 2px 8px rgba(8,145,178,0.3)' }}
          >
            <FilePlus size={15} color="white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0f172a' }}>
              Debit Note
            </h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Raise a debit note for additional charges or corrections</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DocumentActions documentType="Debit Note" status={status} onSaveAsDraft={onSaveAsDraft} />

        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">

            <div className="flex-1 min-w-0 space-y-5">

              {/* 1 · Debit Note Info */}
              <FormSection title="Debit Note Information" icon={Hash}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="Debit Note Number" required error={errors.dnNumber}>
                    <input
                      {...register('dnNumber')}
                      placeholder="DN-2026-0001"
                      className={`${base} font-mono`}
                      style={bdr(!!errors.dnNumber)}
                      onFocus={(ev) => fOn(ev, !!errors.dnNumber)}
                      onBlur={(ev) => fOff(ev, !!errors.dnNumber)}
                    />
                  </FormField>

                  <FormField label="Debit Note Date" required error={errors.dnDate}>
                    <input
                      {...register('dnDate')}
                      type="date"
                      className={base}
                      style={bdr(!!errors.dnDate)}
                      onFocus={(ev) => fOn(ev, !!errors.dnDate)}
                      onBlur={(ev) => fOff(ev, !!errors.dnDate)}
                    />
                  </FormField>

                  <FormField label="Original PO / Invoice No." error={errors.originalPoNo}>
                    <input
                      {...register('originalPoNo')}
                      placeholder="PO-2026-XXXX"
                      className={`${base} font-mono`}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Original PO Date" error={errors.originalPoDate}>
                    <input
                      {...register('originalPoDate')}
                      type="date"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Currency" error={errors.currency}>
                    <select {...register('currency')} className={`${base} cursor-pointer`} style={bdr(false)}>
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Status" error={errors.status}>
                    <select {...register('status')} className={`${base} cursor-pointer`} style={bdr(false)}>
                      {STATUSES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <FormField label="Reason for Debit" error={errors.debitReason}>
                      <select {...register('debitReason')} className={`${base} cursor-pointer`} style={bdr(false)}>
                        <option value="">— Select Reason —</option>
                        {DEBIT_REASONS.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* 2 · Vendor */}
              <PartySection
                title="Vendor Details"
                icon={Building2}
                prefix="vendor"
                register={register}
                errors={errors}
                nameLabel="Vendor Name"
                showFullAddress={false}
              />

              {/* 3 · Charge Items */}
              <LineItemsTable
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                mode="dn"
              />

              {/* 4 · Additional Charges & Tax */}
              <FormSection title="Additional Charges &amp; Tax" icon={Calculator}>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Tax Mode</p>
                    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                      {[
                        { value: 'cgst_sgst', label: 'CGST + SGST (Same State)' },
                        { value: 'igst',      label: 'IGST (Interstate)'        },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex-1 flex items-center justify-center py-2.5 cursor-pointer text-xs font-medium transition-all"
                          style={taxType === value ? { background: '#0891b2', color: '#fff' } : { color: '#64748b', background: '#f8fafc' }}
                        >
                          <input {...register('taxType')} type="radio" value={value} className="sr-only" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional charges */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>
                      Additional Charges (₹)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <FormField label="Freight" error={errors.freight}>
                        <input {...register('freight')} type="number" min="0" step="any" placeholder="0.00"
                          className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                      </FormField>
                      <FormField label="Insurance" error={errors.insurance}>
                        <input {...register('insurance')} type="number" min="0" step="any" placeholder="0.00"
                          className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                      </FormField>
                      <FormField label="Handling" error={errors.handling}>
                        <input {...register('handling')} type="number" min="0" step="any" placeholder="0.00"
                          className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                      </FormField>
                      <FormField label="Other Charges" error={errors.otherCharges}>
                        <input {...register('otherCharges')} type="number" min="0" step="any" placeholder="0.00"
                          className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                      </FormField>
                    </div>
                  </div>

                  <TaxBreakdown
                    subtotal={totals.subtotal}
                    cgst={totals.cgst}
                    sgst={totals.sgst}
                    igst={totals.igst}
                    totalTax={totals.totalTax}
                    grandTotal={totals.grandTotal}
                    taxType={taxType}
                    otherCharges={0}
                  />

                  {addlCharges > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(8,145,178,0.06)', border: '1px solid rgba(8,145,178,0.15)' }}>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#0f172a' }}>Total Debit Amount</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                          Incl. ₹{addlCharges.toFixed(2)} additional charges
                        </p>
                      </div>
                      <span className="text-xl font-bold tabular-nums" style={{ color: '#0891b2' }}>
                        {grandTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </FormSection>

              {/* 5 · Notes */}
              <FormSection title="Reason &amp; Internal Notes" icon={MessageSquare}>
                <div className="space-y-4">
                  <FormField label="Reason Details" error={errors.reasonDetails}>
                    <textarea
                      {...register('reasonDetails')}
                      rows={3}
                      placeholder="Describe the reason for this debit note in detail..."
                      className={base}
                      style={{ ...bdr(false), resize: 'none' }}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                  <FormField label="Internal Notes" error={errors.internalNotes}>
                    <textarea
                      {...register('internalNotes')}
                      rows={2}
                      placeholder="Internal notes (not visible to vendor)..."
                      className={base}
                      style={{ ...bdr(false), resize: 'none' }}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                </div>
              </FormSection>
            </div>

            {/* Right: summary card */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-14">
              <DocumentSummaryCard
                documentType="Debit Note"
                docNumber={dnNumber}
                status={status}
                itemCount={lineItems.length}
                subtotal={totals.subtotal}
                totalTax={totals.totalTax}
                grandTotal={grandTotal}
              />
            </div>
          </div>

          {/* Mobile summary */}
          <div className="lg:hidden mt-5">
            <DocumentSummaryCard
              documentType="Debit Note"
              docNumber={dnNumber}
              status={status}
              itemCount={lineItems.length}
              subtotal={totals.subtotal}
              totalTax={totals.totalTax}
              grandTotal={grandTotal}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
