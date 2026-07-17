import { Settings } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';

export default function SettingsNav() {
  return (
    <SidebarSection>
      <NavItem to="/settings" icon={Settings} label="Settings" />
    </SidebarSection>
  );
}
