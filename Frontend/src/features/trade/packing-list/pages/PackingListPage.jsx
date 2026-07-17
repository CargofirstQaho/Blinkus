import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { Save, ArrowRight, AlertCircle } from 'lucide-react';
import { usePackingList } from '../hooks/usePackingList';
import { listFinalizedContractsApi } from '../../international/contracts/services/contractApi';
import { useOrganization } from '../../organization/hooks/useOrganization';
import OrgRequiredGate from '../../organization/components/OrgRequiredGate';
import { BRAND, GRAD, MUTED } from '../components/FormUI';
import PackingContractSelect from '../components/PackingContractSelect';
import PackingListHeader from '../components/PackingListHeader';
import PackingExporterDetails from '../components/PackingExporterDetails';
import PackingBuyerDetails from '../components/PackingBuyerDetails';
import PackingConsignee from '../components/PackingConsignee';
import PackingShippingDetails from '../components/PackingShippingDetails';
import PackingItemsTable, { DEFAULT_ITEM } from '../components/PackingItemsTable';
import PackingRemarksTerms from '../components/PackingRemarksTerms';
import { PHONE_RE, HS_RE, DEFAULT_TERMS } from '../constants/packingListOptions';

const TODAY = new Date().toISOString().split('T')[0];

const DEFAULTS = {
  contract:       '',
  contractNumber: '',
  packingListInfo: {
    date: TODAY,
  },
  exporterDetails: {
    companyName: '', address: '', country: '', email: '', phone: '', taxNumber: '',
  },
  buyerDetails: {
    companyName: '', address: '', country: '', contactPerson: '', phone: '', email: '', taxNumber: '',
  },
  consignee: {
    name: '', address: '', country: '', phone: '', email: '',
  },
  shippingDetails: {
    portOfLoading: '', portOfDischarge: '', vessel: '', containerNumber: '', sealNumber: '',
  },
  packingItems: [{ ...DEFAULT_ITEM }],
  remarks: '',
  termsAndConditions: DEFAULT_TERMS,
};

function fmtDate(d) {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; }
}

function draftToForm(draft) {
  const pli = draft.packingListInfo || {};
  return {
    contract:       (typeof draft.contract === 'object' ? draft.contract?._id : draft.contract) || '',
    contractNumber: draft.contractNumber || '',
    packingListInfo: {
      ...DEFAULTS.packingListInfo,
      ...pli,
      date: fmtDate(pli.date) || TODAY,
    },
    exporterDetails: { ...DEFAULTS.exporterDetails, ...(draft.exporterDetails || {}) },
    buyerDetails:    { ...DEFAULTS.buyerDetails,    ...(draft.buyerDetails    || {}) },
    consignee:       { ...DEFAULTS.consignee,       ...(draft.consignee       || {}) },
    shippingDetails: { ...DEFAULTS.shippingDetails, ...(draft.shippingDetails || {}) },
    packingItems: (draft.packingItems || []).length > 0
      ? draft.packingItems.map((it) => ({
          marksAndNumbers:  it.marksAndNumbers  || '',
          packagingType:    it.packagingType    || '',
          numberOfPackages: it.numberOfPackages ?? 1,
          commodity:        it.commodity        || '',
          description:      it.description      || '',
          hsnCode:          it.hsnCode          || '',
          netWeight:        it.netWeight        ?? 0,
          grossWeight:      it.grossWeight      ?? 0,
          quantity:         it.quantity         ?? 1,
          unit:             it.unit             || 'PCS',
        }))
      : DEFAULTS.packingItems,
    remarks:            draft.remarks            || '',
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
  marksAndNumbers:  z.string().min(1, 'Required'),
  packagingType:    z.string().min(1, 'Required'),
  numberOfPackages: z.coerce.number().positive('Must be > 0'),
  commodity:        z.string().min(1, 'Required'),
  description:      z.string().min(1, 'Required'),
  hsnCode:          z.string().regex(HS_RE, 'Must be 4–8 digits'),
  netWeight:        z.coerce.number().positive('Must be > 0'),
  grossWeight:      z.coerce.number().positive('Must be > 0'),
  quantity:         z.coerce.number().positive('Must be > 0'),
  unit:             z.string().min(1, 'Required'),
}).refine((it) => it.grossWeight >= it.netWeight, {
  message: 'Gross weight must be ≥ net weight',
  path:    ['grossWeight'],
});

const schema = z.object({
  contract:       z.string().min(1, 'A contract must be selected'),
  contractNumber: z.string().min(1, 'Required'),
  packingListInfo: z.object({
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
  consignee: z.object({
    name:    z.string().min(1, 'Required'),
    address: z.string().min(1, 'Required'),
    country: z.string().min(1, 'Required'),
    phone:   z.string().min(1, 'Required').regex(PHONE_RE, 'Invalid phone'),
    email:   z.string().min(1, 'Required').email('Invalid email'),
  }),
  shippingDetails: z.object({
    portOfLoading:   z.string().min(1, 'Required'),
    portOfDischarge: z.string().min(1, 'Required'),
    vessel:          z.string().min(1, 'Required'),
    containerNumber: z.string().min(1, 'Required'),
    sealNumber:      z.string().min(1, 'Required'),
  }),
  packingItems: z.array(itemSchema).min(1, 'At least one packing item is required'),
  remarks:            z.string().min(1, 'Required'),
  termsAndConditions: z.string().min(1, 'Required'),
});

export default function PackingListPage() {
  useOrganization();
  const org = useSelector((s) => s.tradeOrganization.organization);
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const { draft, saving, error, loadById, saveDraft, saveAndNavigateToReview, clearDraft } = usePackingList();
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
        // handled by PackingContractSelect's empty-state messaging
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

    const seller = contract.seller || {};
    setValue('exporterDetails.companyName', seller.companyName || '', { shouldValidate: true });
    setValue('exporterDetails.address',     seller.address     || '', { shouldValidate: true });
    setValue('exporterDetails.country',     seller.country     || '', { shouldValidate: true });
    setValue('exporterDetails.email',       seller.email       || '', { shouldValidate: true });
    setValue('exporterDetails.phone',       seller.phone       || '', { shouldValidate: true });
    setValue('exporterDetails.taxNumber',   seller.taxNumber   || '', { shouldValidate: true });

    const buyer = contract.buyer || {};
    setValue('buyerDetails.companyName',   buyer.companyName   || '', { shouldValidate: true });
    setValue('buyerDetails.address',       buyer.address       || '', { shouldValidate: true });
    setValue('buyerDetails.country',       buyer.country       || '', { shouldValidate: true });
    setValue('buyerDetails.contactPerson', buyer.contactPerson || '', { shouldValidate: true });
    setValue('buyerDetails.phone',         buyer.phone         || '', { shouldValidate: true });
    setValue('buyerDetails.email',         buyer.email         || '', { shouldValidate: true });
    setValue('buyerDetails.taxNumber',     buyer.taxNumber     || '', { shouldValidate: true });

    const shipment = contract.shipment || {};
    setValue('shippingDetails.portOfLoading',   shipment.loadingPort     || '', { shouldValidate: true });
    setValue('shippingDetails.portOfDischarge', shipment.destinationPort || '', { shouldValidate: true });

    const commodity = contract.commodity || {};
    const packing   = contract.packing   || {};

    setValue('packingItems.0.commodity',     commodity.commodity || '', { shouldValidate: true });
    setValue('packingItems.0.hsnCode',       commodity.hsCode    || '', { shouldValidate: true });
    setValue('packingItems.0.quantity',      shipment.quantity   ?? 1,  { shouldValidate: true });
    setValue('packingItems.0.unit',          shipment.unit       || 'PCS', { shouldValidate: true });
    setValue('packingItems.0.packagingType', packing.packagingType || '', { shouldValidate: true });
    setValue('packingItems.0.marksAndNumbers', packing.bagMarking  || '', { shouldValidate: true });
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
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: BRAND }}>Packing List</h1>
          {draft?.packingListNumber && (
            <p className="text-xs mt-0.5 font-mono" style={{ color: MUTED }}>Draft: {draft.packingListNumber}</p>
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

      <PackingContractSelect
        contracts={contracts}
        loading={contractsLoading}
        value={contractValue}
        onSelect={handleContractSelect}
        disabled={saving}
      />

      <PackingListHeader
        register={register}
        errors={errors}
        packingListNumber={draft?.packingListNumber}
        contractNumber={contractNumber}
        org={org}
      />

      <PackingExporterDetails register={register} errors={errors} />

      <PackingBuyerDetails register={register} errors={errors} />

      <PackingConsignee register={register} errors={errors} />

      <PackingShippingDetails register={register} errors={errors} />

      <PackingItemsTable control={control} errors={errors} />

      <PackingRemarksTerms register={register} errors={errors} />

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
