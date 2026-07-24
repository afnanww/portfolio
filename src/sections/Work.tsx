import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Download } from 'lucide-react';

interface Project {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: string;
  role: string;
  description: string;
  image: string;
  year: string;
  tags: string[];
  link: string;
  isComingSoon?: boolean;
  readmeUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
}

const projects: Project[] = [
  {
    id: 'ParcelKMPK',
    num: '01',
    title: 'ParcelKMPK',
    subtitle: 'Parcel Tracking Web App',
    category: 'Systems Development',
    role: 'Full-Stack',
    description:
      'Tracking web app, and parcel inbound outbound handling management system for KMPK with private tendor',
    image: '/images/project/project1/parcelkmpk.webp',
    year: '2025',
    tags: ['React', 'HTML/CSS', 'Laravel', 'PHP', 'JavaScript', 'MySQL'],
    link: 'https://parcelkmpk.najja.my',
    readmeUrl: '/docs/ParcelKMPK_README.md',
    pdfUrl: '/docs/ParcelKMPK_Specification.pdf',
  },
  {
    id: 'chatbotmanufacture',
    num: '02',
    title: 'Chatbot Manufacture',
    subtitle: 'AI Support Agent for Manufacturing Company',
    category: 'Personal Project',
    role: 'AI Engineer',
    description:
      'AI chatbot that can answer questions about company products and services, and can support customer support. Highlighting the ability to Book Meeting and Purchase Order through Chatbot',
    image: '/images/project/project2/askk-1.webp',
    year: '2026',
    tags: ['Blade', 'LLM', 'JavaScript', 'Gemini', 'Google SheetsAPI', 'Google CalendarAPI', 'PostgreSQL'],
    link: 'https://manufacturechatbotdemo.afnanw.my/',
    readmeUrl: '/docs/chatbotmanufacture_README.md',
    pdfUrl: '/docs/chatbotmanufacture_CaseStudy.pdf',
  },
  {
    id: 'gridshotto',
    num: '03',
    title: 'GRIDSHOTTO',
    subtitle: 'Interactive Aim Trainer Web Experience',
    category: 'Personal Project',
    role: 'Creative Developer',
    description:
      'Browser-based 3D aim training game inspired by Aim Lab Gridshot, featuring custom crosshair themes, real-time FPS counter, and precision hit audio.',
    image: '/images/project/project3/gridshot-1.webp',
    year: '2026',
    tags: ['Three.js', 'WebGL', 'JavaScript', 'Web Audio API', 'HTML5'],
    link: 'https://afnanww.github.io/gridshotto/',
    readmeUrl: '/docs/gridshotto_README.md',
    pdfUrl: '/docs/gridshotto_Architecture.pdf',
    videoUrl: '/images/project/project3/gridshot-preview.webm',
  },
  {
    id: 'andmore',
    num: '04',
    title: 'and more...',
    subtitle: 'MORE PROJECTS COMING SOON',
    category: 'Upcoming',
    role: 'Developer',
    description: 'More creative projects, WebGL experiments, and full-stack systems currently under development.',
    image: '',
    year: '2026',
    tags: ['Upcoming'],
    link: '#',
    isComingSoon: true,
  },
];

const parseMarkdownToHtml = (md: string): string => {
  if (!md) return '';

  let html = md;
  // Escape HTML tags to prevent XSS/rendering issues
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="font-jura text-sm md:text-base font-bold text-white mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="font-jura text-base md:text-lg font-bold text-white mt-6 mb-3 border-b border-white/10 pb-1">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="font-display text-xl md:text-2xl font-black text-[#D4FF90] mt-8 mb-4 border-b border-[#D4FF90]/30 pb-2 uppercase tracking-widest">$1</h1>');

  // Code Blocks
  html = html.replace(/```([\s\S]*?)```/gm, '<pre class="bg-black/80 border border-white/10 p-3 rounded-sm my-4 overflow-x-auto font-mono text-[11px] text-[#D4FF90] leading-relaxed">$1</pre>');

  // Inline Code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#D4FF90]">$1</code>');

  // Bold Text
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-black text-white">$1</strong>');

  // List Items
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc text-gray-300 my-1.5 text-xs md:text-sm">$1</li>');

  // Paragraphs
  return html
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<ol')
      ) {
        return trimmed;
      }
      return `<p class="my-2.5 text-xs md:text-sm text-gray-300 leading-relaxed">${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
};

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Document Reader Modal states
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [activeDocProject, setActiveDocProject] = useState<Project | null>(null);
  const [activeDocTab, setActiveDocTab] = useState<'readme' | 'pdf'>('readme');
  const [readmeContent, setReadmeContent] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  const currentProject = projects[activeIndex];
  const touchStartX = useRef<number | null>(null);
  const readmeScrollRef = useRef<HTMLDivElement>(null);

  // Next / Prev slide handlers
  const handleNext = () => {
    setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  // Fetch README markdown when activeDocProject changes
  useEffect(() => {
    if (!activeDocProject?.readmeUrl) {
      return;
    }

    fetch(activeDocProject.readmeUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load README file');
        return res.text();
      })
      .then((text) => {
        setReadmeContent(parseMarkdownToHtml(text));
        setLoadingReadme(false);
      })
      .catch((err) => {
        console.error(err);
        setReadmeContent('<p class="text-red-400 font-mono text-sm">Failed to load project README documentation.</p>');
        setLoadingReadme(false);
      });
  }, [activeDocProject]);

  // Bind Escape key to close the document modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (docModalOpen) {
        if (e.key === 'Escape') {
          setDocModalOpen(false);
          setActiveDocProject(null);
          setReadmeContent('');
        }
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [docModalOpen]);

  // Scroll to top of README on open/tab change
  useEffect(() => {
    if (docModalOpen && readmeScrollRef.current) {
      readmeScrollRef.current.scrollTop = 0;
    }
  }, [docModalOpen, activeDocTab, activeDocProject]);

  // Keyboard arrow & scroll navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (docModalOpen) return;
      if (selectedProject) {
        if (e.key === 'Escape') setSelectedProject(null);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, docModalOpen]);

  // Touch Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Animate slide change with GSAP
  const imageCardRef = useRef<HTMLDivElement>(null);
  const { isComingSoon } = currentProject;
  useEffect(() => {
    if (imageCardRef.current && !selectedProject) {
      gsap.fromTo(
        imageCardRef.current,
        { scale: 0.96, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );

      // Typography reveal for "and more..." slide
      if (isComingSoon) {
        const chars = imageCardRef.current.querySelectorAll('.coming-soon-char');
        const sub = imageCardRef.current.querySelector('.coming-soon-sub');

        gsap.fromTo(
          chars,
          { opacity: 0, y: -40, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: 0.04,
            delay: 0.15,
          }
        );

        if (sub) {
          gsap.fromTo(
            sub,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.7 }
          );
        }
      }
    }
  }, [activeIndex, selectedProject, isComingSoon]);

  return (
    <section
      ref={sectionRef}
      id="work"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden flex flex-col justify-between p-6 md:p-12 select-none"
    >
      {/* Background SVG Geometric Tile Pattern (Visible Crisp White Pattern) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="unshift-pattern-dark" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="80" height="80" fill="none" stroke="#ffffff" strokeWidth="1.2" />
            <polygon points="40,0 80,40 40,80 0,40" fill="none" stroke="#ffffff" strokeWidth="1.2" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="#ffffff" strokeWidth="1.2" />
            <rect x="30" y="30" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#unshift-pattern-dark)" />
      </svg>

      {/* SVG Clip Path for Unshift Warped / Wavy Image Card Edge */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="unshift-wavy-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.02,0.04 C 0.25,-0.02 0.75,0.05 0.98,0.01 C 1.01,0.25 0.97,0.75 0.99,0.97 C 0.75,1.03 0.25,0.96 0.01,0.98 C -0.01,0.75 0.03,0.25 0.02,0.04 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── MODE 1: Full-Screen Carousel View (Dark Theme) ── */}
      {!selectedProject && (
        <>
          {/* Central Main Stage Container */}
          <div className="relative z-10 flex-1 my-auto flex flex-col items-center justify-center py-2 w-full max-w-7xl mx-auto">
            {/* WORKS Section Title Header — Placed Tightly Above Carousel */}
            <div className="flex items-center gap-3 mb-3 md:mb-5">
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-wider text-white uppercase leading-none">
                WORKS
              </h2>
            </div>

            {/* Project Image Card */}
            {currentProject.isComingSoon ? (
              <div
                ref={imageCardRef}
                className="flex flex-col items-center justify-center py-20 md:py-32 text-center cursor-default select-none pointer-events-none"
              >
                <h3 className="coming-soon-title font-sans font-black text-6xl md:text-8xl lg:text-[9rem] text-white tracking-tight lowercase leading-none drop-shadow-[0_10px_35px_rgba(212,255,144,0.18)]">
                  {'and more...'.split('').map((char, i) => (
                    <span
                      key={i}
                      className="coming-soon-char inline-block"
                      style={{ opacity: 0, transform: 'translateY(-40px)' }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h3>
                <p
                  className="coming-soon-sub font-jura text-xs md:text-sm font-black tracking-[0.3em] text-[#D4FF90] uppercase mt-6"
                  style={{ opacity: 0 }}
                >
                  MORE PROJECTS COMING SOON
                </p>
              </div>
            ) : (
              <div
                ref={imageCardRef}
                onClick={() => setSelectedProject(currentProject)}
                className="relative w-full max-w-5xl aspect-[16/10] md:aspect-[16/9] cursor-pointer group shadow-2xl transition-transform duration-300 hover:scale-[1.01]"
                data-circle-cursor="view project"
              >
                {/* Image Container */}
                <div
                  className="w-full h-full bg-[#0d0d0d] overflow-hidden relative border border-white/10"
                >
                  {currentProject.videoUrl ? (
                    <video
                      src={currentProject.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-105 transition-all duration-700 transform group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover brightness-90 group-hover:brightness-105 transition-all duration-700 transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                </div>

                {/* Inverted Light Badge Titles (Crisp Contrast on Dark Theme) */}
                <div className="absolute -bottom-4 left-4 md:-bottom-6 md:left-8 z-20 flex flex-col items-start gap-1 pointer-events-none">
                  <div className="bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-sm shadow-2xl">
                    <h3 className="font-jura text-xl md:text-3xl font-black tracking-wide uppercase">
                      {currentProject.title}
                    </h3>
                  </div>
                  <div className="bg-white/95 text-black px-2.5 py-1 md:px-3.5 md:py-1.5 rounded-sm shadow-xl">
                    <p className="font-jura text-sm md:text-base font-extrabold tracking-wider text-stone-900">
                      {currentProject.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls Bar (Dark Theme) */}
          <div className="relative z-10 flex flex-col items-center gap-3 w-full">
            {/* Interactive Hints */}
            <div className="flex items-center gap-4 text-gray-400 font-jura text-[11px] md:text-xs tracking-wider font-semibold">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white/10 text-white border border-white/20 text-[10px] rounded font-mono">
                  ← →
                </kbd>{' '}
                press arrow key
              </span>
              <span className="hidden md:inline text-white/20">|</span>
              <span>tap image to view details</span>
            </div>

            {/* Pagination Prev / Next Controls */}
            <div className="flex items-center gap-6">
              <button
                onClick={handlePrev}
                disabled={activeIndex === 0}
                className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer font-mono text-sm ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#D4FF90] hover:text-black hover:border-[#D4FF90]'
                  }`}
                aria-label="Previous project"
              >
                ‹
              </button>

              <span className="font-mono text-xs font-bold tracking-widest text-white">
                <span className="text-[#D4FF90]">0{activeIndex + 1}</span> / 0{projects.length}
              </span>

              <button
                onClick={handleNext}
                disabled={activeIndex === projects.length - 1}
                className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer font-mono text-sm ${activeIndex === projects.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#D4FF90] hover:text-black hover:border-[#D4FF90]'
                  }`}
                aria-label="Next project"
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── MODE 2: Split-Screen Detail View (Dark Theme) ── */}
      {selectedProject && (
        <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto py-4 md:py-8 flex flex-col overflow-y-auto animate-in fade-in zoom-in-95 duration-400">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Metadata & Details Panel */}
            <div className="lg:col-span-4 space-y-6 flex flex-col justify-center">
              {/* Back to Works Button */}
              <div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-white/30 text-white hover:bg-white hover:text-black font-jura text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-sm"
                >
                  <span>‹</span> back to works
                </button>
              </div>

              {/* Title Header with Inverted White Badges */}
              <div className="space-y-1 pt-2">
                <div className="inline-block bg-white text-black px-4 py-2 rounded-sm shadow-xl">
                  <h3 className="font-jura text-2xl md:text-4xl font-black tracking-wide uppercase">
                    {selectedProject.title}
                  </h3>
                </div>
                <div>
                  <div className="inline-block bg-white/95 text-black px-3 py-1 rounded-sm shadow-lg">
                    <p className="font-jura text-sm md:text-lg font-extrabold tracking-wider text-stone-900">
                      {selectedProject.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata Badges (Category & Role) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="font-jura text-xs text-gray-400 font-bold uppercase tracking-widest w-20">
                    category
                  </span>
                  <span className="bg-white/10 text-[#D4FF90] border border-white/15 px-2.5 py-1 font-jura text-xs font-bold rounded-sm">
                    {selectedProject.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-jura text-xs text-gray-400 font-bold uppercase tracking-widest w-20">
                    role
                  </span>
                  <span className="bg-white/10 text-[#D4FF90] border border-white/15 px-2.5 py-1 font-jura text-xs font-bold rounded-sm">
                    {selectedProject.role}
                  </span>
                </div>

                {/* Technology Tag Pills */}
                <div className="flex items-start gap-3 pt-1">
                  <span className="font-jura text-xs text-gray-400 font-bold uppercase tracking-widest w-20 pt-1">
                    tag
                  </span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {selectedProject.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-white/10 text-gray-200 border border-white/15 px-2 py-0.5 font-jura text-[11px] font-bold rounded-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <p className="font-sans text-sm md:text-base text-gray-300 leading-relaxed pt-2">
                {selectedProject.description}
              </p>

              {/* Action Buttons: SEE MORE + VISIT SITE */}
              <div className="pt-4 space-y-2">
                <button
                  onClick={() => {
                    setActiveDocProject(selectedProject);
                    setReadmeContent('');
                    setLoadingReadme(true);
                    setActiveDocTab('readme');
                    setDocModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 border border-white/30 text-white hover:bg-white hover:text-black hover:border-white transition-all font-jura text-xs tracking-widest font-extrabold uppercase rounded-sm cursor-pointer shadow-md group"
                >
                  read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <a
                  href={selectedProject.link.startsWith('http') ? selectedProject.link : `https://${selectedProject.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-white text-black hover:bg-[#D4FF90] transition-all font-jura text-xs tracking-widest font-extrabold uppercase rounded-sm cursor-pointer shadow-md group"
                >
                  visit site <span className="group-hover:translate-x-1 transition-transform">↗</span>
                </a>
              </div>
            </div>

            {/* Right Column: Visual Showcase Card */}
            <div className="lg:col-span-8">
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] shadow-2xl rounded-sm overflow-hidden">
                <div
                  className="w-full h-full bg-[#0d0d0d] overflow-hidden relative border border-white/10 rounded-sm"
                >
                  {selectedProject.videoUrl ? (
                    <video
                      src={selectedProject.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom PREV / NEXT Project Navigation Strip (Unshift studiodetails exact match) */}
          {(() => {
            const activeProjects = projects.filter((p) => !p.isComingSoon);
            const currentIndex = activeProjects.findIndex((p) => p.id === selectedProject.id);
            const prevProject = activeProjects[(currentIndex - 1 + activeProjects.length) % activeProjects.length];
            const nextProject = activeProjects[(currentIndex + 1) % activeProjects.length];

            return (
              <div className="w-full grid grid-cols-2 gap-4 md:gap-6 pt-6 border-t border-white/10 mt-auto">
                {/* PREV PROJECT CARD */}
                <button
                  onClick={() => setSelectedProject(prevProject)}
                  className="group relative h-24 md:h-32 rounded-sm overflow-hidden border border-white/15 bg-black text-left cursor-pointer transition-all duration-300 hover:border-white/40 shadow-xl"
                >
                  <img
                    src={prevProject.image}
                    alt={prevProject.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 font-display text-2xl md:text-4xl text-white/70 group-hover:text-white transition-colors tracking-widest uppercase drop-shadow-md">
                      <span className="font-mono text-xl md:text-3xl text-white/80">‹</span>
                      <span>PREV</span>
                    </div>
                    <p className="font-jura text-xs md:text-sm font-extrabold tracking-wider text-[#D4FF90] uppercase mt-0.5 truncate drop-shadow-sm">
                      {prevProject.title}
                    </p>
                  </div>
                </button>

                {/* NEXT PROJECT CARD */}
                <button
                  onClick={() => setSelectedProject(nextProject)}
                  className="group relative h-24 md:h-32 rounded-sm overflow-hidden border border-white/15 bg-black text-right cursor-pointer transition-all duration-300 hover:border-white/40 shadow-xl"
                >
                  <img
                    src={nextProject.image}
                    alt={nextProject.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-black/85 via-black/40 to-transparent group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-center items-end">
                    <div className="flex items-center gap-2 font-display text-2xl md:text-4xl text-white/70 group-hover:text-white transition-colors tracking-widest uppercase drop-shadow-md">
                      <span>NEXT</span>
                      <span className="font-mono text-xl md:text-3xl text-white/80">›</span>
                    </div>
                    <p className="font-jura text-xs md:text-sm font-extrabold tracking-wider text-[#D4FF90] uppercase mt-0.5 truncate drop-shadow-sm">
                      {nextProject.title}
                    </p>
                  </div>
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── MODE 3: Document Reader Modal Overlay ── */}
      {docModalOpen && activeDocProject && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[60] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300"
          onClick={() => {
            setDocModalOpen(false);
            setActiveDocProject(null);
            setReadmeContent('');
          }}
        >
          <div
            className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] bg-[#0c0c0c] border border-white/15 text-white rounded-sm flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Modal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 px-6 py-4 gap-4 bg-black/40">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[#D4FF90]">0{activeDocProject.num}</span>
                <span className="h-4 w-px bg-white/20" />
                <h3 className="font-jura text-base md:text-lg font-black tracking-wider uppercase text-white">
                  {activeDocProject.title} Documentation
                </h3>
              </div>

              {/* Tabs list inside Header */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveDocTab('readme')}
                  className={`px-4 py-1.5 font-jura text-[10px] md:text-xs font-extrabold uppercase tracking-wider rounded-sm transition-all border cursor-pointer ${activeDocTab === 'readme'
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-white/15 hover:bg-white/5 hover:border-white/30'
                    }`}
                >
                  README.md
                </button>
                {activeDocProject.pdfUrl && (
                  <button
                    onClick={() => setActiveDocTab('pdf')}
                    className={`px-4 py-1.5 font-jura text-[10px] md:text-xs font-extrabold uppercase tracking-wider rounded-sm transition-all border cursor-pointer ${activeDocTab === 'pdf'
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white border-white/15 hover:bg-white/5 hover:border-white/30'
                      }`}
                  >
                    PDF Document
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setDocModalOpen(false);
                  setActiveDocProject(null);
                  setReadmeContent('');
                }}
                className="absolute top-4 right-4 md:static md:ml-4 w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer font-mono text-sm shrink-0"
                aria-label="Close document reader"
                data-circle-cursor="close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 relative bg-[#090909]">
              {/* Tab 1: README Content Viewport */}
              {activeDocTab === 'readme' && (
                <div
                  ref={readmeScrollRef}
                  className="w-full h-full overflow-y-auto px-6 py-6 md:px-8 select-text selection:bg-[#D4FF90]/30 selection:text-white"
                  data-lenis-prevent
                >
                  {loadingReadme ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/20 border-t-[#D4FF90] rounded-full animate-spin" />
                      <p className="font-jura text-xs tracking-widest text-gray-500 uppercase">Fetching Documentation...</p>
                    </div>
                  ) : (
                    <article
                      className="max-w-3xl mx-auto prose prose-invert font-sans"
                      dangerouslySetInnerHTML={{ __html: readmeContent }}
                    />
                  )}
                </div>
              )}

              {/* Tab 2: PDF Document Viewport */}
              {activeDocTab === 'pdf' && activeDocProject.pdfUrl && (
                <div className="w-full h-full relative flex flex-col bg-black">
                  {/* Floating Action Bar for Mobile & Quick Actions */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <a
                      href={activeDocProject.pdfUrl}
                      download
                      className="bg-white/95 text-black hover:bg-[#D4FF90] font-jura text-[10px] font-extrabold px-3 py-1.5 rounded-sm uppercase transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download PDF
                    </a>
                  </div>

                  {/* Embedded PDF iframe */}
                  <iframe
                    src={`${activeDocProject.pdfUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full border-0 select-none bg-stone-950"
                    title={`${activeDocProject.title} PDF Document`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
