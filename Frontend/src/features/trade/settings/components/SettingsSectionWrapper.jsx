export default function SettingsSectionWrapper({ title, description, children }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-6">
        <h2 className="text-lg font-display font-bold" style={{ color: '#0f172a' }}>{title}</h2>
        {description && (
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{description}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
