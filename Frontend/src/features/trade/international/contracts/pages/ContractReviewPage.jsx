import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Download, ArrowLeft, Loader2, AlertCircle, CheckCircle2, FileText, ExternalLink, Upload, Lock, X } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import OrganizationNoticeCard from '../../../organization/components/sections/OrganizationNoticeCard';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const DARK   = '#0F172A';
const MUTED  = '#64748B';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmt(n) { return (parseFloat(n) || 0).toFixed(2); }

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-3 py-1.5 border-b last:border-0" style={{ borderColor: BORDER }}>
      <span className="text-xs font-semibold w-40 shrink-0" style={{ color: MUTED }}>{label}</span>
      <span className="text-sm" style={{ color: DARK }}>{value}</span>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-2.5 text-xs font-bold text-white" style={{ background: GRAD }}>{title}</div>
      <div className="px-4 py-3 bg-white">{children}</div>
    </div>
  );
}

function PartyBox({ title, party }) {
  if (!party) return null;
  return (
    <Box title={title}>
      <Row label="Company"        value={party.companyName}   />
      <Row label="Address"        value={party.address}       />
      <Row label="Country"        value={party.country}       />
      <Row label="Contact Person" value={party.contactPerson} />
      <Row label="Phone"          value={party.phone}         />
      <Row label="Email"          value={party.email}         />
      <Row label="Tax / VAT No."  value={party.taxNumber}     />
    </Box>
  );
}

function ClauseDisplay({ number, title, content }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-bold mb-1.5" style={{ color: BRAND }}>{number}. {title}</p>
      <p className="text-sm leading-relaxed" style={{ color: DARK }}>{content}</p>
    </div>
  );
}

const SIGNED_MAX_MB = parseInt(import.meta.env.VITE_MAX_CONTRACT_FILE_SIZE_MB || '10', 10);
const SIGNED_ALLOWED_EXTS = ['pdf', 'docx'];

const ACCEPTANCE_TEXT = 'I confirm that this signed contract is the final legally executed version. After uploading this document it cannot be edited, replaced or deleted. Please verify carefully before proceeding.';

function validateSignedFile(f) {
  if (!f) return 'Please select a file';
  const ext = f.name.split('.').pop().toLowerCase();
  if (!SIGNED_ALLOWED_EXTS.includes(ext)) return 'Only PDF and DOCX files are allowed';
  if (f.size > SIGNED_MAX_MB * 1024 * 1024) return `File must not exceed ${SIGNED_MAX_MB}MB`;
  return '';
}

function SignedContractUpload({ contractId, uploading, onUploaded }) {
  const { uploadSignedContract } = useContract();
  const fileInputRef = useRef(null);
  const [file, setFile]           = useState(null);
  const [fileError, setFileError] = useState('');
  const [accepted, setAccepted]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFileChange = (f) => {
    const err = validateSignedFile(f);
    if (err) {
      setFile(null);
      setFileError(err);
      return;
    }
    setFile(f);
    setFileError('');
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileChange(f);
  };

  const handleUpload = async () => {
    if (!file || !accepted) return;
    setSubmitError('');
    const fd = new FormData();
    fd.append('document', file);
    const result = await uploadSignedContract(contractId, fd);
    if (result) {
      onUploaded?.(result);
    } else {
      setSubmitError('Failed to upload signed contract. Please try again.');
    }
  };

  return (
    <Box title="UPLOAD SIGNED CONTRACT">
      <div className="py-2 space-y-4">
        <p className="text-sm" style={{ color: MUTED }}>
          Download the generated contract, get it signed by both Buyer and Seller, then upload the final signed copy here.
        </p>

        {submitError && (
          <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
            <p className="text-sm" style={{ color: '#DC2626' }}>{submitError}</p>
          </div>
        )}

        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl cursor-pointer transition-all hover:shadow-md"
          style={{ background: file ? LIGHT : '#fff', border: `2px dashed ${file ? BRAND : BORDER}` }}
        >
          {file ? (
            <>
              <FileText size={28} color={BRAND} />
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: BRAND }}>{file.name}</p>
                <p className="text-xs mt-1" style={{ color: MUTED }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); setFileError(''); }}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                style={{ background: '#FEF2F2', color: '#DC2626' }}>
                <X size={12} /> Remove
              </button>
            </>
          ) : (
            <>
              <Upload size={28} color={BORDER} />
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: MUTED }}>Drop file here or click to browse</p>
                <p className="text-xs mt-1" style={{ color: MUTED }}>PDF or DOCX — max {SIGNED_MAX_MB}MB</p>
              </div>
            </>
          )}
          <input ref={fileInputRef} type="file" className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={e => handleFileChange(e.target.files?.[0])} />
        </div>

        {fileError && (
          <p className="text-xs flex items-center gap-1.5" style={{ color: '#DC2626' }}>
            <AlertCircle size={12} /> {fileError}
          </p>
        )}

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={accepted}
            onChange={e => setAccepted(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-xs leading-relaxed" style={{ color: DARK }}>{ACCEPTANCE_TEXT}</span>
        </label>

        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || !accepted || uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: GRAD }}
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? 'Uploading…' : 'Upload Signed Contract'}
          </button>
        </div>
      </div>
    </Box>
  );
}

function SignedContractLocked({ signedContract }) {
  return (
    <Box title="SIGNED CONTRACT">
      <div className="flex items-center gap-3 py-2">
        <Lock size={20} color="#15803d" />
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: DARK }}>{signedContract.fileName || 'Signed Contract'}</p>
          <p className="text-xs" style={{ color: MUTED }}>
            Uploaded {fmtDate(signedContract.uploadedAt)} — final and cannot be replaced
          </p>
        </div>
        {signedContract.url && (
          <a href={signedContract.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: BRAND }}>
            <ExternalLink size={14} /> View Signed Contract
          </a>
        )}
      </div>
    </Box>
  );
}

export default function ContractReviewPage() {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const org       = useSelector(s => s.tradeOrganization.organization);
  const id        = params.get('id');

  const { draft, loading, generating, uploading, error, loadById, finalizeContract } = useContract();
  const [confirmed, setConfirmed] = useState(false);
  const [pdfUrl, setPdfUrl]       = useState(null);

  useEffect(() => {
    if (id) loadById(id);
  }, [id, loadById]);

  useEffect(() => {
    if (draft?.pdfUrl && draft?.status === 'FINALIZED') {
      setPdfUrl(draft.pdfUrl);
    }
  }, [draft]);

  const handleFinalize = async () => {
    if (!id || !draft) return;
    const result = await finalizeContract(id, draft);
    if (result?.pdfUrl) {
      setPdfUrl(result.pdfUrl);
      setConfirmed(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <Loader2 size={28} className="animate-spin" style={{ color: BRAND }} />
        <p className="text-sm" style={{ color: MUTED }}>Loading contract…</p>
      </div>
    );
  }

  if (error || !draft) {
    return (
      <div className="max-w-xl mx-auto mt-16 px-4">
        <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={20} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <div>
            <p className="font-semibold" style={{ color: '#B91C1C' }}>{error || 'Contract not found'}</p>
            <button onClick={() => navigate('/trade/international/contract-drafting')}
              className="text-sm mt-2 underline" style={{ color: '#DC2626' }}>
              Back to Contracts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isUpload   = draft.contractMode === 'UPLOAD';
  const isFinalized = draft.status === 'FINALIZED' || confirmed;
  const awaitingSignature = !isUpload && draft.activationStatus === 'AWAITING_SIGNATURE';
  const ct         = draft;
  const com        = ct.commodity    || {};
  const ship       = ct.shipment     || {};
  const price      = ct.price        || {};
  const pmt        = ct.paymentTerms || {};
  const pack       = ct.packing      || {};
  const ins        = ct.inspection   || {};
  const insu       = ct.insurance    || {};
  const cur        = price.currency  || 'USD';

  const STD_LABELS = {
    forceMajeure:      'Force Majeure',
    arbitration:       'Arbitration',
    qualityClaims:     'Quality Claims',
    insurance:         'Insurance',
    inspection:        'Inspection',
    paymentDefault:    'Payment Default',
    disputeResolution: 'Dispute Resolution',
  };

  let clauseNum = 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <button onClick={() => navigate('/trade/international/contract-drafting')}
            className="flex items-center gap-1.5 text-sm mb-2 hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
            <ArrowLeft size={14} /> Back to Contracts
          </button>
          <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>
            {isUpload ? 'Uploaded Contract' : 'Contract Review'}
          </h1>
          <p className="text-sm mt-0.5 font-mono" style={{ color: MUTED }}>{ct.contractNumber}</p>
        </div>
        <div>
          {isFinalized ? (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: LIGHT, color: BRAND }}>
              <CheckCircle2 size={14} /> Finalized
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: LIGHT, color: BRAND }}>
              Draft
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {org && (
        <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
          {org.logoUrl && (
            <img src={org.logoUrl} alt="logo" className="w-12 h-12 rounded-xl object-contain border" style={{ borderColor: BORDER }} />
          )}
          <div>
            <p className="font-bold text-sm" style={{ color: DARK }}>{org.organizationName}</p>
            <p className="text-xs" style={{ color: MUTED }}>{org.contact?.address}</p>
            {(org.gstNumber || org.kyc?.gst?.number) && (
              <p className="text-xs" style={{ color: MUTED }}>GST: {org.gstNumber || org.kyc.gst.number}</p>
            )}
          </div>
          <span className="ml-auto shrink-0 text-xs font-bold px-3 py-1.5 rounded-full text-white"
            style={{ background: GRAD }}>
            {(ct.contractType || 'TRADE CONTRACT').toUpperCase()}
          </span>
        </div>
      )}

      {awaitingSignature && (
        <OrganizationNoticeCard
          variant="pending"
          title="Signed Contract Pending"
          message="This contract cannot be used to generate Commercial Invoice, Packing List or Proforma Invoice until the final signed contract is uploaded."
        />
      )}

      {awaitingSignature && (
        <SignedContractUpload
          contractId={id}
          uploading={uploading}
          onUploaded={() => setConfirmed(true)}
        />
      )}

      {!isUpload && draft.signedContract && (
        <SignedContractLocked signedContract={draft.signedContract} />
      )}

      {isUpload && ct.documentUrl && (
        <Box title="CONTRACT DOCUMENT">
          <div className="flex items-center gap-3 py-2">
            <FileText size={20} color={BRAND} />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: DARK }}>Uploaded Contract Document</p>
              <p className="text-xs" style={{ color: MUTED }}>
                Buyer: {ct.buyerName}  •  Seller: {ct.sellerName}
              </p>
            </div>
            <a href={ct.documentUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: BRAND }}>
              <ExternalLink size={14} /> View Document
            </a>
          </div>
        </Box>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Box title="CONTRACT DETAILS">
          <Row label="Contract Number"  value={ct.contractNumber}           />
          <Row label="Date"             value={fmtDate(ct.contractDate)}    />
          <Row label="Contract Type"    value={ct.contractType}             />
          <Row label="Buyer Name"       value={ct.buyerName}                />
          <Row label="Seller Name"      value={ct.sellerName}               />
        </Box>

        <Box title="COMMODITY DETAILS">
          <Row label="Commodity"             value={com.commodity}            />
          <Row label="HS Code"               value={com.hsCode}               />
          <Row label="Country of Origin"     value={com.originCountry}        />
          <Row label="Quality Specification" value={com.qualitySpecification} />
        </Box>
      </div>

      {!isUpload && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PartyBox title="BUYER DETAILS"  party={ct.buyer}  />
            <PartyBox title="SELLER DETAILS" party={ct.seller} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box title="SHIPMENT TERMS">
              <Row label="Incoterm"          value={ship.incoterm}        />
              <Row label="Loading Port"      value={ship.loadingPort}     />
              <Row label="Destination Port"  value={ship.destinationPort} />
              <Row label="Partial Shipment"  value={ship.partialShipment} />
              <Row label="Transshipment"     value={ship.transshipment}   />
              <Row label="Quantity"          value={ship.quantity != null ? `${ship.quantity} ${ship.unit || ''}`.trim() : null} />
            </Box>

            <Box title="PRICE & PAYMENT">
              <Row label="Currency"             value={cur}                />
              <Row label="Unit Price"           value={price.unitPrice != null ? `${cur} ${fmt(price.unitPrice)}` : null} />
              <Row label="Total Contract Value" value={price.totalContractValue != null ? `${cur} ${fmt(price.totalContractValue)}` : null} />
              <Row label="Advance %"            value={pmt.advancePercent != null ? `${pmt.advancePercent}%` : null} />
              <Row label="Balance %"            value={pmt.balancePercent != null ? `${pmt.balancePercent}%` : null} />
              <Row label="Payment Method"       value={pmt.paymentMethod}  />
            </Box>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box title="PACKING & INSPECTION">
              <Row label="Packaging Type"         value={pack.packagingType}       />
              <Row label="Bag / Case Marking"     value={pack.bagMarking}          />
              <Row label="Inspection Agency"      value={ins.inspectionAgency}     />
              <Row label="Inspection Requirement" value={ins.inspectionRequirement}/>
              <Row label="Insurance By"           value={insu.responsibility}      />
            </Box>
          </div>

          {(ct.forceMajeure || ct.arbitration || ct.governingLaw ||
            Object.values(ct.standardClauses || {}).some(s => s?.enabled) ||
            (ct.clauses || []).length > 0) && (
            <Box title="CONTRACT CLAUSES">
              <div className="py-2">
                {Object.entries(ct.standardClauses || {}).map(([key, sc]) => {
                  if (!sc?.enabled || !sc?.content) return null;
                  const label = { forceMajeure: 'Force Majeure', arbitration: 'Arbitration', qualityClaims: 'Quality Claims', insurance: 'Insurance', inspection: 'Inspection', paymentDefault: 'Payment Default', disputeResolution: 'Dispute Resolution' }[key];
                  return <ClauseDisplay key={key} number={clauseNum++} title={label} content={sc.content} />;
                })}

                {ct.forceMajeure && (
                  <ClauseDisplay number={clauseNum++} title="Force Majeure" content={ct.forceMajeure} />
                )}
                {ct.arbitration && (
                  <ClauseDisplay number={clauseNum++} title="Arbitration" content={ct.arbitration} />
                )}
                {ct.governingLaw && (
                  <ClauseDisplay number={clauseNum++} title="Governing Law" content={ct.governingLaw} />
                )}

                {[...(ct.clauses || [])].sort((a, b) => a.order - b.order).map(cl => {
                  if (!cl.title || !cl.content) return null;
                  return <ClauseDisplay key={cl.order} number={clauseNum++} title={cl.title} content={cl.content} />;
                })}
              </div>
            </Box>
          )}
        </>
      )}

      <div className="py-2 text-center">
        <p className="text-xs" style={{ color: MUTED }}>Generated by Blinkus AI</p>
      </div>

      {!isUpload && (
        <div className="flex flex-col sm:flex-row gap-3 justify-end pb-8">
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: GRAD }}>
              <Download size={16} /> Download PDF
            </a>
          )}
          {!isFinalized && (
            <button onClick={handleFinalize} disabled={generating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: GRAD }}>
              {generating && <Loader2 size={16} className="animate-spin" />}
              {generating ? 'Generating…' : 'Finalize & Generate PDF'}
            </button>
          )}
          {isFinalized && pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all"
              style={{ background: GRAD }}>
              <Download size={16} /> Open PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
