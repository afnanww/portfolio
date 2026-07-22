import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Profile() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading character reveal
      if (headingRef.current) {
        const text = headingRef.current.innerText;
        headingRef.current.innerHTML = text
          .split('')
          .map(
            (char) =>
              `<span class="inline-block transform translate-y-full opacity-0 transition-transform">${char === ' ' ? '&nbsp;' : char}</span>`
          )
          .join('');

        const chars = headingRef.current.querySelectorAll('span');
        gsap.to(chars, {
          y: '0%',
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      // Left column bio paragraphs stagger
      const paragraphs = textRef.current?.querySelectorAll('.overview-paragraph');
      if (paragraphs && paragraphs.length) {
        gsap.fromTo(
          paragraphs,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Portrait cutout float & entrance
      if (portraitRef.current) {
        gsap.fromTo(
          portraitRef.current,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen h-screen w-full bg-transparent text-[#111111] flex flex-col justify-center py-12 lg:py-16 px-6 lg:px-16 overflow-hidden select-none"
    >
      {/* Architectural Light Grid Background (Reference Match) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Architectural Line Art SVG (Reference Match) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-black fill-none" viewBox="0 0 1000 600">
        <path d="M 50,0 V 600 M 200,0 V 600 M 800,0 V 600 M 0,150 H 1000 M 0,450 H 1000" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 100,50 L 300,250 H 500 V 500" strokeWidth="0.8" />
      </svg>

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Layer 1 (z-10): Crisp Black OVERVIEW Heading (Reference Match) */}
        <div className="relative z-10 w-full overflow-hidden">
          <h1
            ref={headingRef}
            className="font-display text-[13vw] lg:text-[11.5vw] leading-[0.82] tracking-tight uppercase text-[#0a0a0a] font-extrabold select-none whitespace-nowrap"
          >
            OVERVIEW
          </h1>
        </div>

        {/* Content Container (Layer 2 z-20 for text, z-30 for portrait overlapping OVERVIEW) */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start mt-4 md:mt-6">
          {/* Left Column: Bio Paragraphs with Highlighted Keywords (Reference Match) */}
          <div ref={textRef} className="lg:col-span-7 space-y-4 text-stone-800 font-sans text-sm md:text-base lg:text-lg leading-relaxed max-w-xl relative z-20">
            <p className="overview-paragraph">
              I'm a <strong className="text-black font-extrabold underline decoration-black/60 decoration-2 underline-offset-4">Kuala Lumpur-based frontend engineer</strong> with experience across interactive WebGL, 3D browser scenes, and modern web application architecture. I work across all stages of frontend design and development, from initial concept to production.
            </p>

            <p className="overview-paragraph">
              During my engineering journey at <strong className="text-black font-extrabold">Asia Pacific University</strong>, I completed projects specializing in <strong className="text-black font-extrabold">Three.js, React, and GSAP animation engines</strong>, contributing to <strong className="text-black font-extrabold">interactive brand showcases</strong> and high-performance browser interfaces.
            </p>

            <p className="overview-paragraph">
              I'm proficient in <strong className="text-black font-extrabold">React, TypeScript, Three.js, WebGL, TailwindCSS, and Node.js</strong>, regularly creating custom shaders, canvas graphics, and fluid micro-interactions as part of my workflow.
            </p>

            <p className="overview-paragraph pt-1">
              I'm currently looking for a <strong className="text-black font-extrabold underline decoration-black/60 decoration-2 underline-offset-4">frontend / WebGL role</strong> in a studio where visual craft, interactive quality, and technical detail are taken seriously.
            </p>

            {/* Quick Action Button */}
            <div className="overview-paragraph pt-2 flex items-center gap-6">
              <a
                href="#work"
                className="group inline-flex items-center gap-3 px-7 py-3 bg-black text-white font-medium text-xs md:text-sm tracking-wide rounded-full hover:bg-stone-800 transition-colors duration-300 shadow-xl"
              >
                View Works
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column: Person Cutout Overlapping OVERVIEW (z-30) */}
          <div
            ref={portraitRef}
            className="lg:col-span-5 relative z-30 lg:-mt-24 pointer-events-none flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[320px] lg:max-w-[360px]">
              {/* Person Cutout Image - Overlaps OVERVIEW title */}
              <img
                src="/images/portrait_cutout.png"
                alt="Kaelen Vance"
                className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.25)] contrast-105 brightness-100"
              />

              {/* Bottom Architectural Info Label */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded border border-black/15 text-right pointer-events-auto shadow-md">
                <span className="font-display text-base tracking-wide text-black block leading-tight">
                  KAELEN VANCE
                </span>
                <span className="font-jura text-[9px] tracking-[0.2em] text-stone-600 uppercase block font-bold">
                  Frontend & WebGL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
