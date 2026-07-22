import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import FluidBackground from './components/FluidBackground';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import Hero from './sections/Hero';
import Profile from './sections/Profile';
import Work from './sections/Work';
import Certificates from './sections/Certificates';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const screenRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Animate progress
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    });

    // Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
    });

    // Slide up loading screen
    tl.to(screenRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete,
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={screenRef}
      className="loading-screen"
    >
      <div ref={textRef} className="text-center">
        <div className="font-display text-4xl md:text-6xl text-white mb-6 tracking-wide">
          made by Afnan.
        </div>
        <div className="w-48 h-px bg-white/10 mx-auto overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-[#D4FF90] origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>
        <div className="mt-4 font-jura text-xs tracking-[0.3em] text-gray-500 uppercase">
          Loading Experience
        </div>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (!progressRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      progressRef.current.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-px bg-white/5 z-[101]">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-[#D4FF90] to-[#a8cc70] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

function TimelineDots() {
  const [activeSection, setActiveSection] = useState(0);
  const sections = ['hero', 'about', 'work', 'certificates', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollY) {
          setActiveSection(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3">
      {sections.map((_, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          className={`timeline-dot ${i === activeSection ? 'active' : ''}`}
          aria-label={`Go to section ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isLoading) return;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after content loads
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, [isLoading]);

  // Global background color transitions per section (Ultra-smooth 1.2s fluid fade)
  useEffect(() => {
    if (isLoading) return;

    // Each section has a distinct background color
    const colorMap: { id: string; bg: string }[] = [
      { id: 'hero', bg: '#090a0c' }, // Void black
      { id: 'about', bg: '#F0EBE3' }, // Warm cream white (Overview)
      { id: 'work', bg: '#050505' }, // Dark theme (#050505)
      { id: 'certificates', bg: '#F0EBE3' }, // Warm cream white (Overview color match)
      { id: 'contact', bg: '#040806' }, // Dark forest
    ];

    const globalBg = document.getElementById('global-bg');
    if (!globalBg) return;

    colorMap.forEach(({ id, bg }) => {
      const el = document.getElementById(id);
      if (!el) return;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () =>
          gsap.to(globalBg, { backgroundColor: bg, duration: 0.8, ease: 'power2.inOut' }),
        onEnterBack: () =>
          gsap.to(globalBg, { backgroundColor: bg, duration: 0.8, ease: 'power2.inOut' }),
      });
    });
  }, [isLoading]);

  return (
    <>
      {/* Global background color layer — GSAP transitions this between section colors */}
      <div
        id="global-bg"
        className="fixed inset-0 z-[-1] transition-none"
        style={{ backgroundColor: '#090a0c' }}
      />

      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        <>
          <CustomCursor />
          <ScrollProgress />
          <TimelineDots />
          <Navigation />
          <FluidBackground />

          <main ref={mainRef} className="relative">
            <Hero />
            <Profile />
            <Work />
            <Certificates />
            <Contact />
          </main>
        </>
      )}
    </>
  );
}
