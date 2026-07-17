import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useContract } from '../hooks/useContract';
import { normalizeContractNumber } from '../utils/contractNumber';

const BRAND  = '#2563EB';
const BRAND2 = '#1D4ED8';
const LIGHT  = '#EFF6FF';
const BORDER = '#BFDBFE';
const GRAD   = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
const DARK   = '#0F172A';
const MUTED  = '#64748B';

const CONTRACT_NUMBER_RE = /^[A-Za-z0-9/\-]+$/;
const MAX_MB = parseInt(import.meta.env.VITE_MAX_CONTRACT_FILE_SIZE_MB || '10', 10);

const metaSchema = z.object({
  contractNumber: z.string()
    .min(1, 'Contract number is required')
    .regex(CONTRACT_NUMBER_RE, 'Only letters, numbers, / and - are allowed')
    .max(100, 'Must be under 100 characters'),
  buyerName:  z.string().min(1, 'Buyer name is required').max(200),
  sellerName: z.string().min(1, 'Seller name is required').max(200),
  disclaimer: z.literal(true, { errorMap: () => ({ message: 'You must accept the disclaimer to continue' }) }),
});

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXTS  = ['pdf', 'doc', 'docx'];

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

export default function ContractUploadPage() {
  const navigate = useNavigate();
  const { uploading, error, uploadContract } = useContract();

  const [step, setStep] = useState(1);
  const [metaData, setMetaData] = useState(null);
  const [file, setFile]         = useState(null);
  const [fileError, setFileError] = useState('');
  const [result, setResult]     = useState(null);
  const fileInputRef = useRef(null);
  const dropRef      = useRef(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver:      zodResolver(metaSchema),
    defaultValues: { contractNumber: '', buyerName: '', sellerName: '', disclaimer: false },
  });

  const contractNumberField = register('contractNumber');

  const onMetaSubmit = (data) => {
    setMetaData(data);
    setStep(2);
  };

  const validateFile = (f) => {
    if (!f) return 'Please select a file';
    const ext = f.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) return 'Only PDF, DOC, and DOCX files are allowed';
    if (f.size > MAX_MB * 1024 * 1024) return `File must not exceed ${MAX_MB}MB`;
    return '';
  };

  const handleFileChange = (f) => {
    const err = validateFile(f);
    setFileError(err);
    if (!err) setFile(f);
    else setFile(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileChange(f);
  };

  const onUploadSubmit = async () => {
    if (!file) { setFileError('Please select a file'); return; }
    const err = validateFile(file);
    if (err) { setFileError(err); return; }

    const fd = new FormData();
    fd.append('contractNumber', metaData.contractNumber);
    fd.append('buyerName',      metaData.buyerName);
    fd.append('sellerName',     metaData.sellerName);
    fd.append('document',       file);

    const contract = await uploadContract(fd);
    if (contract) setResult(contract);
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: LIGHT }}>
          <CheckCircle2 size={32} color={BRAND} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-extrabold" style={{ color: BRAND }}>Contract Uploaded</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>The contract has been saved and is now available for use.</p>
        </div>
        <div className="w-full rounded-2xl p-5 space-y-3" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
          <div className="flex justify-between">
            <span className="text-xs font-semibold" style={{ color: MUTED }}>Contract Number</span>
            <span className="text-sm font-bold" style={{ color: DARK }}>{result.contractNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold" style={{ color: MUTED }}>Buyer</span>
            <span className="text-sm" style={{ color: DARK }}>{result.buyerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold" style={{ color: MUTED }}>Seller</span>
            <span className="text-sm" style={{ color: DARK }}>{result.sellerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold" style={{ color: MUTED }}>Status</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: LIGHT, color: BRAND }}>FINALIZED</span>
          </div>
          {result.documentUrl && (
            <a href={result.documentUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: BRAND }}>
              <ExternalLink size={14} /> View Document
            </a>
          )}
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => navigate('/trade/international/contract-drafting')}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: GRAD }}
          >
            Back to Contracts
          </button>
          <button
            onClick={() => { setResult(null); setFile(null); setMetaData(null); setStep(1); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}
          >
            Upload Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <button onClick={() => navigate('/trade/international/contract-drafting')}
          className="flex items-center gap-1.5 text-sm mb-3 hover:opacity-70 transition-opacity" style={{ color: MUTED }}>
          <ArrowLeft size={14} /> Back to Contracts
        </button>
        <h1 className="text-2xl font-extrabold" style={{ color: BRAND }}>Upload Existing Contract</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>Register a signed contract document in the system.</p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: n <= step ? GRAD : '#E2E8F0', color: n <= step ? '#fff' : MUTED }}>
              {n < step ? '✓' : n}
            </div>
            <span className="text-xs font-semibold" style={{ color: n <= step ? BRAND : MUTED }}>
              {n === 1 ? 'Contract Details' : 'Upload Document'}
            </span>
            {n < 2 && <div className="w-8 h-0.5 rounded" style={{ background: step > n ? BRAND : '#E2E8F0' }} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3.5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <AlertCircle size={16} color="#DC2626" className="mt-0.5 shrink-0" />
          <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSubmit(onMetaSubmit)} className="space-y-5">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${BORDER}` }}>
            <div className="px-5 py-3.5" style={{ background: GRAD }}>
              <span className="text-sm font-bold text-white">Contract Information</span>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Contract Number" required error={errors.contractNumber?.message}>
                <input
                  {...contractNumberField}
                  onChange={(e) => {
                    const { selectionStart, selectionEnd } = e.target;
                    e.target.value = normalizeContractNumber(e.target.value);
                    e.target.setSelectionRange(selectionStart, selectionEnd);
                    contractNumberField.onChange(e);
                  }}
                  placeholder="e.g. CNT/2026/001 or EXP-IND-001"
                  className={inputCls(!!errors.contractNumber)}
                />
                <p className="text-xs mt-1" style={{ color: MUTED }}>Allowed: letters, numbers, / and - (case-insensitive)</p>
              </Field>
              <Field label="Buyer Name" required error={errors.buyerName?.message}>
                <input {...register('buyerName')} className={inputCls(!!errors.buyerName)} />
              </Field>
              <Field label="Seller Name" required error={errors.sellerName?.message}>
                <input {...register('sellerName')} className={inputCls(!!errors.sellerName)} />
              </Field>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <p className="text-sm font-semibold mb-2" style={{ color: '#92400E' }}>Disclaimer</p>
            <p className="text-xs mb-3" style={{ color: '#92400E' }}>
              Once this contract is saved, the Contract Number, Buyer Name and Seller Name cannot be modified. Please review carefully before continuing.
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" {...register('disclaimer')} className="mt-0.5 w-4 h-4 accent-blue-600" />
              <span className="text-xs font-semibold" style={{ color: '#92400E' }}>
                I have reviewed the information and understand it cannot be changed after saving.
              </span>
            </label>
            {errors.disclaimer && (
              <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{errors.disclaimer.message}</p>
            )}
          </div>

          <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: GRAD }}>
            Continue to Upload
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-4" style={{ background: LIGHT, border: `1px solid ${BORDER}` }}>
            <p className="text-xs font-semibold mb-2" style={{ color: BRAND }}>Contract Details</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span style={{ color: MUTED }}>Number:</span>
              <span className="font-semibold" style={{ color: DARK }}>{metaData.contractNumber}</span>
              <span style={{ color: MUTED }}>Buyer:</span>
              <span style={{ color: DARK }}>{metaData.buyerName}</span>
              <span style={{ color: MUTED }}>Seller:</span>
              <span style={{ color: DARK }}>{metaData.sellerName}</span>
            </div>
          </div>

          <div
            ref={dropRef}
            onDrop={onDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl cursor-pointer transition-all hover:shadow-md"
            style={{ background: file ? LIGHT : '#fff', border: `2px dashed ${file ? BRAND : BORDER}` }}
          >
            {file ? (
              <>
                <FileText size={32} color={BRAND} />
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color: BRAND }}>{file.name}</p>
                  <p className="text-xs mt-1" style={{ color: MUTED }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); setFileError(''); }}
                  className="flex items-center gap-1 text-xs px-3 py-1 rounded-lg"
                  style={{ background: '#FEF2F2', color: '#DC2626' }}
                >
                  <X size={12} /> Remove
                </button>
              </>
            ) : (
              <>
                <Upload size={32} color={BORDER} />
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color: MUTED }}>Drop file here or click to browse</p>
                  <p className="text-xs mt-1" style={{ color: MUTED }}>PDF, DOC, DOCX — max {MAX_MB}MB</p>
                </div>
              </>
            )}
            <input ref={fileInputRef} type="file" className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={e => handleFileChange(e.target.files?.[0])} />
          </div>

          {fileError && (
            <p className="text-xs" style={{ color: '#ef4444' }}>{fileError}</p>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: '#fff', color: BRAND, border: `1.5px solid ${BRAND}` }}>
              Back
            </button>
            <button onClick={onUploadSubmit} disabled={uploading || !file}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: GRAD }}>
              {uploading && <Loader2 size={15} className="animate-spin" />}
              {uploading ? 'Uploading…' : 'Upload & Finalize'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
