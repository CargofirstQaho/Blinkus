import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Save, ArrowRight, AlertCircle, FileText, User, Package,
  Ship, DollarSign, CreditCard, Box, Search, Shield, Plus, Trash2,
  GripVertical, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Loader2, CheckCircle2,
} from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { checkContractNumberApi } from '../services/contractApi';
import { normalizeContractNumber } from '../utils/contractNumber';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const DARK   = '#0F172A';
const MUTED  = '#64748B';

const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
const HS_RE    = /^\d{4,8}$/;
const CNT_RE   = /^[A-Za-z0-9/\-]+$/;
const TODAY    = new Date().toISOString().split('T')[0];

const CONTRACT_TYPES    = ['Sales Contract', 'Purchase Contract', 'Export Contract', 'Import Contract'];
const INCOTERMS         = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP', 'DDP'];
const UNITS             = ['MT', 'KG', 'PCS', 'TON', 'CBM'];
const CURRENCIES        = ['USD', 'EUR', 'INR', 'GBP', 'AED'];
const PAYMENT_METHODS   = ['LC', 'TT', 'CAD', 'DP', 'DA'];

const DEFAULT_FORCE_MAJEURE = `Neither party shall be liable for any failure or delay in performance under this Contract to the extent such failure or delay is caused by circumstances beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, government actions, industrial disputes, fire, flood, or epidemic. The affected party shall notify the other party in writing within 5 business days of the occurrence of such an event.`;

const DEFAULT_ARBITRATION = `Any dispute arising out of or in connection with this Contract, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration under the rules of the International Chamber of Commerce. The arbitration shall be conducted by a sole arbitrator appointed in accordance with the said rules. The seat of arbitration shall be mutually agreed upon by both parties.`;

const DEFAULT_GOVERNING_LAW = `This Contract shall be governed by and construed in accordance with the laws of the jurisdiction mutually agreed upon by both parties. The parties agree to submit to the exclusive jurisdiction of the competent courts of the said jurisdiction for any matters not referred to arbitration.`;

const STD_CLAUSE_DEFAULTS = {
  forceMajeure:      DEFAULT_FORCE_MAJEURE,
  arbitration:       DEFAULT_ARBITRATION,
  qualityClaims:     `The Buyer shall inspect the goods upon receipt. Any claims regarding quality or quantity must be made in writing within 30 days of receipt of goods, supported by independent inspection reports from a recognized international inspection company.`,
  insurance:         `The party responsible for insurance shall maintain adequate marine cargo insurance covering the full invoice value plus 10% against all risks including war risks and strikes, and shall provide evidence of such insurance to the other party upon request.`,
  inspection:        `The Seller shall arrange pre-shipment inspection by an internationally recognized inspection company acceptable to the Buyer at the loading port. The inspection certificate shall be one of the required shipping documents under the payment terms.`,
  paymentDefault:    `In the event of payment default by the Buyer, interest shall accrue at the rate of 2% per month on the outstanding amount from the due date until the date of actual payment, without prejudice to any other remedies available to the Seller under this Contract or applicable law.`,
  disputeResolution: `The parties shall first attempt to resolve any dispute through good faith negotiations within 30 days of the dispute being notified in writing. If the dispute remains unresolved after such period, either party may refer the matter to binding arbitration as provided in the Arbitration clause of this Contract.`,
};

const STD_CLAUSE_LABELS = {
  forceMajeure:      'Force Majeure',
  arbitration:       'Arbitration',
  qualityClaims:     'Quality Claims',
  insurance:         'Insurance',
  inspection:        'Inspection',
  paymentDefault:    'Payment Default',
  disputeResolution: 'Dispute Resolution',
};

const partySchema = z.object({
  companyName:   z.string().optional().default(''),
  address:       z.string().optional().default(''),
  country:       z.string().optional().default(''),
  contactPerson: z.string().optional().default(''),
  phone:         z.string().optional().refine(v => !v || PHONE_RE.test(v), 'Invalid phone').default(''),
  email:         z.string().optional().refine(v => !v || z.string().email().safeParse(v).success, 'Invalid email').default(''),
  taxNumber:     z.string().optional().default(''),
});

const schema = z.object({
  contractNumber: z.string().optional().refine(v => !v || CNT_RE.test(v), 'Only letters, numbers, / and - allowed').default(''),
  contractDate:   z.string().optional().default(''),
  contractType:   z.string().optional().default(''),
  buyerName:      z.string().optional().default(''),
  sellerName:     z.string().optional().default(''),
  buyer:          partySchema,
  seller:         partySchema,
  commodity: z.object({
    commodity:            z.string().optional().default(''),
    hsCode:               z.string().optional().refine(v => !v || HS_RE.test(v), 'Must be 4–8 digits').default(''),
    originCountry:        z.string().optional().default(''),
    qualitySpecification: z.string().optional().default(''),
  }),
  shipment: z.object({
    incoterm:        z.string().optional().default(''),
    loadingPort:     z.string().optional().default(''),
    destinationPort: z.string().optional().default(''),
    partialShipment: z.string().optional().default('No'),
    transshipment:   z.string().optional().default('No'),
    quantity:        z.string().optional().default(''),
    unit:            z.string().optional().default(''),
  }),
  price: z.object({
    currency:           z.string().optional().default('USD'),
    unitPrice:          z.string().optional().default(''),
    totalContractValue: z.string().optional().default(''),
  }),
  paymentTerms: z.object({
    advancePercent: z.string().optional().default(''),
    balancePercent: z.string().optional().default(''),
    paymentMethod:  z.string().optional().default(''),
  }),
  packing: z.object({
    packagingType: z.string().optional().default(''),
    bagMarking:    z.string().optional().default(''),
  }),
  inspection: z.object({
    inspectionAgency:      z.string().optional().default(''),
    inspectionRequirement: z.string().optional().default(''),
  }),
  insurance: z.object({
    responsibility: z.string().optional().default('Seller'),
  }),
  forceMajeure: z.string().optional().default(DEFAULT_FORCE_MAJEURE),
  arbitration:  z.string().optional().default(DEFAULT_ARBITRATION),
  governingLaw: z.string().optional().default(DEFAULT_GOVERNING_LAW),
  clauses: z.array(z.object({
    order:   z.number().default(0),
    title:   z.string().default(''),
    content: z.string().default(''),
  })).default([]),
  standardClauses: z.object({
    forceMajeure:      z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    arbitration:       z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    qualityClaims:     z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    insurance:         z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    inspection:        z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    paymentDefault:    z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
    disputeResolution: z.object({ enabled: z.boolean().default(false), content: z.string().default('') }),
  }).default({}),
});

const buildDefaults = () => ({
  contractNumber: '',
  contractDate:   TODAY,
  contractType:   '',
  buyerName:      '',
  sellerName:     '',
  buyer:   { companyName: '', address: '', country: '', contactPerson: '', phone: '', email: '', taxNumber: '' },
  seller:  { companyName: '', address: '', country: '', contactPerson: '', phone: '', email: '', taxNumber: '' },
  commodity:    { commodity: '', hsCode: '', originCountry: '', qualitySpecification: '' },
  shipment:     { incoterm: '', loadingPort: '', destinationPort: '', partialShipment: 'No', transshipment: 'No', quantity: '', unit: '' },
  price:        { currency: 'USD', unitPrice: '', totalContractValue: '' },
  paymentTerms: { advancePercent: '', balancePercent: '', paymentMethod: '' },
  packing:      { packagingType: '', bagMarking: '' },
  inspection:   { inspectionAgency: '', inspectionRequirement: '' },
  insurance:    { responsibility: 'Seller' },
  forceMajeure: DEFAULT_FORCE_MAJEURE,
  arbitration:  DEFAULT_ARBITRATION,
  governingLaw: DEFAULT_GOVERNING_LAW,
  clauses:      [],
  standardClauses: {
    forceMajeure:      { enabled: false, content: STD_CLAUSE_DEFAULTS.forceMajeure      },
    arbitration:       { enabled: false, content: STD_CLAUSE_DEFAULTS.arbitration       },
    qualityClaims:     { enabled: false, content: STD_CLAUSE_DEFAULTS.qualityClaims     },
    insurance:         { enabled: false, content: STD_CLAUSE_DEFAULTS.insurance         },
    inspection:        { enabled: false, content: STD_CLAUSE_DEFAULTS.inspection        },
    paymentDefault:    { enabled: false, content: STD_CLAUSE_DEFAULTS.paymentDefault    },
    disputeResolution: { enabled: false, content: STD_CLAUSE_DEFAULTS.disputeResolution },
  },
});

function draftToForm(d) {
  if (!d) return buildDefaults();
  const def = buildDefaults();
  return {
    ...def,
    contractNumber: d.contractNumber || '',
    contractDate:   d.contractDate ? new Date(d.contractDate).toISOString().split('T')[0] : TODAY,
    contractType:   d.contractType  || '',
    buyerName:      d.buyerName     || '',
    sellerName:     d.sellerName    || '',
    buyer:          { ...def.buyer,   ...(d.buyer   || {}) },
    seller:         { ...def.seller,  ...(d.seller  || {}) },
    commodity:      { ...def.commodity, ...(d.commodity || {}) },
    shipment: {
      ...def.shipment,
      ...(d.shipment || {}),
      quantity: d.shipment?.quantity != null ? String(d.shipment.quantity) : '',
    },
    price: {
      ...def.price,
      ...(d.price || {}),
      unitPrice:          d.price?.unitPrice          != null ? String(d.price.unitPrice)          : '',
      totalContractValue: d.price?.totalContractValue != null ? String(d.price.totalContractValue) : '',
    },
    paymentTerms: {
      ...def.paymentTerms,
      ...(d.paymentTerms || {}),
      advancePercent: d.paymentTerms?.advancePercent != null ? String(d.paymentTerms.advancePercent) : '',
      balancePercent: d.paymentTerms?.balancePercent != null ? String(d.paymentTerms.balancePercent) : '',
    },
    packing:    { ...def.packing,    ...(d.packing    || {}) },
    inspection: { ...def.inspection, ...(d.inspection || {}) },
    insurance:  { ...def.insurance,  ...(d.insurance  || {}) },
    forceMajeure: d.forceMajeure || DEFAULT_FORCE_MAJEURE,
    arbitration:  d.arbitration  || DEFAULT_ARBITRATION,
    governingLaw: d.governingLaw || DEFAULT_GOVERNING_LAW,
    clauses: (d.clauses || []).map((c, i) => ({ order: c.order ?? i, title: c.title || '', content: c.content || '' })),
    standardClauses: {
      forceMajeure:      { enabled: !!d.standardClauses?.forceMajeure?.enabled,      content: d.standardClauses?.forceMajeure?.content      || STD_CLAUSE_DEFAULTS.forceMajeure      },
      arbitration:       { enabled: !!d.standardClauses?.arbitration?.enabled,       content: d.standardClauses?.arbitration?.content       || STD_CLAUSE_DEFAULTS.arbitration       },
      qualityClaims:     { enabled: !!d.standardClauses?.qualityClaims?.enabled,     content: d.standardClauses?.qualityClaims?.content     || STD_CLAUSE_DEFAULTS.qualityClaims     },
      insurance:         { enabled: !!d.standardClauses?.insurance?.enabled,         content: d.standardClauses?.insurance?.content         || STD_CLAUSE_DEFAULTS.insurance         },
      inspection:        { enabled: !!d.standardClauses?.inspection?.enabled,        content: d.standardClauses?.inspection?.content        || STD_CLAUSE_DEFAULTS.inspection        },
      paymentDefault:    { enabled: !!d.standardClauses?.paymentDefault?.enabled,    content: d.standardClauses?.paymentDefault?.content    || STD_CLAUSE_DEFAULTS.paymentDefault    },
      disputeResolution: { enabled: !!d.standardClauses?.disputeResolution?.enabled, content: d.standardClauses?.disputeResolution?.content || STD_CLAUSE_DEFAULTS.disputeResolution },
    },
  };
}

function inputCls(hasError) {
  return `w-full px-3 py-2 rounded-lg text-sm outline-none transition-all border ${
    hasError
      ? 'border-red-300 bg-red-50 focus:border-red-400'
      : 'border-blue-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;
}

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold" style={{ color: '#374151' }}>
          {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  );
}

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${BORDER}`, background: '#fff' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5"
        style={{ background: GRAD }}
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon size={15} color="#fff" strokeWidth={2.5} />}
          <span className="font-bold text-sm tracking-wide text-white">{title}</span>
        </div>
        {open ? <ChevronUp size={16} color="#fff" /> : <ChevronDown size={16} color="#fff" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

function PartyFields({ prefix, register, errors, control }) {
  const e = errors?.[prefix] || {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Field label="Company Name" required error={e.companyName?.message}>
        <input {...register(`${prefix}.companyName`)} className={inputCls(!!e.companyName)} />
      </Field>
      <Field label="Country" required error={e.country?.message}>
        <input {...register(`${prefix}.country`)} className={inputCls(!!e.country)} />
      </Field>
      <Field label="Address" error={e.address?.message}>
        <input {...register(`${prefix}.address`)} className={inputCls(!!e.address)} />
      </Field>
      <Field label="Contact Person" error={e.contactPerson?.message}>
        <input {...register(`${prefix}.contactPerson`)} className={inputCls(false)} />
      </Field>
      <Field label="Phone" error={e.phone?.message}>
        <input type="tel" {...register(`${prefix}.phone`)} className={inputCls(!!e.phone)} />
      </Field>
      <Field label="Email" error={e.email?.message}>
        <input type="email" {...register(`${prefix}.email`)} className={inputCls(!!e.email)} />
      </Field>
      <Field label="Tax / VAT Number" error={e.taxNumber?.message}>
        <input {...register(`${prefix}.taxNumber`)} placeholder="Optional" className={inputCls(false)} />
      </Field>
    </div>
  );
}

function ClauseBuilder({ control, register, errors }) {
  const { fields, append, remove, move } = useFieldArray({ control, name: 'clauses' });
  const dragIdx = useRef(null);

  const onDragStart = (idx) => { dragIdx.current = idx; };
  const onDragOver  = (e) => e.preventDefault();
  const onDrop      = (idx) => {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    move(dragIdx.current, idx);
    dragIdx.current = null;
  };

  return (
    <div>
      {fields.length === 0 && (
        <p className="text-sm text-center py-6" style={{ color: MUTED }}>
          No custom clauses yet. Click "Add Clause" to create one.
        </p>
      )}
      {fields.map((field, idx) => {
        const e = errors?.clauses?.[idx] || {};
        return (
          <div
            key={field.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(idx)}
            className="mb-3 rounded-xl overflow-hidden"
            style={{ border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: LIGHT }}>
              <GripVertical size={14} color={MUTED} className="cursor-grab shrink-0" />
              <span className="text-xs font-bold" style={{ color: BRAND }}>Clause {idx + 1}</span>
              <button type="button" onClick={() => remove(idx)} className="ml-auto p-1 rounded" style={{ background: '#FEF2F2' }}>
                <Trash2 size={12} color="#DC2626" />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <Controller control={control} name={`clauses.${idx}.title`} render={({ field: f }) => (
                <input {...f} placeholder="Clause Title *" className={inputCls(!!e.title)} />
              )} />
              <Controller control={control} name={`clauses.${idx}.content`} render={({ field: f }) => (
                <textarea {...f} rows={3} placeholder="Clause Content *"
                  className={`${inputCls(!!e.content)} resize-none`} />
              )} />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => append({ order: fields.length, title: '', content: '' })}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        style={{ background: LIGHT, color: BRAND, border: `1.5px dashed ${BRAND}` }}
      >
        <Plus size={15} color={BRAND} /> Add Clause
      </button>
    </div>
  );
}

function StdClauseItem({ clauseKey, label, control, register }) {
  const enabled = useWatch({ control, name: `standardClauses.${clauseKey}.enabled` });

  return (
    <div className="rounded-xl overflow-hidden mb-3" style={{ border: `1px solid ${BORDER}` }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: enabled ? LIGHT : '#F8FAFC' }}>
        <span className="text-sm font-semibold" style={{ color: enabled ? BRAND : DARK }}>{label}</span>
        <Controller
          control={control}
          name={`standardClauses.${clauseKey}.enabled`}
          render={({ field: f }) => (
            <button type="button" onClick={() => f.onChange(!f.value)} className="shrink-0">
              {f.value
                ? <ToggleRight size={24} color={BRAND} />
                : <ToggleLeft size={24} color={MUTED} />
              }
            </button>
          )}
        />
      </div>
      {enabled && (
        <div className="p-3">
          <textarea
            {...register(`standardClauses.${clauseKey}.content`)}
            rows={4}
            className={`${inputCls(false)} resize-none text-xs`}
          />
        </div>
      )}
    </div>
  );
}

export default function ContractDraftFormPage() {
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('id');
  const { draft, saving, error, loadById, saveDraft, saveAndNavigateToReview, clearDraft } = useContract();
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [contractNumberStatus, setContractNumberStatus] = useState('idle'); // idle | checking | available | duplicate
  const autoSaveRef = useRef(null);
  const contractNumberAbortRef = useRef(null);
  const draftIdRef = useRef(null);

  const { register, handleSubmit, control, reset, setFocus, getValues, formState: { errors, isValid } } = useForm({
    resolver:         zodResolver(schema),
    defaultValues:    buildDefaults(),
    mode:             'all',
    shouldFocusError: false,
  });

  const contractNumberValue = useWatch({ control, name: 'contractNumber' });
  const contractNumberField = register('contractNumber');

  useEffect(() => {
    setDraftLoaded(false);
    if (draftId) {
      loadById(draftId);
    } else {
      clearDraft();
      reset(buildDefaults());
    }
  }, [draftId, loadById, clearDraft, reset]);

  useEffect(() => { draftIdRef.current = draft?._id || null; }, [draft]);

  // Issue 6/8: real-time, debounced (500ms), cancellable contract number
  // availability check. Cancels the previous in-flight request and skips
  // the call entirely for empty/invalid values.
  useEffect(() => {
    const value = normalizeContractNumber(contractNumberValue);

    if (contractNumberAbortRef.current) {
      contractNumberAbortRef.current.abort();
      contractNumberAbortRef.current = null;
    }

    if (!value || !CNT_RE.test(value)) {
      setContractNumberStatus('idle');
      return undefined;
    }

    setContractNumberStatus('checking');

    const timer = setTimeout(async () => {
      const controller = new AbortController();
      contractNumberAbortRef.current = controller;
      try {
        const available = await checkContractNumberApi(value, draft?._id, controller.signal);
        setContractNumberStatus(available ? 'available' : 'duplicate');
      } catch (err) {
        if (err?.name !== 'AbortError') {
          setContractNumberStatus('idle');
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      if (contractNumberAbortRef.current) {
        contractNumberAbortRef.current.abort();
        contractNumberAbortRef.current = null;
      }
    };
  }, [contractNumberValue, draft?._id]);

  useEffect(() => {
    if (draft && !draftLoaded) {
      reset(draftToForm(draft));
      setDraftLoaded(true);
    }
  }, [draft, draftLoaded, reset]);

  useEffect(() => {
    autoSaveRef.current = setInterval(async () => {
      const values = getValues();
      await saveDraft({ ...values, documentId: draftIdRef.current });
    }, 60000);
    return () => clearInterval(autoSaveRef.current);
  }, [getValues, saveDraft]);

  const onSaveDraft = useCallback(() => {
    setSubmitError('');
    handleSubmit(async (data) => {
      await saveDraft({ ...data, documentId: draft?._id });
    })();
  }, [handleSubmit, saveDraft, draft]);

  const onSaveAndReview = useCallback(() => {
    setSubmitError('');
    handleSubmit(async (data) => {
      if (!data.contractNumber?.trim()) {
        setSubmitError('Contract Number is required before generating.');
        return;
      }
      if (contractNumberStatus === 'duplicate') {
        setSubmitError('Contract Number Already Exists. Please use a different contract number.');
        return;
      }
      if (!data.contractDate) {
        setSubmitError('Contract Date is required before generating.');
        return;
      }
      if (!data.contractType) {
        setSubmitError('Contract Type is required before generating.');
        return;
      }
      if (!data.buyer?.companyName?.trim()) {
        setSubmitError('Buyer Company Name is required before generating.');
        return;
      }
      if (!data.seller?.companyName?.trim()) {
        setSubmitError('Seller Company Name is required before generating.');
        return;
      }
      if (!data.commodity?.commodity?.trim()) {
        setSubmitError('Commodity is required before generating.');
        return;
      }
      if (!data.commodity?.hsCode?.trim()) {
        setSubmitError('HS Code is required before generating.');
        return;
      }
      if (!data.shipment?.incoterm) {
        setSubmitError('Incoterm is required before generating.');
        return;
      }
      if (!data.shipment?.quantity || parseFloat(data.shipment.quantity) <= 0) {
        setSubmitError('Valid Quantity is required before generating.');
        return;
      }
      if (!data.price?.unitPrice || parseFloat(data.price.unitPrice) <= 0) {
        setSubmitError('Unit Price is required before generating.');
        return;
      }
      if (!data.price?.totalContractValue || parseFloat(data.price.totalContractValue) <= 0) {
        setSubmitError('Total Contract Value is required before generating.');
        return;
      }
      await saveAndNavigateToReview(draft?._id, { ...data, documentId: draft?._id });
    })();
  }, [handleSubmit, saveDraft, saveAndNavigateToReview, draft, contractNumberStatus]);

  const reviewDisabled = saving || contractNumberStatus === 'duplicate';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate('/trade/international/contract-drafting')}
            className="flex items-center gap-1.5 text-sm mb-2 hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
            <ArrowLeft size={14} /> Back to Contracts
          </button>
          <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>Draft New Contract</h1>
          {draft?.contractNumber && (
            <p className="text-xs mt-0.5 font-mono" style={{ color: MUTED }}>Draft: {draft.contractNumber}</p>
          )}
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <button type="button" onClick={onSaveDraft} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
            <Save size={15} color={BRAND} />
            {saving ? 'Saving…' : 'Save Draft'}
          </button>
          <button type="button" onClick={onSaveAndReview} disabled={reviewDisabled}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: GRAD }}>
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

      <Section title="Contract Header" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Contract Number" required error={errors.contractNumber?.message}>
            <input
              {...contractNumberField}
              onChange={(e) => {
                const { selectionStart, selectionEnd } = e.target;
                e.target.value = normalizeContractNumber(e.target.value);
                e.target.setSelectionRange(selectionStart, selectionEnd);
                contractNumberField.onChange(e);
              }}
              placeholder="e.g. CNT/2026/001"
              className={inputCls(!!errors.contractNumber)}
            />
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Letters, numbers, / and - only (case-insensitive)</p>
            {contractNumberStatus === 'checking' && (
              <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: MUTED }}>
                <Loader2 size={12} className="animate-spin" /> Checking availability…
              </p>
            )}
            {contractNumberStatus === 'available' && (
              <p className="text-xs mt-0.5 font-semibold flex items-center gap-1" style={{ color: '#16A34A' }}>
                <CheckCircle2 size={12} /> Contract Number Available
              </p>
            )}
            {contractNumberStatus === 'duplicate' && (
              <p className="text-xs mt-0.5 font-semibold flex items-center gap-1" style={{ color: '#DC2626' }}>
                <AlertCircle size={12} className="mt-0.5 shrink-0" />
                <span>
                  Contract Number Already Exists.
                  <br />
                   Please use a different contract number.
                </span>
              </p>
            )}
          </Field>
          <Field label="Contract Date" required error={errors.contractDate?.message}>
            <input type="date" {...register('contractDate')} className={inputCls(!!errors.contractDate)} />
          </Field>
          <Field label="Contract Type" required error={errors.contractType?.message}>
            <select {...register('contractType')} className={inputCls(!!errors.contractType)}>
              <option value="">Select type…</option>
              {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Buyer Name" required error={errors.buyerName?.message}>
            <input {...register('buyerName')} placeholder="Buyer party name" className={inputCls(!!errors.buyerName)} />
          </Field>
          <Field label="Seller Name" required error={errors.sellerName?.message}>
            <input {...register('sellerName')} placeholder="Seller party name" className={inputCls(!!errors.sellerName)} />
          </Field>
        </div>
      </Section>

      <Section title="Buyer Information" icon={User}>
        <PartyFields prefix="buyer" register={register} errors={errors} control={control} />
      </Section>

      <Section title="Seller Information" icon={User}>
        <PartyFields prefix="seller" register={register} errors={errors} control={control} />
      </Section>

      <Section title="Commodity Information" icon={Package}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Commodity" required error={errors.commodity?.commodity?.message}>
            <input {...register('commodity.commodity')} placeholder="e.g. Basmati Rice" className={inputCls(!!errors.commodity?.commodity)} />
          </Field>
          <Field label="HS Code" required error={errors.commodity?.hsCode?.message}>
            <input {...register('commodity.hsCode')} placeholder="e.g. 10063020" className={inputCls(!!errors.commodity?.hsCode)} />
          </Field>
          <Field label="Country of Origin" error={errors.commodity?.originCountry?.message}>
            <input {...register('commodity.originCountry')} className={inputCls(false)} />
          </Field>
          <Field label="Quality Specification" error={errors.commodity?.qualitySpecification?.message}>
            <textarea rows={2} {...register('commodity.qualitySpecification')} placeholder="Describe quality standards…"
              className={`${inputCls(false)} resize-none`} />
          </Field>
        </div>
      </Section>

      <Section title="Shipment Information" icon={Ship}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Incoterm" required error={errors.shipment?.incoterm?.message}>
            <select {...register('shipment.incoterm')} className={inputCls(!!errors.shipment?.incoterm)}>
              <option value="">Select…</option>
              {INCOTERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Loading Port" error={errors.shipment?.loadingPort?.message}>
            <input {...register('shipment.loadingPort')} className={inputCls(false)} />
          </Field>
          <Field label="Destination Port" error={errors.shipment?.destinationPort?.message}>
            <input {...register('shipment.destinationPort')} className={inputCls(false)} />
          </Field>
          <Field label="Partial Shipment" error={errors.shipment?.partialShipment?.message}>
            <select {...register('shipment.partialShipment')} className={inputCls(false)}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </Field>
          <Field label="Transshipment" error={errors.shipment?.transshipment?.message}>
            <select {...register('shipment.transshipment')} className={inputCls(false)}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Quantity" required error={errors.shipment?.quantity?.message}>
              <input type="number" step="any" min="0" {...register('shipment.quantity')} className={inputCls(!!errors.shipment?.quantity)} />
            </Field>
            <Field label="Unit" error={errors.shipment?.unit?.message}>
              <select {...register('shipment.unit')} className={inputCls(false)}>
                <option value="">Unit…</option>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Price Details" icon={DollarSign}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Currency" required error={errors.price?.currency?.message}>
            <select {...register('price.currency')} className={inputCls(!!errors.price?.currency)}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Unit Price" required error={errors.price?.unitPrice?.message}>
            <input type="number" step="any" min="0" {...register('price.unitPrice')} className={inputCls(!!errors.price?.unitPrice)} />
          </Field>
          <Field label="Total Contract Value" required error={errors.price?.totalContractValue?.message}>
            <input type="number" step="any" min="0" {...register('price.totalContractValue')} className={inputCls(!!errors.price?.totalContractValue)} />
          </Field>
        </div>
      </Section>

      <Section title="Payment Terms" icon={CreditCard}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Advance %" error={errors.paymentTerms?.advancePercent?.message}>
            <input type="number" min="0" max="100" {...register('paymentTerms.advancePercent')} className={inputCls(false)} />
          </Field>
          <Field label="Balance %" error={errors.paymentTerms?.balancePercent?.message}>
            <input type="number" min="0" max="100" {...register('paymentTerms.balancePercent')} className={inputCls(false)} />
          </Field>
          <Field label="Payment Method" error={errors.paymentTerms?.paymentMethod?.message}>
            <select {...register('paymentTerms.paymentMethod')} className={inputCls(false)}>
              <option value="">Select…</option>
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Packing Details" icon={Box} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Packaging Type" error={errors.packing?.packagingType?.message}>
            <input {...register('packing.packagingType')} placeholder="e.g. 50kg PP bags" className={inputCls(false)} />
          </Field>
          <Field label="Bag / Case Marking" error={errors.packing?.bagMarking?.message}>
            <input {...register('packing.bagMarking')} placeholder="e.g. Gross Net Weight" className={inputCls(false)} />
          </Field>
        </div>
      </Section>

      <Section title="Inspection" icon={Search} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Inspection Agency" error={errors.inspection?.inspectionAgency?.message}>
            <input {...register('inspection.inspectionAgency')} placeholder="e.g. Cargofirst, SGS, Bureau Veritas" className={inputCls(false)} />
          </Field>
          <Field label="Inspection Requirement" error={errors.inspection?.inspectionRequirement?.message}>
            <textarea rows={2} {...register('inspection.inspectionRequirement')} placeholder="Describe inspection requirements…"
              className={`${inputCls(false)} resize-none`} />
          </Field>
        </div>
      </Section>

      <Section title="Insurance" icon={Shield} defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Insurance Responsibility" error={errors.insurance?.responsibility?.message}>
            <select {...register('insurance.responsibility')} className={inputCls(false)}>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Force Majeure" icon={FileText} defaultOpen={false}>
        <Field error={errors.forceMajeure?.message}>
          <textarea rows={5} {...register('forceMajeure')} className={`${inputCls(false)} resize-y text-xs`} />
        </Field>
      </Section>

      <Section title="Arbitration" icon={FileText} defaultOpen={false}>
        <Field error={errors.arbitration?.message}>
          <textarea rows={5} {...register('arbitration')} className={`${inputCls(false)} resize-y text-xs`} />
        </Field>
      </Section>

      <Section title="Governing Law" icon={FileText} defaultOpen={false}>
        <Field error={errors.governingLaw?.message}>
          <textarea rows={4} {...register('governingLaw')} className={`${inputCls(false)} resize-y text-xs`} />
        </Field>
      </Section>

      <Section title="Standard Clause Library" icon={FileText} defaultOpen={false}>
        <p className="text-xs mb-4" style={{ color: MUTED }}>
          Toggle to include standard clauses. Each clause is editable before generating.
        </p>
        {Object.keys(STD_CLAUSE_LABELS).map(key => (
          <StdClauseItem
            key={key}
            clauseKey={key}
            label={STD_CLAUSE_LABELS[key]}
            control={control}
            register={register}
          />
        ))}
      </Section>

      <Section title="Custom Clauses" icon={FileText} defaultOpen={false}>
        <p className="text-xs mb-4" style={{ color: MUTED }}>
          Add custom clauses. Drag using the grip handle to reorder. Clauses are numbered automatically.
        </p>
        <ClauseBuilder control={control} register={register} errors={errors} />
      </Section>

      <div className="flex gap-3 justify-end pb-8 flex-wrap">
        <button type="button" onClick={onSaveDraft} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all disabled:opacity-60"
          style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
          <Save size={16} color={BRAND} />{saving ? 'Saving…' : 'Save Draft'}
        </button>
        <button type="button" onClick={onSaveAndReview} disabled={reviewDisabled}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: GRAD }}>
          <ArrowRight size={16} color="#fff" />{saving ? 'Saving…' : 'Save & Review'}
        </button>
      </div>
    </div>
  );
}
