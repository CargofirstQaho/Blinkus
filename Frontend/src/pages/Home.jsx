import Hero from '../components/sections/Hero';
import AiAgent from '../components/sections/AiAgent';
import TradeAnalytics from '../components/sections/TradeAnalytics';
import Discovery from '../components/sections/Discovery';
import SupplyChainAgents from '../components/sections/SupplyChainAgents';
import LegalAndPerformance from '../components/sections/LegalAndPerformance';
import Operations from '../components/sections/Operations';
import CTA from '../components/sections/CTA';
import HowItWorksVideo from '../components/sections/HowItWorksVideo';

export default function Home() {
  return (
    <>
      <Hero />
      <AiAgent />
      <HowItWorksVideo/>
      <TradeAnalytics />
      <Discovery />
      <SupplyChainAgents />
      <LegalAndPerformance />
      <Operations />
      <CTA />
    </>
  );
}
