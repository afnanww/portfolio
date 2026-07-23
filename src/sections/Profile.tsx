import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Helper to get custom colored SVG logos for skills
function getSkillIcon(tag: string) {
  switch (tag.toLowerCase()) {
    case 'javascript':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path d="M18.8 19.5c-.7 0-1.2-.3-1.6-.7-.4-.4-.5-1-.5-1.7h1.7c0 .4.1.7.3.9.2.2.4.3.7.3.3 0 .5-.1.7-.3.1-.2.2-.4.2-.7 0-.3-.1-.5-.3-.7l-.6-.4c-.8-.4-1.3-.7-1.6-1.1s-.4-.9-.4-1.5c0-.7.2-1.2.7-1.6s1.1-.6 1.8-.6c.7 0 1.2.2 1.6.5s.6.8.6 1.4h-1.7c0-.3-.1-.5-.2-.7-.2-.2-.4-.2-.6-.2-.3 0-.5.1-.6.2-.1.1-.2.3-.2.5 0 .2.1.4.3.5l.7.4c.8.4 1.3.8 1.6 1.2s.4 1 .4 1.7c0 .8-.2 1.4-.7 1.8-.4.4-1.1.6-1.9.6zM13.6 19.5c-.8 0-1.4-.2-1.8-.7s-.6-1.1-.6-1.9v-5.2h1.8v5.1c0 .4.1.7.2.9.2.2.4.3.8.3.3 0 .6-.1.8-.3.2-.2.3-.5.3-.9v-5.1h1.8v5.1c0 .8-.2 1.4-.6 1.9-.4.5-1.1.8-2.7.8z" fill="#000000" />
        </svg>
      );
    case 'php':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="6" fill="#777BB4" />
          <path d="M8.5 9.5h-2l-.8 4.5h1.2l.2-1.2h.6c.7 0 1.1-.3 1.3-.8s.1-1.1-.5-2.5zm-.8 2.2h-.4l.2-1.1h.4c.4 0 .6.2.5.6 0 .3-.2.5-.7.5zM14.5 9.5h-2l-.8 4.5h1.2l.2-1.2h.6c.7 0 1.1-.3 1.3-.8s.1-1.1-.5-2.5zm-.8 2.2h-.4l.2-1.1h.4c.4 0 .6.2.5.6 0 .3-.2.5-.7.5zM19.5 9.5h-1.5l-.8 4.5h1.2v-1.8h.6c.6 0 1-.2 1.2-.7s.1-1-.7-2zm-.7 1.6h-.3v-.8h.3c.3 0 .4.1.4.4s-.1.4-.4.4z" fill="#FFFFFF" />
        </svg>
      );
    case 'java':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#E24E2E" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 10h10v5c0 2-2 4-5 4H9c-3 0-5-2-5-4v-5z" />
          <path d="M16 12h2a2 2 0 012 2v0a2 2 0 01-2 2h-2" />
          <path d="M9 3v3M13 3v3" />
        </svg>
      );
    case 'c#':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#178600" />
          <text x="5" y="17" fill="#FFFFFF" fontFamily="sans-serif" fontSize="14" fontWeight="bold">C#</text>
        </svg>
      );
    case 'python':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#3776AB" />
          <circle cx="9" cy="9" r="1.5" fill="#FFE873" />
          <circle cx="15" cy="15" r="1.5" fill="#3572A5" />
        </svg>
      );
    case 'html/css':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#E34F26" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3h16l-2 15-6 3-6-3L4 3z" />
          <path d="M9 8h6M9 12h5" />
        </svg>
      );
    case 'react':
      return (
        <svg className="w-3.5 h-3.5 shrink-0 animate-[spin_8s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" />
          <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        </svg>
      );
    case 'three.js':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      );
    case 'tailwind css':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.09c-1.89-3.04-5.06-4.09-9.5-3.15C1 3.25.1 4.5.1 6.09c0 4.2 4.41 7.35 11.9 14.7.75.75 1.95.75 2.7 0 7.49-7.35 11.9-10.5 11.9-14.7 0-1.59-.9-2.84-2.4-3.15-4.44-.94-7.61.11-9.5 3.15z" fill="#38BDF8" />
        </svg>
      );
    case 'gsap':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#88CE02" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'laravel':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3h14v2H4v14h12v2H2V3zm18 4h-8v2h6v8h-6v2h8V7z" fill="#FF2D20" />
        </svg>
      );
    case 'node.js':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 20,6.5 20,15.5 12,20 4,15.5 4,6.5" fill="#339933" />
        </svg>
      );
    case 'express.js':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
        </svg>
      );
    case 'codeigniter':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8 6 6 9 6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-3-2-6-6-10zm0 14c-2.2 0-4-1.8-4-4 0-1.8 1.5-3.5 4-5.5 2.5 2 4 3.7 4 5.5 0 2.2-1.8 4-4 4z" fill="#EE4326" />
        </svg>
      );
    case 'rest api':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#607D8B" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 9l3 3-3 3M16 15l-3-3 3-3" />
        </svg>
      );
    case 'mysql':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#00758F" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case 'postgresql':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#336791" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      );
    case 'oracle db':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#F80000" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="12" rx="10" ry="5" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'git':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#F05032" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="18" r="2.5" />
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <path d="M6 8.5V12a3 3 0 003 3h6a3 3 0 003-3V8.5" />
        </svg>
      );
    case 'github actions':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#2088FF" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" />
          <path d="M10 8l6 4-6 4V8z" />
        </svg>
      );
    case 'ci/cd':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case 'llm integration':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2.4 7.2L22 11.6l-7.6 2.4-2.4 7.2-2.4-7.2L2 11.6l7.6-2.4z" fill="#4285F4" />
        </svg>
      );
    case 'agile':
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.5 2v6h-6M21.34 8a10 10 0 10-.5 6" />
        </svg>
      );
    default:
      return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

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
      className="relative min-h-screen w-full bg-transparent text-[#111111] flex flex-col justify-center py-16 lg:py-24 px-6 lg:px-16 overflow-hidden select-none"
    >
      {/* Architectural Light Grid Background (Reference Match) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Architectural Line Art SVG (Reference Match) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 stroke-black fill-none" viewBox="0 0 1000 600">
        <path d="M 50,0 V 600 M 200,0 V 600 M 800,0 V 600 M 0,150 H 1000 M 0,450 H 1000" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 100,50 L 300,250 H 500 V 500" strokeWidth="0.8" />
      </svg>

      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col justify-between h-full">
        {/* Layer 1 (z-10): Crisp Black OVERVIEW Heading (Reference Match) */}
        <div className="relative z-10 w-full overflow-hidden">
          <h1
            ref={headingRef}
            className="font-display text-[13vw] lg:text-[11.5vw] leading-[0.82] tracking-tight uppercase text-[#0a0a0a] font-extrabold select-none whitespace-nowrap"
          >
            OVERVIEW
          </h1>
        </div>

        {/* TOP ROW: Bio & Portrait flat aligned with border bottom */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end mt-4 md:mt-6 border-b border-black/10 pb-2">
          {/* Left Column: Bio Paragraphs with Highlighted Keywords */}
          <div ref={textRef} className="lg:col-span-7 space-y-5 text-stone-700 font-sans text-sm md:text-base leading-relaxed max-w-xl relative z-20 pb-4">
            <p className="overview-paragraph">
              I'm a <strong className="text-black font-extrabold">Software Engineering graduate</strong> based in Malaysia, with hands-on experience building full-stack systems from internal business tools to production level web apps. I've worked across the stack, and I'm comfortable picking up whatever a project needs.
            </p>

            <p className="overview-paragraph">
              One of my proudest builds is <strong className="text-black font-extrabold underline decoration-black/40 decoration-2 underline-offset-4">ParcelKMPK</strong> a live parcel management system, independently designed and shipped after spotting a real operational gap for a client. Enthusiastic in solving problems that actually matter.
            </p>
          </div>

          {/* Right Column: Person Cutout aligned perfectly to the border bottom line (z-30) */}
          <div
            ref={portraitRef}
            className="lg:col-span-5 relative z-30 lg:-mt-24 flex justify-center lg:justify-start lg:pl-8 items-end"
          >
            <div className="relative w-full max-w-[280px] lg:max-w-[320px] flex flex-col justify-end">
              {/* Person Cutout Image - sits flat on the border line */}
              <img
                src="/images/portrait_cutout.png"
                alt="Afnan Wajdi"
                loading="lazy"
                decoding="async"
                data-circle-cursor="hey its mee"
                className="w-full h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] contrast-105 brightness-100 block cursor-pointer"
              />

              {/* Bottom Architectural Info Label */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded border border-black/15 text-right pointer-events-auto shadow-md">
                <span className="font-display text-base tracking-wide text-black block leading-tight">
                  MUHAMMAD AFNAN WAJDI
                </span>

              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Dedicated Technical Stack Section */}
        <div className="relative z-20 mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="font-jura text-xs uppercase tracking-[0.25em] font-bold text-black/80 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-black inline-block animate-pulse" />
              Technical Stack &amp; Capabilities
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'LANGUAGES', tags: ['JavaScript', 'PHP', 'Java', 'C#', 'Python', 'HTML/CSS'] },
              { label: 'FRONTEND', tags: ['React', 'Three.js', 'Tailwind CSS', 'GSAP'] },
              { label: 'BACKEND', tags: ['Laravel', 'Node.js', 'Express.js', 'CodeIgniter', 'REST API'] },
              { label: 'DATABASES', tags: ['MySQL', 'PostgreSQL', 'Oracle DB'] },
              { label: 'TOOLS', tags: ['Git', 'GitHub Actions', 'CI/CD', 'LLM Integration', 'Agile'] },
            ].map(({ label, tags }) => (
              <div key={label} className="group/cat p-4 rounded-xl border border-black/5 bg-white/30 hover:bg-white/80 hover:border-black/10 hover:shadow-xs transition-all duration-300 flex flex-col justify-start gap-3">
                <span className="font-jura text-[10px] font-bold tracking-[0.2em] text-stone-400 group-hover/cat:text-black transition-colors uppercase block">
                  {label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-sans text-[11px] font-medium px-2 py-1 rounded-md border border-stone-200 bg-white text-stone-800 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-black hover:text-white hover:border-black hover:-translate-y-0.5 transition-all duration-200 cursor-default select-none flex items-center gap-1.5"
                    >
                      {getSkillIcon(tag)}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
