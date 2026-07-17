import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { Save, ArrowRight, AlertCircle } from 'lucide-react';
import { useCommercialInvoice } from '../hooks/useCommercialInvoice';
import { listFinalizedContractsApi } from '../../international/contracts/services/contractApi';
import { useOrganization } from '../../organization/hooks/useOrganization';
import OrgRequiredGate from '../../organization/components/OrgRequiredGate';
import { BRAND, GRAD, MUTED } from '../components/FormUI';
import CommercialContractSelect from '../components/CommercialContractSelect';
import CommercialInvoiceHeader from '../components/CommercialInvoiceHeader';
import CommercialExporterDetails from '../components/CommercialExporterDetails';
import CommercialBuyerDetails from '../components/CommercialBuyerDetails';
import CommercialNotifyConsignee from '../components/CommercialNotifyConsignee';
import CommercialShippingDetails from '../components/CommercialShippingDetails';
import CommercialGoodsTable, { DEFAULT_ITEM } from '../components/CommercialGoodsTable';
import CommercialFinancialInfo from '../components/CommercialFinancialInfo';
import CommercialBankDetails from '../components/CommercialBankDetails';
import CommercialDeclarationTerms from '../components/CommercialDeclarationTerms';
import { PHONE_RE, HS_RE, IFSC_RE, SWIFT_RE, DEFAULT_DECLARATION, DEFAULT_TERMS } from '../constants/commercialInvoiceOptions';

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULTS = {
  contract:       '',
  contractNumber: '',
  invoiceInfo: {
    date: TODAY,
  },
  exporterDetails: {
    companyName: '', address: '', country: '', email: '', phone: '', taxNumber: '',
  },
  buyerDetails: {
    companyName: '', address: '', country: '', contactPerson: '', phone: '', email: '', taxNumber: '',
  },
  notifyParty: {
    name: '', address: '', country: '', phone: '', email: '',
  },
  consignee: {
    name: '', address: '', country: '', phone: '', email: '',
  },
  shippingDetails: {
    vessel: '', blNumber: '', portOfLoading: '', portOfDischarge: '', finalDestination: '',
  },
  goodsItems: [{ ...DEFAULT_ITEM }],
  financial: { currency: 'USD', placeOfSupply: '', cgst: 0, sgst: 0, igst: 0, freight: 0, insurance: 0, total: 0 },
  bankDetails: { bankName: '', accountNumber: '', swift: '', ifsc: '' },
  declaration: DEFAULT_DECLARATION,
  termsAndConditions: DEFAULT_TERMS,
  signatory: { name: '', designation: '' },
};

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; }
}

function draftToForm(draft) {
  const ii = draft.invoiceInfo || {};
  return {
    contract:       (typeof draft.contract === 'object' ? draft.contract?._id : draft.contract) || '',
    contractNumber: draft.contractNumber || '',
    invoiceInfo: {
      date: fmtDate(ii.date) || TODAY,
    },
    exporterDetails: { ...DEFAULTS.exporterDetails, ...(draft.exporterDetails || {}) },
    buyerDetails:    { ...DEFAULTS.buyerDetails,    ...(draft.buyerDetails    || {}) },
    notifyParty:     { ...DEFAULTS.notifyParty,     ...(draft.notifyParty     || {}) },
    consignee:       { ...DEFAULTS.consignee,       ...(draft.consignee       || {}) },
    shippingDetails: { ...DEFAULTS.shippingDetails, ...(draft.shippingDetails || {}) },
    goodsItems: (draft.goodsItems || []).length > 0
      ? draft.goodsItems.map((it) => ({
          commodity:   it.commodity   || '',
          hsnCode:     it.hsnCode     || '',
          description: it.description || '',
          quantity:    it.quantity   ?? 1,
          unit:        it.unit        || 'PCS',
          unitPrice:   it.unitPrice  ?? 0,
          taxPercent:  it.taxPercent ?? 0,
        }))
      : DEFAULTS.goodsItems,
    financial: {
      currency:      draft.financial?.currency      || 'USD',
      placeOfSupply: draft.financial?.placeOfSupply || '',
      cgst:          draft.financial?.cgst          ?? 0,
      sgst:          draft.financial?.sgst          ?? 0,
      igst:          draft.financial?.igst          ?? 0,
      freight:       draft.financial?.freight       ?? 0,
      insurance:     draft.financial?.insurance     ?? 0,
      total:         draft.financial?.total         ?? 0,
    },
    bankDetails: { ...DEFAULTS.bankDetails, ...(draft.bankDetails || {}) },
    declaration:        draft.declaration        || DEFAULT_DECLARATION,
    termsAndConditions: draft.termsAndConditions || DEFAULT_TERMS,
    signatory: { ...DEFAULTS.signatory, ...(draft.signatory || {}) },
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
  commodity:   z.string().min(1, 'Required'),
  hsnCode:     z.string().regex(HS_RE, 'Must be 4–8 digits'),
  description: z.string().min(1, 'Required'),
  quantity:    z.coerce.number().positive('Must be > 0'),
  unit:        z.string().min(1, 'Required'),
  unitPrice:   z.coerce.number().positive('Must be > 0'),
  taxPercent:  z.coerce.number().min(0, 'Must be ≥ 0').max(100, 'Max 100'),
});

const schema = z.object({
  contract:       z.string().min(1, 'A contract must be selected'),
  contractNumber: z.string().min(1, 'Required'),
  invoiceInfo: z.object({
    date: z.string().min(1, 'Required'),
  }),
  exporterDetails: z.object({
    companyName: z.string().min(1, 'Required'),
    address:     z.string().min(1, 'Required'),
    country:     z.string().min(1, 'Required'),
    email:       z.string().min(1, 'Required').email('Invalid email'),
    phone:       z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    taxNumber:   z.string().min(1, 'Required'),
  }),
  buyerDetails: z.object({
    companyName:   z.string().min(1, 'Required'),
    address:       z.string().min(1, 'Required'),
    country:       z.string().min(1, 'Required'),
    contactPerson: z.string().min(1, 'Required'),
    phone:         z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    email:         z.string().min(1, 'Required').email('Invalid email'),
    taxNumber:     z.string().min(1, 'Required'),
  }),
  notifyParty: z.object({
    name:    z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    country: z.string().min(1, 'Required'),
    phone:   z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    email:   z.string().min(1, 'Required').email('Invalid email'),
  }),
  consignee: z.object({
    name:    z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    country: z.string().min(1, 'Required'),
    phone:   z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    email:   z.string().min(1, 'Required').email('Invalid email'),
  }),
  shippingDetails: z.object({
    vessel:           z.string().min(1, 'Required'),
    blNumber:         z.string().min(1, 'Required'),
    portOfLoading:    z.string().min(1, 'Required'),
    portOfDischarge:  z.string().min(1, 'Required'),
    finalDestination: z.string().min(1, 'Required'),
  }),
  goodsItems: z.array(itemSchema).min(1, 'At least one goods item is required'),
  financial: z.object({
    currency:      z.string().min(1, 'Required').default('USD'),
    placeOfSupply: z.string().optional().default(''),
    cgst:          z.coerce.number().min(0, 'Must be ≥ 0'),
    sgst:          z.coerce.number().min(0, 'Must be ≥ 0'),
    igst:          z.coerce.number().min(0, 'Must be ≥ 0'),
    freight:       z.coerce.number().min(0, 'Must be ≥ 0'),
    insurance:     z.coerce.number().min(0, 'Must be ≥ 0'),
    total:         z.coerce.number(),
  }),
  bankDetails: z.object({
    bankName:      z.string().min(1, 'Required'),
    accountNumber: z.string().min(1, 'Required'),
    swift:         z.string().min(1, 'Required').regex(SWIFT_RE, 'Invalid SWIFT code'),
    ifsc:          z.string().min(1, 'Required').regex(IFSC_RE, 'Invalid IFSC code'),
  }),
  declaration:        z.string().min(1, 'Required'),
  termsAndConditions: z.string().min(1, 'Required'),
  signatory: z.object({
    name:        z.string().min(1, 'Required'),
    designation: z.string().min(1, 'Required'),
  }),
});

export default function CommercialInvoicePage() {
  useOrganization();
  const org = useSelector((s) => s.tradeOrganization.organization);
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const { draft, saving, error, loadById, saveDraft, saveAndNavigateToReview, clearDraft } = useCommercialInvoice();
  const [submitError, setSubmitError]   = useState('');
  const [draftLoaded, setDraftLoaded]   = useState(false);
  const [orgApplied, setOrgApplied]     = useState(false);
  const [contracts, setContracts]       = useState([]);
  const [contractsLoading, setContractsLoading] = useState(true);

  const { register, handleSubmit, control, reset, setValue, setFocus, watch, formState: { errors, isValid } } = useForm({
    resolver:         zodResolver(schema),
    defaultValues:    DEFAULTS,
    mode:             'all',
    shouldFocusError: false,
  });

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
    let mounted = true;
    (async () => {
      try {
        const list = await listFinalizedContractsApi();
        if (mounted) setContracts(list || []);
      } catch (_) {
        // handled by CommercialContractSelect's empty-state messaging
      } finally {
        if (mounted) setContractsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (draft && !draftLoaded) { reset(draftToForm(draft)); setDraftLoaded(true); }
  }, [draft, draftLoaded, reset]);

  useEffect(() => {
    if (org && !draft && !orgApplied) {
      setValue('exporterDetails.companyName', org.organizationName || '');
      setValue('exporterDetails.address',     org.contact?.address || '');
      setValue('exporterDetails.country',     org.regionalInformation?.country || '');
      setValue('exporterDetails.email',       org.organizationEmail || '');
      setValue('exporterDetails.phone',       org.contact?.phone || '');
      setValue('exporterDetails.taxNumber',   org.kyc?.gst?.number || '');
      setOrgApplied(true);
    }
  }, [org, draft, orgApplied, setValue]);

  const contractValue  = watch('contract');
  const contractNumber = watch('contractNumber');

  const onInvalid = useCallback((errs) => {
    const name = getFirstErrorName(errs);
    if (!name) return;
    try { setFocus(name); } catch (_) {}
    requestAnimationFrame(() => {
      const el = document.querySelector(`[name="${name}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [setFocus]);

  const handleContractSelect = useCallback((contract) => {
    if (!contract) return;

    setValue('contract', contract._id || '', { shouldValidate: true });
    setValue('contractNumber', contract.contractNumber || '', { shouldValidate: true });

    const buyer = contract.buyer || {};
    setValue('buyerDetails.companyName',   buyer.companyName   || '', { shouldValidate: true });
    setValue('buyerDetails.address',       buyer.address       || '', { shouldValidate: true });
    setValue('buyerDetails.country',       buyer.country       || '', { shouldValidate: true });
    setValue('buyerDetails.contactPerson', buyer.contactPerson || '', { shouldValidate: true });
    setValue('buyerDetails.phone',         buyer.phone         || '', { shouldValidate: true });
    setValue('buyerDetails.email',         buyer.email         || '', { shouldValidate: true });
    setValue('buyerDetails.taxNumber',     buyer.taxNumber     || '', { shouldValidate: true });

    const seller = contract.seller || {};
    setValue('exporterDetails.companyName', seller.companyName || '', { shouldValidate: true });
    setValue('exporterDetails.address',     seller.address     || '', { shouldValidate: true });
    setValue('exporterDetails.country',     seller.country     || '', { shouldValidate: true });
    setValue('exporterDetails.email',       seller.email       || '', { shouldValidate: true });
    setValue('exporterDetails.phone',       seller.phone       || '', { shouldValidate: true });
    setValue('exporterDetails.taxNumber',   seller.taxNumber   || '', { shouldValidate: true });

    const commodity = contract.commodity || {};
    const shipment  = contract.shipment  || {};
    const price     = contract.price     || {};

    setValue('goodsItems.0.commodity', commodity.commodity || '', { shouldValidate: true });
    setValue('goodsItems.0.hsnCode',   commodity.hsCode    || '', { shouldValidate: true });
    setValue('goodsItems.0.quantity',  shipment.quantity   ?? 1,  { shouldValidate: true });
    setValue('goodsItems.0.unit',      shipment.unit       || 'PCS', { shouldValidate: true });
    setValue('goodsItems.0.unitPrice', price.unitPrice     ?? 0,  { shouldValidate: true });

    if (price.currency) setValue('financial.currency', price.currency, { shouldValidate: true });

    setValue('shippingDetails.portOfLoading',    shipment.loadingPort     || '', { shouldValidate: true });
    setValue('shippingDetails.finalDestination', shipment.destinationPort || '', { shouldValidate: true });
  }, [setValue]);

  const onSaveDraft = useCallback(() => {
    if (!contractValue) { setSubmitError('Please select a Contract Number before saving.'); return; }
    setSubmitError('');
    handleSubmit(async (data) => { await saveDraft({ ...data, documentId: draft?._id }); }, onInvalid)();
  }, [contractValue, handleSubmit, saveDraft, onInvalid, draft]);

  const onSaveAndGenerate = useCallback(() => {
    if (!contractValue) { setSubmitError('Please select a Contract Number before continuing.'); return; }
    setSubmitError('');
    handleSubmit(async (data) => { await saveAndNavigateToReview({ ...data, documentId: draft?._id }); }, onInvalid)();
  }, [contractValue, handleSubmit, saveAndNavigateToReview, onInvalid, draft]);

  const noContracts  = !contractsLoading && contracts.length === 0;
  const saveDisabled = saving || noContracts || !contractValue;
  const genDisabled  = saveDisabled || !isValid;

  return (
    <OrgRequiredGate>
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>Commercial Invoice</h1>
          {draft?.commercialInvoiceNumber && (
            <p className="text-xs mt-0.5 font-mono" style={{ color: MUTED }}>Draft: {draft.commercialInvoiceNumber}</p>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button type="button" onClick={onSaveDraft} disabled={saveDisabled}
            title={noContracts ? 'A finalized contract is required' : undefined}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
            <Save size={15} color={BRAND} />
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button type="button" onClick={onSaveAndGenerate} disabled={genDisabled}
            title={noContracts ? 'A finalized contract is required' : (!isValid ? 'Complete all required fields to enable' : undefined)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: !genDisabled ? GRAD : '#93C5FD', border: 'none' }}>
            <ArrowRight size={15} color="#fff" />
            {saving ? 'Saving…' : 'Save & Review'}
          </button>
        </div>
      </div>

      {(error || submitError) && (
        <div className="flex items-start gap-2 p-3.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={16} color="#DC2626" className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error || submitError}</p>
        </div>
      )}

      <CommercialContractSelect
        contracts={contracts}
        loading={contractsLoading}
        value={contractValue}
        onSelect={handleContractSelect}
        disabled={saving}
      />

      <CommercialInvoiceHeader
        register={register}
        errors={errors}
        commercialInvoiceNumber={draft?.commercialInvoiceNumber}
        contractNumber={contractNumber}
        org={org}
      />

      <CommercialExporterDetails register={register} errors={errors} />

      <CommercialBuyerDetails register={register} errors={errors} />

      <CommercialNotifyConsignee register={register} errors={errors} />

      <CommercialShippingDetails register={register} errors={errors} />

      <CommercialGoodsTable control={control} errors={errors} />

      <CommercialFinancialInfo control={control} errors={errors} setValue={setValue} orgGstNumber={org?.gstNumber || org?.kyc?.gst?.number} />

      <CommercialBankDetails register={register} errors={errors} />

      <CommercialDeclarationTerms register={register} errors={errors} />

      <div className="flex gap-3 justify-end pb-8">
        <button type="button" onClick={onSaveDraft} disabled={saveDisabled}
          title={noContracts ? 'A finalized contract is required' : undefined}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-60"
          style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
          <Save size={16} color={BRAND} />{saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button type="button" onClick={onSaveAndGenerate} disabled={genDisabled}
          title={noContracts ? 'A finalized contract is required' : (!isValid ? 'Complete all required fields to enable' : undefined)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: !genDisabled ? GRAD : '#93C5FD', border: 'none' }}>
          <ArrowRight size={16} color="#fff" />{saving ? 'Saving…' : 'Save & Continue to Review'}
        </button>
      </div>
    </div>
    </OrgRequiredGate>
  );
}
