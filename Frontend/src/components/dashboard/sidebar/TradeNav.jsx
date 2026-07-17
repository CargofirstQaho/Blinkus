import { TrendingUp, Building2, History, FolderOpen, ShieldCheck } from 'lucide-react';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';
import NavSubGroup from './NavSubGroup';
import { TRADE_NAV_CONFIG } from '../../../modules/trade/constants/tradeNavigationConfig';
import { useEntitlements } from '../subscriptions/hooks/useEntitlements';
import LockedNavItem from '../../../features/trade/Upgrade/components/LockedNavItem';

export default function TradeNav() {
  const { domestic, international } = TRADE_NAV_CONFIG;
  const { canAccessErp } = useEntitlements();

  if (!canAccessErp) {
    return (
      <SidebarSection label="Trade" icon={TrendingUp} collapsible defaultOpen={false}>
        <LockedNavItem icon={FolderOpen} label="Drafts" />
        <LockedNavItem icon={Building2} label="Add Organization" />

        <NavSubGroup icon={domestic.icon} label={domestic.label} basePath={domestic.basePath}>
          {domestic.items.map((item) => (
            <LockedNavItem key={item.id} icon={item.icon} label={item.label} />
          ))}
        </NavSubGroup>

        <NavSubGroup icon={international.icon} label={international.label} basePath={international.basePath}>
          {international.items.map((item) => (
            <LockedNavItem key={item.id} icon={item.icon} label={item.label} />
          ))}
        </NavSubGroup>

        <LockedNavItem icon={ShieldCheck} label="Quality Inspection" />
        <LockedNavItem icon={History} label="Trade History" />
      </SidebarSection>
    );
  }

  return (
    <SidebarSection label="Trade" icon={TrendingUp} collapsible defaultOpen={false}>
      <NavItem to="/trade/drafts" icon={FolderOpen} label="Drafts" />
      <NavItem to="/trade/add-organization" icon={Building2} label="Add Organization" />

      <NavSubGroup icon={domestic.icon} label={domestic.label} basePath={domestic.basePath}>
        {domestic.items.map((item) => (
          <NavItem key={item.id} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </NavSubGroup>

      <NavSubGroup icon={international.icon} label={international.label} basePath={international.basePath}>
        {international.items.map((item) => (
          <NavItem key={item.id} to={item.to} icon={item.icon} label={item.label} />
        ))}
      </NavSubGroup>

      <NavItem to="/trade/quality-inspection" icon={ShieldCheck} label="Quality Inspection" />
      <NavItem to="/trade/history" icon={History} label="Trade History" />
    </SidebarSection>
  );
}
