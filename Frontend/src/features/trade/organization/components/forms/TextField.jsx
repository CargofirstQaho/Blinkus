const baseInput =
  'w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all bg-white placeholder-slate-400';

export default function TextField({
  label,
  name,
  register,
  error,
  type = 'text',
  placeholder,
  required = false,
  icon: Icon,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: '#64748b' }}>
        {label}
        {required && <span style={{ color: '#dc2626' }}> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#94a3b8' }}
          />
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={`${baseInput} ${Icon ? 'pl-10' : ''}`}
          style={{
            border: `1px solid ${error ? '#fca5a5' : '#e2e8f0'}`,
            color: '#0f172a',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? '#dc2626' : '#3b82f6';
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(220,38,38,0.12)'
              : '0 0 0 3px rgba(59,130,246,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#fca5a5' : '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
          {...register(name)}
          {...rest}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: '#dc2626' }}>
          {error.message}
        </p>
      )}
    </div>
  );
}
