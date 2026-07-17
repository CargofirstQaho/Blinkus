const STEPS = [
  { step: '01', title: 'Enter Trade Details',  desc: 'Input parties, product specs, and applicable Incoterm.' },
  { step: '02', title: 'Generate Draft',       desc: 'AI assembles a structured, clause-level contract draft.' },
  { step: '03', title: 'Review Clauses',       desc: 'Inspect, edit, and customize each section of the agreement.' },
  { step: '04', title: 'Risk Analysis',        desc: 'AI flags high-risk terms, payment exposure, and liability gaps.' },
  { step: '05', title: 'Legal Validation',     desc: 'Cross-check against trade compliance rules and sanctions.' },
  { step: '06', title: 'Export PDF',           desc: 'Download a professionally formatted, print-ready contract.' },
  { step: '07', title: 'Digital Signatures',   desc: 'Collect legally binding e-signatures from all parties.' },
  { step: '08', title: 'Contract Execution',   desc: 'Activate and archive the executed live agreement.' },
];

export default function WorkflowTimeline() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {STEPS.map(({ step, title, desc }) => (
        <div
          key={step}
          className="flex flex-col gap-2.5 p-4 rounded-xl border border-black/5 bg-white hover:border-accent/20 hover:bg-accent/[0.015] transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent text-[11px] font-black flex items-center justify-center shrink-0">
            {step}
          </div>
          <div className="font-bold text-sm text-black leading-snug">{title}</div>
          <div className="text-xs text-black/45 leading-relaxed">{desc}</div>
        </div>
      ))}
    </div>
  );
}
