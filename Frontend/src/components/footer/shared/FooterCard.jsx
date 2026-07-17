export default function FooterCard({ image, title, description, url, badge }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-black/8 overflow-hidden hover:border-accent/40 hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-video bg-gradient-to-br from-accent/10 to-accent/5 overflow-hidden relative">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
      </div>
      <div className="p-5">
        {badge && (
          <span className="text-xs font-bold text-accent uppercase tracking-wider mb-2 block">
            {badge}
          </span>
        )}
        <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-black/50 leading-relaxed line-clamp-3">{description}</p>
        <div className="mt-4 text-xs font-bold text-accent flex items-center gap-1.5">
          Read More
          <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
        </div>
      </div>
    </a>
  );
}
