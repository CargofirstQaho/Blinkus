import { Link } from 'react-router-dom';
import FooterSectionTitle from '../shared/FooterSectionTitle';
import { resourceLinks } from '../data/footerData';

export default function ResourcesSection() {
  return (
    <div>
      <FooterSectionTitle>Resources</FooterSectionTitle>
      <ul className="space-y-4 text-sm font-medium text-black/60">
        {resourceLinks.map(({ label, to }) => (
          <li key={label}>
            <Link to={to} className="hover:text-accent transition-colors duration-200">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
