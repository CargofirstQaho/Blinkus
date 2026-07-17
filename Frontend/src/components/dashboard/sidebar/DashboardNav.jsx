import { LayoutDashboard } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';

export default function DashboardNav() {
  return (
    <SidebarSection>
      <NavItem to="/dashboard" end icon={LayoutDashboard} label="Dashboard" />
    </SidebarSection>
  );
}
