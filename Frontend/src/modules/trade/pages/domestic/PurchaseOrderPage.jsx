import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileText, Calendar, Hash, Globe, Truck, Building2,
  Users, MapPin, List, Calculator, BookOpen, MessageSquare,
} from 'lucide-react';

import { purchaseOrderSchema, purchaseOrderDefaults } from '../../domestic/purchase-order/purchaseOrderSchema';
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

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'JPY', 'CNY'];
const INCOTERMS  = ['', 'EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
const STATUSES   = [
  { value: 'draft',     label: 'Draft'     },
  { value: 'pending',   label: 'Pending'   },
  { value: 'approved',  label: 'Approved'  },
  { value: 'rejected',  label: 'Rejected'  },
  { value: 'cancelled', label: 'Cancelled' },
];
const PAYMENT_TERMS  = ['Net 30', 'Net 60', 'Net 90', 'Immediate', '50% Advance', 'Full Advance', 'LC at Sight'];
const SHIPPING_METHODS = ['Road', 'Rail', 'Air', 'Sea', 'Courier', 'Hand Delivery'];

export default function PurchaseOrderPage() {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: purchaseOrderDefaults,
    mode: 'onBlur',
  });

  const lineItems    = watch('lineItems') || [];
  const otherCharges = watch('otherCharges') || 0;
  const taxType      = watch('taxType') || 'cgst_sgst';
  const currency     = watch('currency') || 'INR';
  const poNumber     = watch('poNumber');
  const status       = watch('status') || 'draft';

  const totals = computeTotals(lineItems, otherCharges);

  const onSubmit = (_data) => {
    // API integration — to be implemented
  };

  const onSaveAsDraft = () => {
    // Draft save — to be implemented
  };

  return (
    <div>
      {/* Page title */}
      <div className="px-4 sm:px-6 md:px-8 pt-5 sm:pt-6 pb-1">
        <div className="flex items-center gap-2 max-w-7xl mx-auto">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)', boxShadow: '0 2px 8px rgba(37,99,235,0.3)' }}
          >
            <FileText size={15} color="white" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold leading-tight" style={{ color: '#0f172a' }}>
              Purchase Order
            </h1>
            <p className="text-xs" style={{ color: '#94a3b8' }}>
              Create a new domestic purchase order
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Sticky action bar ── */}
        <DocumentActions
          documentType="Purchase Order"
          status={status}
          onSaveAsDraft={onSaveAsDraft}
        />

        {/* ── Main content ── */}
        <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-6 items-start">

            {/* ── Form columns ── */}
            <div className="flex-1 min-w-0 space-y-5">

              {/* 1 · Document Info */}
              <FormSection title="Document Information" icon={Hash}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="PO Number" required error={errors.poNumber}>
                    <input
                      {...register('poNumber')}
                      placeholder="PO-2026-0001"
                      className={`${base} font-mono`}
                      style={bdr(!!errors.poNumber)}
                      onFocus={(ev) => fOn(ev, !!errors.poNumber)}
                      onBlur={(ev) => fOff(ev, !!errors.poNumber)}
                    />
                  </FormField>

                  <FormField label="PO Date" required error={errors.poDate}>
                    <input
                      {...register('poDate')}
                      type="date"
                      className={base}
                      style={bdr(!!errors.poDate)}
                      onFocus={(ev) => fOn(ev, !!errors.poDate)}
                      onBlur={(ev) => fOff(ev, !!errors.poDate)}
                    />
                  </FormField>

                  <FormField label="Delivery Date" error={errors.deliveryDate}>
                    <input
                      {...register('deliveryDate')}
                      type="date"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Reference Number" error={errors.referenceNumber}>
                    <input
                      {...register('referenceNumber')}
                      placeholder="REF-001"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Currency" required error={errors.currency}>
                    <select
                      {...register('currency')}
                      className={`${base} cursor-pointer`}
                      style={bdr(!!errors.currency)}
                      onFocus={(ev) => fOn(ev, !!errors.currency)}
                      onBlur={(ev) => fOff(ev, !!errors.currency)}
                    >
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Incoterm" error={errors.incoterm}>
                    <select
                      {...register('incoterm')}
                      className={`${base} cursor-pointer`}
                      style={bdr(false)}
                    >
                      {INCOTERMS.map((t) => <option key={t} value={t}>{t || '— Select Incoterm —'}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Status" required error={errors.status}>
                    <select
                      {...register('status')}
                      className={`${base} cursor-pointer`}
                      style={bdr(!!errors.status)}
                    >
                      {STATUSES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
              </FormSection>

              {/* 2 · Buyer */}
              <PartySection
                title="Buyer Information"
                icon={Users}
                prefix="buyer"
                register={register}
                errors={errors}
                nameLabel="Buyer / Organisation Name"
              />

              {/* 3 · Supplier */}
              <PartySection
                title="Supplier Information"
                icon={Building2}
                prefix="supplier"
                register={register}
                errors={errors}
                nameLabel="Supplier Name"
              />

              {/* 4 · Shipping */}
              <FormSection title="Shipping &amp; Delivery" icon={Truck}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Delivery Location" error={errors.deliveryLocation}>
                    <input
                      {...register('deliveryLocation')}
                      placeholder="Warehouse / site name"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Delivery Contact" error={errors.deliveryContact}>
                    <input
                      {...register('deliveryContact')}
                      placeholder="Person at delivery site"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Shipping Method" error={errors.shippingMethod}>
                    <select
                      {...register('shippingMethod')}
                      className={`${base} cursor-pointer`}
                      style={bdr(false)}
                    >
                      <option value="">— Select Method —</option>
                      {SHIPPING_METHODS.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Transporter Name" error={errors.transporterName}>
                    <input
                      {...register('transporterName')}
                      placeholder="Transporter / courier name"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Transport Reference / LR No." error={errors.transportReference}>
                    <input
                      {...register('transportReference')}
                      placeholder="LR-00123"
                      className={`${base} font-mono`}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* 5 · Line Items */}
              <LineItemsTable
                control={control}
                register={register}
                errors={errors}
                watch={watch}
                mode="po"
              />

              {/* 6 · Tax &amp; Totals */}
              <FormSection title="Tax &amp; Totals" icon={Calculator}>
                <div className="space-y-4">
                  {/* Tax type toggle */}
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>
                      Tax Mode
                    </p>
                    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
                      {[
                        { value: 'cgst_sgst', label: 'CGST + SGST (Same State)' },
                        { value: 'igst',      label: 'IGST (Interstate)'        },
                      ].map(({ value, label }) => (
                        <label
                          key={value}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer text-xs font-medium transition-all"
                          style={
                            taxType === value
                              ? { background: '#2563eb', color: '#fff' }
                              : { color: '#64748b', background: '#f8fafc' }
                          }
                        >
                          <input {...register('taxType')} type="radio" value={value} className="sr-only" />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Other charges */}
                  <FormField label="Other Charges / Freight (₹)" error={errors.otherCharges}>
                    <input
                      {...register('otherCharges')}
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      className={`${base} max-w-xs`}
                      style={bdr(!!errors.otherCharges)}
                      onFocus={(ev) => fOn(ev, !!errors.otherCharges)}
                      onBlur={(ev) => fOff(ev, !!errors.otherCharges)}
                    />
                  </FormField>

                  <TaxBreakdown
                    subtotal={totals.subtotal}
                    cgst={totals.cgst}
                    sgst={totals.sgst}
                    igst={totals.igst}
                    totalTax={totals.totalTax}
                    grandTotal={totals.grandTotal}
                    taxType={taxType}
                    otherCharges={otherCharges}
                  />
                </div>
              </FormSection>

              {/* 7 · Terms */}
              <FormSection title="Terms &amp; Conditions" icon={BookOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Payment Terms" error={errors.paymentTerms}>
                    <select
                      {...register('paymentTerms')}
                      className={`${base} cursor-pointer`}
                      style={bdr(false)}
                    >
                      <option value="">— Select —</option>
                      {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </FormField>

                  <FormField label="Delivery Terms" error={errors.deliveryTerms}>
                    <input
                      {...register('deliveryTerms')}
                      placeholder="e.g. Delivery within 15 working days"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Inspection Terms" error={errors.inspectionTerms}>
                    <input
                      {...register('inspectionTerms')}
                      placeholder="e.g. Inspection at buyer's premises"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>

                  <FormField label="Warranty Terms" error={errors.warrantyTerms}>
                    <input
                      {...register('warrantyTerms')}
                      placeholder="e.g. 1 year from date of delivery"
                      className={base}
                      style={bdr(false)}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                </div>
              </FormSection>

              {/* 8 · Notes */}
              <FormSection title="Notes &amp; Instructions" icon={MessageSquare}>
                <div className="space-y-4">
                  <FormField label="Remarks" error={errors.remarks}>
                    <textarea
                      {...register('remarks')}
                      rows={3}
                      placeholder="General remarks or conditions..."
                      className={base}
                      style={{ ...bdr(false), resize: 'none' }}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                  <FormField label="Special Instructions" error={errors.specialInstructions}>
                    <textarea
                      {...register('specialInstructions')}
                      rows={3}
                      placeholder="Packing instructions, handling notes, etc."
                      className={base}
                      style={{ ...bdr(false), resize: 'none' }}
                      onFocus={(ev) => fOn(ev, false)}
                      onBlur={(ev) => fOff(ev, false)}
                    />
                  </FormField>
                </div>
              </FormSection>
            </div>

            {/* ── Right: Summary card (desktop) ── */}
            <div className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-14">
              <DocumentSummaryCard
                documentType="Purchase Order"
                docNumber={poNumber}
                status={status}
                itemCount={lineItems.length}
                subtotal={totals.subtotal}
                totalTax={totals.totalTax}
                grandTotal={totals.grandTotal}
              />
            </div>
          </div>

          {/* ── Mobile summary ── */}
          <div className="lg:hidden mt-5">
            <DocumentSummaryCard
              documentType="Purchase Order"
              docNumber={poNumber}
              status={status}
              itemCount={lineItems.length}
              subtotal={totals.subtotal}
              totalTax={totals.totalTax}
              grandTotal={totals.grandTotal}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
