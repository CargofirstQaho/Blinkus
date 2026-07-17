import { Globe2 } from 'lucide-react';
import ErpModulePage from '../../components/dashboard/subscriptions/components/ErpModulePage';

export default function International() {
  return (
    <ErpModulePage
      moduleKey="international"
      moduleName="International"
      description="Coordinate cross-border trade, documentation, and global logistics."
      icon={Globe2}
    />
  );
}
