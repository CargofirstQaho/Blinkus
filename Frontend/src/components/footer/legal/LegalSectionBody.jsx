import { Mail, Globe, Phone } from 'lucide-react';

export default function LegalSectionBody({ section }) {
  if (section.isContact) {
    return (
      <div className="space-y-4">
        <p className="text-black/60 leading-relaxed text-base">Blinkus.AI</p>
        <div className="space-y-3">
          <a
            href="mailto:orbit@blinkus.ai"
            className="flex items-center gap-3 text-black/60 hover:text-accent transition-colors duration-200 text-sm font-medium"
          >
            <Mail size={16} className="text-accent" /> orbit@blinkus.ai
          </a>
          <a
            href="https://www.blinkus.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-black/60 hover:text-accent transition-colors duration-200 text-sm font-medium"
          >
            <Globe size={16} className="text-accent" /> www.blinkus.ai
          </a>
          <div className="flex items-center gap-3 text-black/60 text-sm font-medium">
            <Phone size={16} className="text-accent" /> +91 9035462042
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {section.paragraphs?.map((text, i) => (
        <p key={i} className="text-black/60 leading-relaxed text-base">
          {text}
        </p>
      ))}

      {section.list && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {section.list.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-black/60">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.trailingParagraphs?.map((text, i) => (
        <p key={i} className="text-black/60 leading-relaxed text-base pt-2">
          {text}
        </p>
      ))}
    </div>
  );
}
