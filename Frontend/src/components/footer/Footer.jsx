import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import SocialLinks from './social/SocialLinks';
import CompanySection from './company/CompanySection';
import ResourcesSection from './resources/ResourcesSection';

const PLATFORM_LINKS = [
  { label: 'Trade Agent',       href: '#' },
  { label: 'Market Discovery',  href: '#' },
  { label: 'Risk Engine',       href: '#' },
  { label: 'API Access',        href: '#' },
];

const LEGAL_LINKS = [
  { label: 'Terms',   href: '/terms-and-conditions' },
  { label: 'Privacy', href: '/privacy-policy' },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white pt-24 pb-12 px-6 border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="mb-6">
              <Link to="/">
                <BrandLogo logoHeight="h-20" textSize="text-2xl" />
              </Link>
            </div>
            <p className="text-black/60 max-w-sm mb-8 leading-relaxed text-sm">
              Advancing global trade through autonomous intelligence and real-time connectivity.
              Built for the modern trader.
            </p>
            <SocialLinks />
          </div>

          {/* <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-black/60">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="hover:text-accent transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          <CompanySection />
          <ResourcesSection />
        </div>

        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-black/40 font-medium">
            © 2026 BLINKUS AI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs font-bold text-black/40 uppercase tracking-widest">
            {LEGAL_LINKS.map(({ label, href }) =>
              href.startsWith('/') ? (
                <Link key={label} to={href} className="hover:text-accent transition-colors duration-200">
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} className="hover:text-accent transition-colors duration-200">
                  {label}
                </a>
              )
            )}
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              BACK TO TOP <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
