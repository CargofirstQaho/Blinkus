import { useCallback, useRef, useState } from 'react';
import { ImagePlus, UploadCloud, Loader2, ImageOff, AlertCircle } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function validateFile(file) {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_TYPES.includes(file.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
    return 'Only JPG, JPEG, PNG, or WEBP images are allowed';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'Image size must be 5MB or smaller';
  }
  return null;
}

export default function LogoUploader({ logoUrl, onUpload, uploading = false }) {
  const [dragActive, setDragActive]     = useState(false);
  const [previewUrl, setPreviewUrl]     = useState(null);
  const [fileError, setFileError]       = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback((file) => {
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }
    setFileError(null);
    setPreviewUrl(URL.createObjectURL(file));
    onUpload?.(file);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, [handleFile]);

  const displayUrl = previewUrl || logoUrl || null;

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>
        Organization Logo
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
        onDrop={handleDrop}
        className="relative rounded-2xl flex flex-col items-center justify-center text-center px-4 py-8 transition-colors"
        style={{
          border: `1.5px dashed ${fileError ? '#ef4444' : dragActive ? '#3b82f6' : '#cbd5e1'}`,
          background: dragActive ? 'rgba(59,130,246,0.06)' : '#f8fafc',
          minHeight: '220px',
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={28} className="animate-spin" style={{ color: '#2563eb' }} />
            <p className="text-sm" style={{ color: '#64748b' }}>Uploading logo...</p>
          </div>
        ) : displayUrl ? (
          <div className="flex flex-col items-center gap-3 w-full">
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden flex items-center justify-center bg-white"
              style={{ border: '1px solid #e2e8f0' }}
            >
              <img src={displayUrl} alt="Organization logo preview" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all hover:opacity-90"
              style={{ border: '1px solid #e2e8f0', color: '#2563eb', background: '#ffffff' }}
            >
              <ImagePlus size={14} />
              Replace logo
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(37,99,235,0.1)' }}
            >
              <UploadCloud size={22} style={{ color: '#2563eb' }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#0f172a' }}>
                Drag and drop your logo here
              </p>
              <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                or click below to browse files
              </p>
            </div>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }}
            >
              <ImagePlus size={14} />
              Upload logo
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {fileError ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#ef4444' }}>
          <AlertCircle size={12} />
          {fileError}
        </p>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#94a3b8' }}>
          <ImageOff size={12} />
          JPG, JPEG, PNG or WEBP — max size 5MB
        </p>
      )}
    </div>
  );
}
