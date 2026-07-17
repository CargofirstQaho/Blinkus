import LegalDocumentLayout from './LegalDocumentLayout';
import { LAST_UPDATED, TERMS_SECTIONS } from './termsConditionsData';

export default function TermsConditions() {
  return (
    <LegalDocumentLayout
      eyebrow="Legal"
      title="Terms &"
      accentTitle="Conditions."
      lastUpdated={LAST_UPDATED}
      sections={TERMS_SECTIONS}
      acknowledgment="By creating an account or using Blinkus services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions."
    />
  );
}
