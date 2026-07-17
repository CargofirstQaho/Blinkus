import { History } from 'lucide-react';
import ErpModulePage from '../../components/dashboard/subscriptions/components/ErpModulePage';

export default function TradeHistory() {
  return (
    <ErpModulePage
      moduleKey="tradeHistory"
      moduleName="Trade History"
      description="Review your complete history of domestic and international trade activity."
      icon={History}
    />
  );
}
