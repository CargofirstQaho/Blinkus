import { socialLinks } from '../data/footerData';

export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {socialLinks.map(({ name, Icon, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/50 hover:bg-accent hover:text-white hover:border-accent hover:scale-110 transition-all duration-200"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
