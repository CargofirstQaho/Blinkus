import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

export default function SearchableSelectField({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  error,
  placeholder = 'Search and select',
  required = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setQuery('');
        onBlur?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    const lower = query.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(lower));
  }, [options, query]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={`${name}-search`} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <button
        type="button"
        id={name}
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 pl-3.5 pr-3 py-2.5 text-sm rounded-xl outline-none transition-all bg-white text-left"
        style={{ border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`, color: selectedOption ? '#0f172a' : '#94a3b8' }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={16} style={{ color: '#94a3b8' }} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-30 mt-1.5 w-full rounded-xl bg-white shadow-xl overflow-hidden"
          style={{ border: '1px solid #e2e8f0', boxShadow: '0 12px 32px rgba(15,23,42,0.12)' }}
        >
          <div className="p-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                id={`${name}-search`}
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg outline-none bg-white"
                style={{ border: '1px solid #e2e8f0', color: '#0f172a' }}
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 && (
              <p className="px-3.5 py-3 text-sm text-center" style={{ color: '#94a3b8' }}>
                No matching results
              </p>
            )}
            {filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                    setQuery('');
                    onBlur?.();
                  }}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-sm text-left transition-colors hover:bg-slate-50"
                  style={{ color: isSelected ? '#2563eb' : '#0f172a' }}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check size={14} style={{ color: '#2563eb' }} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs" style={{ color: '#dc2626' }}>
          {error.message}
        </p>
      )}
    </div>
  );
}
