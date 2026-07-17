export default function VerificationInfoCard({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-black/5 bg-white hover:border-accent/20 hover:bg-accent/[0.015] transition-all">
      <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm text-black mb-0.5">{title}</div>
        <div className="text-xs text-black/50 leading-relaxed">{description}</div>
      </div>
    </div>
  );
}
