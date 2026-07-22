import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation - word by word stagger
      const words = headingRef.current?.querySelectorAll('.word');
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 80, rotateX: -45 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Body text animation
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bodyRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Decorative line animation
      gsap.fromTo(
        decorRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: decorRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word inline-block mr-[0.25em]" style={{ opacity: 0 }}>
        {word}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen w-full flex items-center justify-center z-30 py-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-transparent pointer-events-none" />

      <div className="relative text-center px-6 max-w-6xl mx-auto">
        {/* Decorative top element */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4FF90]/50" />
          <span className="font-jura text-xs tracking-[0.4em] text-[#D4FF90]/60 uppercase">
            Philosophy
          </span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4FF90]/50" />
        </div>

        {/* Main Heading */}
        <h2
          ref={headingRef}
          className="font-display text-[12vw] md:text-[10vw] lg:text-[8vw] leading-[0.95] mb-12"
          style={{ perspective: '500px' }}
        >
          <span className="block text-white">
            {renderWords('DRIVEN BY')}
          </span>
          <span
            className="block"
            style={{
              background: 'linear-gradient(135deg, #D4FF90 0%, #a8cc70 50%, #D4FF90 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {renderWords('PASSION')}
          </span>
        </h2>

        {/* Decorative line */}
        <div
          ref={decorRef}
          className="w-32 h-px bg-gradient-to-r from-[#D4FF90] to-transparent mx-auto mb-12 origin-left"
        />

        {/* Body Text */}
        <p
          ref={bodyRef}
          className="text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light"
          style={{ opacity: 0 }}
        >
          Merging the precision of code with the fluidity of design.
          I don't just build websites — I engineer{' '}
          <span className="text-white font-medium">digital worlds</span>{' '}
          that captivate, inspire, and push the boundaries of
          what's possible in the browser.
        </p>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: '7+', label: 'Years Experience' },
            { value: '50+', label: 'Projects Delivered' },
            { value: '30+', label: 'Happy Clients' },
            { value: '12', label: 'Awards Won' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div
                className="font-display text-4xl md:text-5xl mb-2"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #D4FF90 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div className="font-jura text-xs tracking-[0.2em] text-gray-500 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
