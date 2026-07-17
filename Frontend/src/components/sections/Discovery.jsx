// import { ShieldCheck, Star, ExternalLink, CheckCircle2 } from 'lucide-react';
// import FeatureSection from '../common/FeatureSection.jsx';
// import { motion } from 'motion/react';

// const COMPANIES = [
//   { name: 'AgroSource Ltd',  country: 'Vietnam',  rating: 4.8, type: 'Seller' },
//   { name: 'Global Grain Co', country: 'USA',       rating: 4.9, type: 'Seller' },
//   { name: 'EuroTrade Port',  country: 'Germany',   rating: 4.6, type: 'Buyer'  },
// ];

// export default function Discovery() {
//   return (
//     <FeatureSection
//       id="discovery"
//       tagline="Verified Discovery"
//       title="Global Intelligence Marketplace."
//       description="Discover verified buyers and sellers worldwide. Our system goes beyond contact lists, providing deep credibility checks integrated with global credit agencies."
//       visual={
//         <div className="w-full relative py-12">
//           <div className="space-y-4">
//             {COMPANIES.map((company, i) => (
//               <motion.div
//                 key={company.name}
//                 initial={{ opacity: 0, x: 20 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 transition={{ delay: i * 0.2 }}
//                 className="glass-card bg-white hover:border-accent/40 transition-all cursor-pointer group flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center font-display font-bold text-lg">
//                     {company.name[0]}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <h4 className="font-bold">{company.name}</h4>
//                       <ShieldCheck size={14} className="text-accent" />
//                     </div>
//                     <p className="text-xs text-black/40 font-medium uppercase tracking-wider">
//                       {company.country} • {company.type}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right flex items-center gap-4">
//                   <div className="hidden sm:block">
//                     <div className="flex items-center gap-1 text-accent">
//                       <Star size={14} fill="currentColor" />
//                       <span className="text-sm font-bold">{company.rating}</span>
//                     </div>
//                     <div className="text-[10px] font-bold text-black/30">SCORE</div>
//                   </div>
//                   <ExternalLink
//                     size={18}
//                     className="text-black/20 group-hover:text-accent transition-colors"
//                   />
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <motion.div
//             animate={{ scale: [1, 1.05, 1] }}
//             transition={{ duration: 3, repeat: Infinity }}
//             className="absolute -bottom-4 -left-4 glass-card bg-white border-2 border-accent/20 p-4 shadow-2xl flex items-center gap-3"
//           >
//             <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
//               <ShieldCheck size={20} />
//             </div>
//             <div>
//               <div className="text-[10px] font-bold text-black/40">AI TRUST SCORING</div>
//               <div className="text-xs font-bold">6 GLOBAL AGENCIES VERIFIED</div>
//             </div>
//           </motion.div>
//         </div>
//       }
//     >
//       <div className="space-y-4">
//         {[
//           'Cross-border financial verification',
//           'KYC & AML compliance automation',
//           'Trade history & fulfillment metrics',
//           'Real-time credit limit monitoring',
//         ].map((text) => (
//           <div key={text} className="flex items-center gap-3">
//             <CheckCircle2 size={18} className="text-green-500" />
//             <span className="font-medium text-black/80">{text}</span>
//           </div>
//         ))}
//       </div>
//     </FeatureSection>
//   );
// }









import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Shield,
  CheckCircle2,
  Database,
  Lock,
  Globe,
  Zap,
  Activity,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const AGENCIES = [
  { id: 'ECGC', name: 'ECGC Limited',     icon: Shield,   score: 'AA+', description: 'Export Credit Guarantee', color: '#6495ED' },
  { id: 'EQF',  name: 'Equifax',          icon: Activity, score: '820', description: 'Credit Bureau Rating',    color: '#818CF8' },
  { id: 'D&B',  name: 'Dun & Bradstreet', icon: Database, score: '5A1', description: 'Business Trust Index',   color: '#60A5FA' },
  { id: 'COF',  name: 'Coface',           icon: Globe,    score: 'A2',  description: 'Risk Assessment',        color: '#34D399' },
  { id: 'ATR',  name: 'Atradius',         icon: Lock,     score: 'A+',  description: 'Credit Insurance',       color: '#A78BFA' },
  { id: 'EXP',  name: 'Experian',         icon: Zap,      score: '845', description: 'Consumer Reliability',   color: '#F472B6' },
];

const TRUST_CHECKS = [
  'Cross-border financial verification',
  'KYC & AML compliance automation',
  'Trade history & fulfillment metrics',
  'Real-time credit limit monitoring',
];

/* ═══════════════════════════════════════════
   BACKGROUND ATMOSPHERE
═══════════════════════════════════════════ */
function BackgroundAtmosphere() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none rounded-3xl">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-[#6495ED]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[60%] h-[60%] bg-blue-100/30 blur-[150px] rounded-full" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORBITAL PATH RING
═══════════════════════════════════════════ */
function OrbitalPath({ radius, speed, delay = 0 }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-dashed border-slate-200 rounded-full pointer-events-none"
      style={{
        width:  radius * 2,
        height: radius * 2,
        boxShadow: 'inset 0 0 40px rgba(100,149,237,0.02)',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear', delay }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#6495ED] rounded-full shadow-[0_0_8px_#6495ED] opacity-40" />
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CENTER AI ORB
═══════════════════════════════════════════ */
function CenterAI() {
  return (
    <div className="relative z-50 flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
      {/* Aura */}
      <div className="absolute inset-0 bg-[#6495ED]/10 rounded-full blur-[30px] animate-pulse" />

      {/* Rotating light sweep */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border border-slate-200/50"
        style={{ background: 'conic-gradient(from 0deg, transparent 70%, rgba(100,149,237,0.2) 100%)' }}
      />

      {/* Holographic shell */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden shadow-[0_20px_50px_rgba(100,149,237,0.15)]">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#6495ED]/5 to-transparent" />

        {/* Scanning line */}
        <motion.div
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-x-0 h-px bg-[#6495ED] shadow-[0_0_15px_#6495ED] opacity-30 z-10"
        />

        <div className="relative z-20 text-center">
          <span className="text-[7px] sm:text-[8px] font-mono font-bold tracking-[0.2em] text-[#6495ED] uppercase mb-1 block">
            Score
          </span>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-b from-slate-900 to-slate-600 bg-clip-text text-transparent tracking-tighter">
              98.4
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#6495ED]">/100</span>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none" />
      </div>

      {/* Decorative rings */}
      <div className="absolute inset-0 border border-slate-100 rounded-full scale-110" />
      <div className="absolute inset-0 border border-slate-100 rounded-full scale-125 opacity-50" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   AGENCY CARD (orbiting)
═══════════════════════════════════════════ */
function AgencyCard({ agency, index, orbitProgress, totalAgencies, isMobile }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const angle =
    (index / totalAgencies) * Math.PI * 2 + orbitProgress * Math.PI * 2;

  const radiusX = isMobile ? 110 : 190;
  const radiusZ = isMobile ? 35  : 65;
  const radiusY = isMobile ? 8   : 16;

  const x = Math.cos(angle) * radiusX;
  const z = Math.sin(angle) * radiusZ;
  const y = Math.sin(angle) * radiusY;

  const normalizedZ = (z + radiusZ) / (2 * radiusZ);
  const scale  = 0.72 + normalizedZ * 0.28;
  const zIndex = Math.round(normalizedZ * 100);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - r.left) / r.width  - 0.5,
      y: (e.clientY - r.top)  / r.height - 0.5,
    });
  };

  const IconComponent = agency.icon;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top:  '50%',
        transform: `translate(-50%,-50%) translate3d(${x}px,${y}px,0) scale(${scale})`,
        zIndex,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        className="pointer-events-auto cursor-pointer group"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{
            rotateY: mousePos.x * 30,
            rotateX: -mousePos.y * 30,
            y: [0, -10, 0],
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 },
            rotateX: { type: 'spring', stiffness: 100 },
            rotateY: { type: 'spring', stiffness: 100 },
          }}
          className="relative w-28 sm:w-32 md:w-36 p-3 rounded-xl bg-white border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_20px_40px_rgba(100,149,237,0.12)] transition-shadow"
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-30 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#6495ED]/10 border border-[#6495ED]/20 flex items-center justify-center p-1.5 group-hover:bg-[#6495ED]/20 transition-colors">
                <IconComponent className="w-full h-full text-[#6495ED]" />
              </div>
              <div className="text-right">
                <div className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  {agency.score}
                </div>
                <div className="text-[7px] font-mono font-bold text-[#6495ED] tracking-widest uppercase opacity-80">
                  Rating
                </div>
              </div>
            </div>

            <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 mb-0.5">{agency.id}</h3>
            <p className="text-[9px] sm:text-[10px] text-slate-500 mb-2 leading-tight line-clamp-1">
              {agency.description}
            </p>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className="w-1 h-1 rounded-full bg-[#6495ED] shadow-[0_0_3px_#6495ED]"
                  />
                ))}
              </div>
              <div className="text-[7px] font-mono font-bold text-emerald-600">ACTIVE</div>
            </div>
          </div>

          {/* Bottom highlight on hover */}
          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#6495ED] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </div>
  );
}


function CredibilityOrbit() {
  const wrapRef = useRef(null);
  const [orbitProgress, setOrbitProgress] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start end', 'end start'],
  });
  const zoom         = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);
  const rotationBase = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    let rafId;
    const baseSpeed = 0.0004;
    const tick = () => {
      const scrollInfluence = rotationBase.get() * 0.002;
      setOrbitProgress((p) => (p + baseSpeed + scrollInfluence) % 1);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rotationBase]);

  const handleMouseMove = (e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseParallax({
      x: (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2),
      y: (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2),
    });
  };

  const orbitRings = isMobile ? [100, 140, 170] : [150, 200, 250];

  return (
    <div
      ref={wrapRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseParallax({ x: 0, y: 0 })}
      className="relative w-full h-[340px] sm:h-[420px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-3xl"
      style={{ perspective: '2000px' }}
    >
      <BackgroundAtmosphere />

      <div className="absolute top-4 right-4 hidden sm:flex flex-col items-end gap-1.5 z-50">
        <div className="text-[9px] font-mono font-bold text-[#6495ED] uppercase tracking-widest opacity-50">
          System Active
        </div>
        <div className="w-14 h-px bg-slate-200 relative overflow-hidden">
          <motion.div
            animate={{ left: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 w-1/2 h-full bg-[#6495ED]"
          />
        </div>
      </div>

      <motion.div
        style={{
          scale:      zoom,
          rotateX:    mouseParallax.y * -8,
          rotateY:    mouseParallax.x *  8,
          translateX: mouseParallax.x * -20,
          translateY: mouseParallax.y * -20,
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <OrbitalPath radius={orbitRings[0]} speed={40} />
          <OrbitalPath radius={orbitRings[1]} speed={60} delay={5} />
          <OrbitalPath radius={orbitRings[2]} speed={90} delay={10} />
        </div>

        <CenterAI />

        <div className="absolute inset-0 flex items-center justify-center">
          {AGENCIES.map((agency, i) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              index={i}
              orbitProgress={orbitProgress}
              totalAgencies={AGENCIES.length}
              isMobile={isMobile}
            />
          ))}
        </div>

        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              x: [Math.random() * 600 - 300, Math.random() * 600 - 300],
              y: [Math.random() * 400 - 200, Math.random() * 400 - 200],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute w-1 h-1 bg-[#6495ED] rounded-full blur-[1px]"
          />
        ))}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[#6495ED]/5 to-transparent rotate-45 -translate-y-1/2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 sm:gap-6 opacity-40 hover:opacity-70 transition-opacity z-50 cursor-crosshair"
      >
        {['AES-256 Encrypted', 'SOC2 Type II', 'ISO 27001'].map((label) => (
          <div
            key={label}
            className="text-[8px] sm:text-[9px] font-mono font-bold text-slate-900 tracking-[0.3em] uppercase whitespace-nowrap"
          >
            {label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}


export default function Discovery() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current?.children) {
        gsap.from(Array.from(contentRef.current.children), {
          opacity: 0,
          x: -50,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });
      }
      if (visualRef.current) {
        gsap.from(visualRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="discovery"
      ref={sectionRef}
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      <div className="flex flex-col gap-12 md:gap-16 lg:gap-20 items-center md:flex-row">

        <div ref={contentRef} className="flex-1 space-y-6 w-full">
          <span className="text-[#6495ED] font-bold tracking-[0.2em] text-xs uppercase">
            Verified Discovery
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
            Global Intelligence Marketplace.
          </h2>

          <p className="text-lg md:text-xl text-black/60 leading-relaxed max-w-xl">
            Discover verified buyers and sellers worldwide. Our system goes beyond contact lists,
            providing deep credibility checks integrated with global credit agencies.
          </p>

          <div className="pt-2 space-y-4">
            {TRUST_CHECKS.map((text) => (
              <div key={text} className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <span className="font-medium text-black/80">{text}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-wrap gap-6 sm:gap-10">
            <div>
              <div className="text-2xl font-bold text-[#6495ED]">6</div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-0.5">
                Global Agencies
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#6495ED]">98.4</div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-0.5">
                AI Trust Score
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#6495ED]">Real‑time</div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mt-0.5">
                Sync Speed
              </div>
            </div>
          </div>
        </div>

        <div ref={visualRef} className="flex-1 w-full">
          <CredibilityOrbit />
        </div>

      </div>
    </section>
  );
}