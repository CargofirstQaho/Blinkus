import { FileText } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';

export default function ContractDraftingNav() {
  return (
    <SidebarSection>
      <NavItem to="/dashboard/contract-drafting" icon={FileText} label="Contract Drafting" />
    </SidebarSection>
  );
}
