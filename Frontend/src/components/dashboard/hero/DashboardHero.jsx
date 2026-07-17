import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../../redux/slices/authSlice';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroStats from './HeroStats';

export default function DashboardHero() {
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const firstName = user?.name?.split(' ')[0] || 'Trader';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl mb-8"
      style={{ minHeight: '220px' }}
    >
      <HeroBackground />

      <div className="relative z-10 p-6 sm:p-8 md:p-9 flex flex-col lg:flex-row lg:items-start gap-7 lg:gap-10">
        <HeroContent
          greeting={greeting}
          firstName={firstName}
          onChat={() => navigate('/chat/new')}
        />
        <HeroStats />
      </div>
    </motion.div>
  );
}
