export default function ContractSection({ number, title, children }) {
  return (
    <div className="mb-7">
      <div className="flex items-baseline gap-2 mb-3 pb-2 border-b border-black/8">
        {number && (
          <span className="text-[10px] font-black text-black/30 tracking-widest uppercase w-5 shrink-0">
            {number}.
          </span>
        )}
        <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-black/45">{title}</h3>
      </div>
      {children}
    </div>
  );
}
