import OrganizationCreateForm from '../forms/OrganizationCreateForm';
import OrganizationProfileView from '../sections/OrganizationProfileView';
import OrganizationNoticeCard from '../sections/OrganizationNoticeCard';

export default function OrganizationInformationTab({ organization, saving, onSave, onUploadLogo }) {
  if (organization) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <OrganizationNoticeCard
          variant="success"
          title="Registered & Locked"
          message="Your organization has been successfully registered and locked. Changes are not permitted after submission."
        />
        <OrganizationProfileView organization={organization} />
      </div>
    );
  }

  return (
    <OrganizationCreateForm
      saving={saving}
      onSave={onSave}
      onUploadLogo={onUploadLogo}
    />
  );
}
