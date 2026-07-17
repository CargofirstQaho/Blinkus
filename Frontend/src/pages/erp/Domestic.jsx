import { Home } from 'lucide-react';
import ErpModulePage from '../../components/dashboard/subscriptions/components/ErpModulePage';

export default function Domestic() {
  return (
    <ErpModulePage
      moduleKey="domestic"
      moduleName="Domestic"
      description="Manage domestic trade operations, shipments, and compliance in one place."
      icon={Home}
    />
  );
}
