import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { selectOrganization, selectOrganizationLoaded } from '../store/organizationSlice';
import Spinner from '../../../../components/ui/Spinner';

export default function OrgRequiredGate({ children }) {
  const org    = useSelector(selectOrganization);
  const loaded = useSelector(selectOrganizationLoaded);
  const navigate = useNavigate();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(37,99,235,0.1)' }}
          >
            <Building2 size={28} style={{ color: '#2563eb' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#0f172a' }}>
            Organization Setup Required
          </h2>
          <p className="text-sm mb-6" style={{ color: '#64748b' }}>
            Please complete your organization profile before generating trade documents.
          </p>
          <button
            onClick={() => navigate('/trade/add-organization')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', boxShadow: '0 4px 14px rgba(37,99,235,0.28)' }}
          >
            Go To Organization
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  return children;
}
