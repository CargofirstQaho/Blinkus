import { FileText } from 'lucide-react';
import { Field, Section, inputCls, LIGHT, BORDER, GRAD, TEXT, MUTED } from './FormUI';
import { CURRENCIES } from '../constants/proformaInvoiceOptions';

export default function ProformaInvoiceHeader({ register, errors, proformaInvoiceNumber, contractNumber, org }) {
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
              org?.contact?.phone   && `Ph: ${org.contact.phone}`,
              org?.organizationEmail,
            ].filter(Boolean).join('  |  ')}
          </p>
        </div>
        <span className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest" style={{ background: GRAD, color: '#fff' }}>
          PROFORMA INVOICE
        </span>
      </div>

      <Section title="Proforma Invoice Information" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="PI Number">
            <input value={proformaInvoiceNumber || 'Auto-generated'} disabled className={`${inputCls(false)} bg-gray-50 text-gray-500`} />
          </Field>
          <Field label="Contract Number">
            <input value={contractNumber || '—'} disabled className={`${inputCls(false)} bg-gray-50 text-gray-500`} />
          </Field>
          <Field label="Invoice Date" required error={errors.invoiceInfo?.invoiceDate?.message}>
            <input type="date" {...register('invoiceInfo.invoiceDate')} className={inputCls(!!errors.invoiceInfo?.invoiceDate)} />
          </Field>
          <Field label="Currency" required error={errors.invoiceInfo?.currency?.message}>
            <select {...register('invoiceInfo.currency')} className={inputCls(!!errors.invoiceInfo?.currency)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
      </Section>
    </>
  );
}
