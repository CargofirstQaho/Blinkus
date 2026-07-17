import { Loader2 } from 'lucide-react';
import OrganizationInformationTab from '../components/tabs/OrganizationInformationTab';
import { useOrganization } from '../hooks/useOrganization';
import Spinner from '../../../../components/ui/Spinner';

export default function AddOrganizationPage() {
  const { organization, loading, loaded, saving, saveOrganization, uploadLogo } = useOrganization();

  if (loading && !loaded) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <OrganizationInformationTab
        organization={organization}
        saving={saving}
        onSave={saveOrganization}
        onUploadLogo={uploadLogo}
      />

      {loading && loaded && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg" style={{ background: '#0f172a' }}>
          <Loader2 size={14} className="animate-spin" />
          Refreshing organization data...
        </div>
      )}
    </div>
  );
}
