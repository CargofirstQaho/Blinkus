import { FileText } from 'lucide-react';
import { Field, Section, inputCls, LIGHT, BORDER, GRAD, TEXT, MUTED } from './FormUI';
import { CURRENCIES, INDIAN_STATES } from '../constants/debitNoteOptions';

export default function DebitNoteHeader({ register, errors, debitNoteNumber, org, currency }) {
  const isInr = (currency || 'INR').toUpperCase() === 'INR';
  return (
    <>
      <div className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
        {org?.logoUrl && <img src={org.logoUrl} alt="logo" className="w-14 h-14 rounded-xl object-contain border-2" style={{ borderColor: BORDER }} />}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base truncate" style={{ color: TEXT }}>{org?.organizationName || '—'}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: MUTED }}>{org?.contact?.address || '—'}</p>
          <p className="text-xs truncate" style={{ color: MUTED }}>
            {[
              (org?.gstNumber || org?.kyc?.gst?.number) && `GSTIN: ${org.gstNumber || org.kyc.gst.number}`,
              org?.kyc?.pan?.number && `PAN: ${org.kyc.pan.number}`,
              org?.contact?.phone   && `Ph: ${org.contact.phone}`,
              org?.organizationEmail,
            ].filter(Boolean).join('  |  ')}
          </p>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest" style={{ background: GRAD, color: '#fff' }}>
          DEBIT NOTE
        </span>
      </div>

      <Section title="Debit Note Information" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Debit Note Number">
            <input value={debitNoteNumber || 'Auto-generated'} disabled className={`${inputCls(false)} bg-gray-50 text-gray-500`} />
          </Field>
          <Field label="Debit Note Date" required error={errors.debitNoteInfo?.debitNoteDate?.message}>
            <input type="date" {...register('debitNoteInfo.debitNoteDate')} className={inputCls(!!errors.debitNoteInfo?.debitNoteDate)} />
          </Field>
          <Field label="Currency" required error={errors.debitNoteInfo?.currency?.message}>
            <select {...register('debitNoteInfo.currency')} className={inputCls(!!errors.debitNoteInfo?.currency)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          {isInr && (
            <Field label="Place of Supply" error={errors.debitNoteInfo?.placeOfSupply?.message}>
              <select {...register('debitNoteInfo.placeOfSupply')} className={inputCls(!!errors.debitNoteInfo?.placeOfSupply)}>
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => <option key={s.code} value={s.name}>{s.name}</option>)}
              </select>
            </Field>
          )}
          <Field label="Reference Invoice Number" required error={errors.debitNoteInfo?.referenceInvoiceNumber?.message}>
            <input {...register('debitNoteInfo.referenceInvoiceNumber')} className={inputCls(!!errors.debitNoteInfo?.referenceInvoiceNumber)} />
          </Field>
          <Field label="Reference Invoice Date" required error={errors.debitNoteInfo?.referenceInvoiceDate?.message}>
            <input type="date" {...register('debitNoteInfo.referenceInvoiceDate')} className={inputCls(!!errors.debitNoteInfo?.referenceInvoiceDate)} />
          </Field>
        </div>
      </Section>
    </>
  );
}
