import { Rocket, Sparkles } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';
import { COMING_SOON_MODULES } from '../coming-soon/data/comingSoonData';

const SIDEBAR_MODULES = COMING_SOON_MODULES.filter((m) => m.route !== null && m.id !== 'contract-drafting');

export default function ComingSoonSidebarGroup() {
  return (
    <SidebarSection label="Coming Soon" icon={Rocket} collapsible defaultOpen={false}>
      <NavItem to="/dashboard/coming-soon" icon={Sparkles} label="All Modules" end />
      {SIDEBAR_MODULES.map((mod) => (
        <NavItem
          key={mod.id}
          to={mod.route}
          icon={mod.icon}
          label={mod.label}
        />
      ))}
    </SidebarSection>
  );
}
