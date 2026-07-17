import ComingSoonOverlay from './ComingSoonOverlay';
import ContractDocument from '../preview/ContractDocument';

export default function ContractPreview() {
  return (
    <div className="relative rounded-xl overflow-hidden border border-black/5 bg-gray-50/30">
      <ComingSoonOverlay />
      <div className="max-h-[580px] overflow-y-hidden">
        <ContractDocument />
      </div>
    </div>
  );
}
