import { Building2 } from 'lucide-react';
import ErpModulePage from '../../components/dashboard/subscriptions/components/ErpModulePage';
import AddOrganizationPage from '../../features/trade/organization/pages/AddOrganizationPage';

export default function AddOrganization() {
  return (
    <ErpModulePage
      moduleKey="addOrganization"
      moduleName="Add Organization"
      description="Register and manage your trade organizations within the workspace."
      icon={Building2}
    >
      <AddOrganizationPage />
    </ErpModulePage>
  );
}
