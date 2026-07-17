import LegalDocumentLayout from './LegalDocumentLayout';
import { LAST_UPDATED, PRIVACY_SECTIONS } from './privacyPolicyData';

export default function PrivacyPolicy() {
  return (
    <LegalDocumentLayout
      eyebrow="Legal"
      title="Privacy"
      accentTitle="Policy."
      lastUpdated={LAST_UPDATED}
      sections={PRIVACY_SECTIONS}
      acknowledgment="By accessing or using Blinkus services, you acknowledge that you have read and understood this Privacy Policy."
    />
  );
}
