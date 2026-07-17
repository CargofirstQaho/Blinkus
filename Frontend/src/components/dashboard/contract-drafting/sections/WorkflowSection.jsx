import WorkflowTimeline from '../components/WorkflowTimeline';

export default function WorkflowSection() {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden mb-6">
      <div className="p-5 sm:p-6 border-b border-black/5">
        <h2 className="font-display font-bold text-base text-black mb-1">
          Contract Generation Workflow
        </h2>
        <p className="text-xs text-black/50">
          End-to-end trade agreement lifecycle — from trade details to executed contract.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <WorkflowTimeline />
      </div>
    </div>
  );
}
