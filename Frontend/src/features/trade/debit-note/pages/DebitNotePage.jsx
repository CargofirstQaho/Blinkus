import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { Save, ArrowRight, AlertCircle } from 'lucide-react';
import { useDebitNote } from '../hooks/useDebitNote';
import { useOrganization } from '../../organization/hooks/useOrganization';
import OrgRequiredGate from '../../organization/components/OrgRequiredGate';
import { BRAND, GRAD, MUTED } from '../components/FormUI';
import DebitNoteHeader from '../components/DebitNoteHeader';
import DebitNoteSupplierInfo from '../components/DebitNoteSupplierInfo';
import DebitNoteItemsTable, { DEFAULT_ITEM } from '../components/DebitNoteItemsTable';
import DebitNoteSummary from '../components/DebitNoteSummary';
import DebitNoteTerms from '../components/DebitNoteTerms';
import { PHONE_RE, GST_RE, HSN_RE, DEFAULT_TERMS } from '../constants/debitNoteOptions';

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULTS = {
  debitNoteInfo: {
    debitNoteDate:          TODAY,
    referenceInvoiceNumber: '',
    referenceInvoiceDate:   '',
    currency:               'INR',
    placeOfSupply:          '',
  },
  supplierInfo: {
    supplierName:    '',
    supplierCompany: '',
    gstNumber:       '',
    address:         '',
    phone:           '',
    email:           '',
  },
  lineItems: [{ ...DEFAULT_ITEM }],
  summary: { cgst: 0, sgst: 0, igst: 0, grandTotal: 0, balanceDue: 0 },
  reasonForDebitNote: '',
  notes: '',
  termsAndConditions: DEFAULT_TERMS,
};

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; }
}

function draftToForm(draft) {
  const dni = draft.debitNoteInfo || {};
  return {
    debitNoteInfo: {
      ...DEFAULTS.debitNoteInfo,
      ...dni,
      debitNoteDate:        fmtDate(dni.debitNoteDate) || TODAY,
      referenceInvoiceDate: fmtDate(dni.referenceInvoiceDate) || '',
      placeOfSupply:        dni.placeOfSupply || '',
    },
    supplierInfo: { ...DEFAULTS.supplierInfo, ...(draft.supplierInfo || {}) },
    lineItems: (draft.lineItems || []).length > 0
      ? draft.lineItems.map((it) => ({
          itemName:    it.itemName    || '',
          description: it.description || '',
          hsnCode:     it.hsnCode      || '',
          quantity:    it.quantity    ?? 1,
          unit:        it.unit         || 'PCS',
          rate:        it.rate        ?? 0,
          taxPercent:  it.taxPercent  ?? 0,
        }))
      : DEFAULTS.lineItems,
    summary: {
      cgst:       draft.summary?.cgst       ?? 0,
      sgst:       draft.summary?.sgst       ?? 0,
      igst:       draft.summary?.igst       ?? 0,
      grandTotal: draft.summary?.grandTotal ?? 0,
      balanceDue: draft.summary?.balanceDue ?? 0,
    },
    reasonForDebitNote: draft.reasonForDebitNote || '',
    notes:              draft.notes              || '',
    termsAndConditions: draft.termsAndConditions || DEFAULT_TERMS,
  };
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

const itemSchema = z.object({
  itemName:    z.string().min(1, 'Required'),
  description: z.string().min(1, 'Required'),
  hsnCode:     z.string().regex(HSN_RE, 'Must be 4–8 digits'),
  quantity:    z.coerce.number().positive('Must be > 0'),
  unit:        z.string().min(1, 'Required'),
  rate:        z.coerce.number().positive('Must be > 0'),
  taxPercent:  z.coerce.number().min(0, 'Must be ≥ 0').max(100, 'Max 100'),
});

const schema = z.object({
  debitNoteInfo: z.object({
    debitNoteDate:          z.string().min(1, 'Required'),
    referenceInvoiceNumber: z.string().min(1, 'Required'),
    referenceInvoiceDate:   z.string().min(1, 'Required'),
    currency:               z.string().min(1, 'Required').default('INR'),
    placeOfSupply:          z.string().min(1, 'Required'),
  }),
  supplierInfo: z.object({
    supplierName:    z.string().min(1, 'Required'),
    supplierCompany: z.string().min(1, 'Required'),
    gstNumber:       z.string().min(1, 'Required').regex(GST_RE, 'Invalid GST format'),
    address:         z.string().min(1, 'Required'),
    phone:           z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    email:           z.string().min(1, 'Required').email('Invalid email'),
  }),
  lineItems: z.array(itemSchema).min(1, 'At least one item is required'),
  summary: z.object({
    cgst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    sgst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    igst:       z.coerce.number().min(0, 'Must be ≥ 0'),
    grandTotal: z.coerce.number(),
    balanceDue: z.coerce.number().min(0, 'Must be ≥ 0'),
  }),
  reasonForDebitNote: z.string().min(1, 'Required'),
  notes:              z.string().min(1, 'Required'),
  termsAndConditions: z.string().min(1, 'Required'),
});

export default function DebitNotePage() {
  useOrganization();
  const org = useSelector((s) => s.tradeOrganization.organization);
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const { draft, saving, error, loadById, saveDraft, saveAndNavigateToReview, clearDraft } = useDebitNote();
  const [submitError, setSubmitError] = useState('');
  const [draftLoaded, setDraftLoaded] = useState(false);

  const { register, handleSubmit, control, reset, setValue, setFocus, watch, formState: { errors, isValid } } = useForm({
    resolver:         zodResolver(schema),
    defaultValues:    DEFAULTS,
    mode:             'all',
    shouldFocusError: false,
  });

  const currency = watch('debitNoteInfo.currency') || 'INR';

  useEffect(() => {
    setDraftLoaded(false);
    if (draftId) {
      loadById(draftId);
    } else {
      clearDraft();
      reset(DEFAULTS);
    }
  }, [draftId, loadById, clearDraft, reset]);

  useEffect(() => {
    if (draft && !draftLoaded) { reset(draftToForm(draft)); setDraftLoaded(true); }
  }, [draft, draftLoaded, reset]);

  const onInvalid = useCallback((errs) => {
    const name = getFirstErrorName(errs);
    if (!name) return;
    try { setFocus(name); } catch (_) {}
    requestAnimationFrame(() => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [setFocus]);

  const onSaveDraft = useCallback(() => {
    setSubmitError('');
    handleSubmit(async (data) => { await saveDraft({ ...data, documentId: draft?._id }); }, onInvalid)();
  }, [handleSubmit, saveDraft, onInvalid, draft]);

  const onSaveAndGenerate = useCallback(() => {
    setSubmitError('');
    handleSubmit(async (data) => { await saveAndNavigateToReview({ ...data, documentId: draft?._id }); }, onInvalid)();
  }, [handleSubmit, saveAndNavigateToReview, onInvalid, draft]);

  return (
    <OrgRequiredGate>
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>Debit Note</h1>
          {draft?.debitNoteNumber && (
            <p className="text-xs mt-0.5 font-mono" style={{ color: MUTED }}>Draft: {draft.debitNoteNumber}</p>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button type="button" onClick={onSaveDraft} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
            <Save size={15} color={BRAND} />
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button type="button" onClick={onSaveAndGenerate} disabled={saving || !isValid}
            title={!isValid ? 'Complete all required fields to enable' : undefined}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: isValid ? GRAD : '#93C5FD', border: 'none' }}>
            <ArrowRight size={15} color="#fff" />
            {saving ? 'Saving…' : 'Save & Generate'}
          </button>
        </div>
      </div>

      {(error || submitError) && (
        <div className="flex items-start gap-2 p-3.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={16} color="#DC2626" className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error || submitError}</p>
        </div>
      )}

      <DebitNoteHeader register={register} errors={errors} debitNoteNumber={draft?.debitNoteNumber} org={org} currency={currency} />

      <DebitNoteSupplierInfo register={register} errors={errors} />

      <DebitNoteItemsTable control={control} errors={errors} />

      <DebitNoteSummary control={control} errors={errors} setValue={setValue} orgGstNumber={org?.gstNumber || org?.kyc?.gst?.number} />

      <DebitNoteTerms register={register} errors={errors} />

      <div className="flex gap-3 justify-end pb-8">
        <button type="button" onClick={onSaveDraft} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-60"
          style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
          <Save size={16} color={BRAND} />{saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button type="button" onClick={onSaveAndGenerate} disabled={saving || !isValid}
          title={!isValid ? 'Complete all required fields to enable' : undefined}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: isValid ? GRAD : '#93C5FD', border: 'none' }}>
          <ArrowRight size={16} color="#fff" />{saving ? 'Saving…' : 'Save & Generate PDF'}
        </button>
      </div>
    </div>
    </OrgRequiredGate>
  );
}
