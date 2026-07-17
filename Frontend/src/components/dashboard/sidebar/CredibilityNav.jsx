import { ShieldCheck } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';

export default function CredibilityNav() {
  return (
    <SidebarSection>
      <NavItem to="/dashboard/credibility" icon={ShieldCheck} label="Credibility" />
    </SidebarSection>
  );
}
