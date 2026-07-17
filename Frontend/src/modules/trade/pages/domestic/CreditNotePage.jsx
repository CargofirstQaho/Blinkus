import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileMinus, Hash, User, RotateCcw, MessageSquare } from 'lucide-react';

import { creditNoteSchema, creditNoteDefaults } from '../../domestic/credit-note/creditNoteSchema';
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
const CREDIT_REASONS = [
  'Damaged / Defective Goods',
  'Wrong Item Delivered',
  'Quantity Shortage',
  'Quality Issue',
  'Price Correction',
  'Order Cancellation',
  'Excess Billing',
  'Other',
];

export default function CreditNotePage() {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(creditNoteSchema),
    defaultValues: creditNoteDefaults,
    mode: 'onBlur',
  });

  const lineItems       = watch('lineItems') || [];
  const taxType         = watch('taxType') || 'cgst_sgst';
  const cnNumber        = watch('cnNumber');
  const status          = watch('status') || 'draft';
  const restockingFee   = parseFloat(watch('restockingFee')) || 0;
  const handlingCharges = parseFloat(watch('handlingCharges')) || 0;
  const otherAdj        = parseFloat(watch('otherAdjustments')) || 0;
  const deductions      = restockingFee + handlingCharges + Math.abs(otherAdj);

  const totals    = computeTotals(lineItems, 0);
  const netCredit = Math.max(totals.grandTotal - deductions, 0);

  const onSubmit     = (_data) => { /* API integration — to be implemented */ };
  const onSaveAsDraft = ()     => { /* Draft save — to be implemented */     };

  return (
    <div>
      {/* Page title */}
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-1">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}
          >
            <FileMinus size={15} color="white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0f172a' }}>
              Credit Note
            </h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>Issue a credit note against a previous invoice</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DocumentActions documentType="Credit Note" status={status} onSaveAsDraft={onSaveAsDraft} />

        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">

            <div className="flex-1 min-w-0 space-y-5">

              {/* 1 · Credit Note Info */}
              <FormSection title="Credit Note Information" icon={Hash}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="Credit Note Number" required error={errors.cnNumber}>
                    <input
                      {...register('cnNumber')}
                      placeholder="CN-2026-0001"
                      className={`${base} font-mono`}
                      style={bdr(!!errors.cnNumber)}
                      onFocus={(ev) => fOn(ev, !!errors.cnNumber)}
                      onBlur={(ev) => fOff(ev, !!errors.cnNumber)}
                    />
                  </FormField>

                  <FormField label="Credit Note Date" required error={errors.cnDate}>
                    <input
                      {...register('cnDate')}
                      type="date"
                      className={base}
                      style={bdr(!!errors.cnDate)}
                      onFocus={(ev) => fOn(ev, !!errors.cnDate)}
                      onBlur={(ev) => fOff(ev, !!errors.cnDate)}
                    />
                  </FormField>

                  <FormField label="Original Invoice No." error={errors.originalInvoiceNo}>
                    <input
                      {...register('originalInvoiceNo')}
                      placeholder="INV-2026-XXXX"
                      className={`${base} font-mono`}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Original Invoice Date" error={errors.originalInvoiceDate}>
                    <input
                      {...register('originalInvoiceDate')}
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
                    <FormField label="Reason for Credit" error={errors.creditReason}>
                      <select {...register('creditReason')} className={`${base} cursor-pointer`} style={bdr(false)}>
                        <option value="">— Select Reason —</option>
                        {CREDIT_REASONS.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </FormField>
                  </div>
                </div>
              </FormSection>

              {/* 2 · Customer */}
              <PartySection
                title="Customer Details"
                icon={User}
                prefix="customer"
                register={register}
                errors={errors}
                nameLabel="Customer Name"
                showFullAddress={false}
              />

              {/* 3 · Credit Items */}
              <LineItemsTable
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                mode="cn"
              />

              {/* 4 · Adjustments & Tax */}
              <FormSection title="Credit Adjustments &amp; Tax" icon={RotateCcw}>
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
                          style={taxType === value ? { background: '#7c3aed', color: '#fff' } : { color: '#64748b', background: '#f8fafc' }}
                        >
                          <input {...register('taxType')} type="radio" value={value} className="sr-only" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="Restocking Fee (₹)" error={errors.restockingFee}>
                      <input {...register('restockingFee')} type="number" min="0" step="any" placeholder="0.00"
                        className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                    </FormField>
                    <FormField label="Handling Charges (₹)" error={errors.handlingCharges}>
                      <input {...register('handlingCharges')} type="number" min="0" step="any" placeholder="0.00"
                        className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                    </FormField>
                    <FormField label="Other Adjustments (₹)" error={errors.otherAdjustments}>
                      <input {...register('otherAdjustments')} type="number" step="any" placeholder="0.00"
                        className={base} style={bdr(false)} onFocus={(ev) => fOn(ev, false)} onBlur={(ev) => fOff(ev, false)} />
                    </FormField>
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

                  {deductions > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#0f172a' }}>Net Credit Amount</p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                          After deducting ₹{deductions.toFixed(2)} in charges
                        </p>
                      </div>
                      <span className="text-xl font-bold tabular-nums" style={{ color: '#7c3aed' }}>
                        {netCredit.toFixed(2)}
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
                      placeholder="Describe the reason for this credit note in detail..."
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
                      placeholder="Internal notes (not visible to customer)..."
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
                documentType="Credit Note"
                docNumber={cnNumber}
                status={status}
                itemCount={lineItems.length}
                subtotal={totals.subtotal}
                totalTax={totals.totalTax}
                grandTotal={deductions > 0 ? netCredit : totals.grandTotal}
              />
            </div>
          </div>

          {/* Mobile summary */}
          <div className="lg:hidden mt-5">
            <DocumentSummaryCard
              documentType="Credit Note"
              docNumber={cnNumber}
              status={status}
              itemCount={lineItems.length}
              subtotal={totals.subtotal}
              totalTax={totals.totalTax}
              grandTotal={deductions > 0 ? netCredit : totals.grandTotal}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
