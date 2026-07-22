import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Title reveal animation
      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );

      // Tagline reveal
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full min-h-screen h-screen bg-[#090a0c] text-white flex items-center justify-center overflow-hidden z-10 select-none"
    >
      {/* Full Screen Grid Backdrop (Junni Screen Cover Grid - No 3D Flips) */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none border-b border-white/10">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="border-r border-b border-white/[0.06] relative"
          >
            {/* Subtle grid intersection dots */}
            <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      {/* Main Center Title & Tagline (Junni Style) */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto pointer-events-none flex flex-col items-center">
        {/* Main Title */}
        <div ref={titleRef} className="inline-block text-left" style={{ opacity: 0 }}>
          <p className="font-jura text-base md:text-2xl tracking-[0.2em] text-[#D4FF90] font-medium mb-1 text-left pl-1">
            Hi, I'm
          </p>
          <h1 className="font-display text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-tight text-white font-bold drop-shadow-2xl">
            AFNAN WAJDI
          </h1>
        </div>

        {/* Subtitle Tagline (Junni Slogan: "Freely, Uniquely.") */}
        <div ref={taglineRef} className="mt-4 md:mt-6 space-y-3" style={{ opacity: 0 }}>
          <p className="font-jura text-lg md:text-2xl tracking-[0.2em] text-[#D4FF90] font-medium">
            自由に、ユニークに。
          </p>
          <p className="font-jura text-xs md:text-sm tracking-[0.35em] text-gray-400 uppercase">
            Creative Developer & Designer
          </p>
        </div>
      </div>
    </section>
  );
}
