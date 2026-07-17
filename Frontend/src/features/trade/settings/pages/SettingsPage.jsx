import { useState } from 'react';
import { motion } from 'motion/react';
import SettingsSidebar from '../components/SettingsSidebar';
import GeneralSection  from '../sections/GeneralSection';
import AccountSection  from '../sections/AccountSection';
import PrivacySection  from '../sections/PrivacySection';
import BillingSection  from '../sections/BillingSection';
import SupportSection  from '../sections/SupportSection';

const SECTIONS = {
  general: GeneralSection,
  account: AccountSection,
  privacy: PrivacySection,
  billing: BillingSection,
  support: SupportSection,
};

export default function SettingsPage() {
  const [active, setActive] = useState('general');

  const ActiveSection = SECTIONS[active] ?? GeneralSection;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-display font-bold" style={{ color: '#0f172a' }}>Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
            Manage your account, subscription, and preferences
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <SettingsSidebar active={active} onChange={(id) => setActive(id)} />

          <motion.div
            key={active}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            <ActiveSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
