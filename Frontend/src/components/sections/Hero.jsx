import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Orb from '../ui/Orb.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
 
  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(
      textRef.current.children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5,
      }
    );

    gsap.to('.hero-scroll-indicator', {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: 'power1.inOut',
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] md:w-[90%] md:h-[110%] opacity-80">
          <Orb
            hue={0}
            hoverIntensity={0.6}
            rotateOnHover={true}
            forceHoverState={false}
            backgroundColor="#ffffff"
          />
        </div>
      </div>

      <div ref={textRef} className="max-w-4xl text-center z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm font-semibold mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          GLOBAL TRADE OS v2.4
        </motion.div>

        <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[0.9]">
          The Intelligence <br />
          <span className="text-accent italic">Engine</span> for Global Trade.
        </h1>

        <p className="text-xl md:text-2xl text-black/60 mb-12 max-w-2xl mx-auto leading-relaxed">
          Blinkus empowers global traders with AI trade agents, real-time market
          discovery, and deep risk intelligence to navigate the modern supply chain.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="btn-primary text-lg px-8 py-4 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Chat Now <ArrowRight size={20} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border border-black/10 rounded-full font-medium hover:bg-black/5 transition-colors w-full sm:w-auto text-center"
          >
            View Live Market
          </Link>
        </div>
      </div>
    </section>
  );
}
