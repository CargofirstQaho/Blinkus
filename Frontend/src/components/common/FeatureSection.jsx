import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/src/lib/utils.js';

gsap.registerPlugin(ScrollTrigger);

export default function FeatureSection({
  id,
  title,
  tagline,
  description,
  children,
  reversed,
  className,
  visual
}) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current.children, {
        opacity: 0,
        x: reversed ? 50 : -50,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

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
  }, [reversed]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn(
        'py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-12 md:gap-20 items-center',
          reversed ? 'md:flex-row-reverse' : 'md:flex-row'
        )}
      >
        <div ref={contentRef} className="flex-1 space-y-6">
          <span className="text-accent font-bold tracking-[0.2em] text-xs uppercase">
            {tagline}
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-black/60 leading-relaxed max-w-xl">
            {description}
          </p>
          <div className="pt-4">{children}</div>
        </div>

        <div ref={visualRef} className="flex-1 w-full flex justify-center items-center">
          {visual || (
            <div className="w-full aspect-square bg-black/5 rounded-3xl animate-pulse" />
          )}
        </div>
      </div>
    </section>
  );
}
