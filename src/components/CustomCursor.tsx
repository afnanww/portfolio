import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    hovering: false,
    label: '',
    mouseDown: false,
    visible: false,
  });

  const isTouchDevice = useCallback(() => {
    return window.matchMedia('(pointer: coarse)').matches;
  }, []);

  useEffect(() => {
    if (isTouchDevice()) return;

    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;
    const text = cursorTextRef.current;
    const glow = cursorGlowRef.current;
    if (!ring || !dot || !text || !glow) return;

    document.body.classList.add('custom-cursor-active');

    // Position all elements centered
    gsap.set([dot, ring, text, glow], { xPercent: -50, yPercent: -50 });

    // GSAP quickTo for 120fps tracking
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.015, ease: 'none' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.015, ease: 'none' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' });
    const textX = gsap.quickTo(text, 'x', { duration: 0.22, ease: 'power2.out' });
    const textY = gsap.quickTo(text, 'y', { duration: 0.22, ease: 'power2.out' });
    const glowX = gsap.quickTo(glow, 'x', { duration: 0.3, ease: 'power1.out' });
    const glowY = gsap.quickTo(glow, 'y', { duration: 0.3, ease: 'power1.out' });

    let inHero = true;

    const onScroll = () => {
      const currentInHero = window.scrollY < window.innerHeight * 0.75;
      if (currentInHero !== inHero) {
        inHero = currentInHero;
        if (!stateRef.current.hovering && stateRef.current.visible) {
          gsap.to(text, {
            opacity: inHero ? 0.85 : 0,
            scale: inHero ? 1 : 0.7,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Show cursor on first move
    const onMouseMove = (e: MouseEvent) => {
      if (!stateRef.current.visible) {
        stateRef.current.visible = true;
        // Only make the rotating text circle visible initially if in Hero
        if (inHero) {
          gsap.to(text, { opacity: 0.85, duration: 0.3 });
        }
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      textX(e.clientX);
      textY(e.clientY);
      glowX(e.clientX);
      glowY(e.clientY);
    };

    // Hover enter: expand ring, show label, hide text ring, hide normal system cursor
    const onHoverEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      stateRef.current.hovering = true;
      document.body.classList.add('cursor-hovering');

      // Determine label
      const customText = target.getAttribute('data-circle-cursor');
      let label = '';
      if (customText) {
        label = customText === 'more_detail' ? 'More Detail' : customText;
      } else if (target.closest('.project-card') || target.closest('.junni-works-item')) {
        label = 'view project';
      }
      stateRef.current.label = label;

      // Animate ring expand to fit bigger text & make it visible
      gsap.to(ring, {
        opacity: 1,
        width: label ? 108 : 64,
        height: label ? 108 : 64,
        borderWidth: 2,
        borderColor: '#D4FF90',
        backgroundColor: 'rgba(0,0,0,0.7)',
        duration: 0.35,
        ease: 'power3.out',
      });

      // Animate dot: shrink & change color & make it visible
      gsap.to(dot, {
        opacity: 1,
        width: 4,
        height: 4,
        backgroundColor: '#D4FF90',
        duration: 0.25,
        ease: 'power2.out',
      });

      // Fade out text ring & glow
      gsap.to(text, { opacity: 0, scale: 0.7, duration: 0.25, ease: 'power2.in' });
      gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.25 });

      // Show label if any
      const labelEl = ring.querySelector('.cursor-label') as HTMLElement;
      if (labelEl) {
        labelEl.textContent = label;
        gsap.to(labelEl, {
          opacity: label ? 1 : 0,
          scale: label ? 1 : 0.8,
          duration: 0.25,
          delay: 0.05,
          ease: 'power2.out',
        });
      }
    };

    // Hover leave: shrink ring back, hide custom ring/dot, show normal system cursor
    const onHoverLeave = () => {
      stateRef.current.hovering = false;
      stateRef.current.label = '';
      document.body.classList.remove('cursor-hovering');

      // Hide ring
      gsap.to(ring, {
        opacity: 0,
        width: 44,
        height: 44,
        borderWidth: 1.5,
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        duration: 0.4,
        ease: 'power3.out',
      });

      // Hide dot
      gsap.to(dot, {
        opacity: 0,
        width: 7,
        height: 7,
        backgroundColor: '#ffffff',
        duration: 0.3,
        ease: 'power2.out',
      });

      // Show text ring & glow only if still in Hero section
      if (inHero) {
        gsap.to(text, { opacity: 0.85, scale: 1, duration: 0.4, ease: 'power2.out' });
        gsap.to(glow, { opacity: 0.4, scale: 1, duration: 0.4 });
      } else {
        gsap.to(text, { opacity: 0, scale: 0.7, duration: 0.4, ease: 'power2.out' });
        gsap.to(glow, { opacity: 0, scale: 0.5, duration: 0.4 });
      }

      const labelEl = ring.querySelector('.cursor-label') as HTMLElement;
      if (labelEl) {
        gsap.to(labelEl, { opacity: 0, scale: 0.8, duration: 0.2 });
      }
    };

    // Click feedback: quick pulse (only if hovering, otherwise system click handles it)
    const onMouseDown = () => {
      stateRef.current.mouseDown = true;
      if (stateRef.current.hovering) {
        gsap.to(ring, { scale: 0.8, duration: 0.12, ease: 'power3.out' });
        gsap.to(dot, { scale: 1.8, duration: 0.12, ease: 'power3.out' });
      }
    };

    const onMouseUp = () => {
      stateRef.current.mouseDown = false;
      if (stateRef.current.hovering) {
        gsap.to(ring, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
        gsap.to(dot, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      }
    };

    // Hide cursor when leaving window
    const onMouseLeaveWindow = () => {
      gsap.to([dot, ring, text, glow], { opacity: 0, duration: 0.2 });
      stateRef.current.visible = false;
    };

    const onMouseEnterWindow = () => {
      if (stateRef.current.hovering) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
        gsap.to([text, glow], { opacity: 0, duration: 0.2 });
      } else {
        gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
        if (inHero) {
          gsap.to(text, { opacity: 0.85, duration: 0.2 });
          gsap.to(glow, { opacity: 0.4, duration: 0.2 });
        }
      }
      stateRef.current.visible = true;
    };

    // Attach interactive element listeners
    const attachListeners = () => {
      const els = document.querySelectorAll(
        'a, button, [role="button"], [data-circle-cursor], .junni-works-item, .project-card, input, textarea, select'
      );
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onHoverEnter);
        el.removeEventListener('mouseleave', onHoverLeave);
        el.addEventListener('mouseenter', onHoverEnter);
        el.addEventListener('mouseleave', onHoverLeave);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      observer.disconnect();
    };
  }, [isTouchDevice]);

  if (typeof window !== 'undefined' && isTouchDevice()) return null;

  return (
    <>
      {/* Layer 4: Ambient glow trail */}
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 pointer-events-none z-[999996] w-40 h-40 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, rgba(212,255,144,0.15) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Layer 3: Rotating SCROLL DOWN text ring (Inverts automatically with mix-blend-mode) */}
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 pointer-events-none z-[999997] w-36 h-36 opacity-0"
        style={{ mixBlendMode: 'difference' }}
      >
        <svg
          className="w-full h-full animate-[spin_10s_linear_infinite] text-white"
          viewBox="0 0 100 100"
        >
          <defs>
            <path
              id="cursorCirclePath"
              d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text className="font-jura text-[12px] font-extrabold tracking-[0.28em] fill-current uppercase">
            <textPath href="#cursorCirclePath">
              SCROLL DOWN • SCROLL DOWN •
            </textPath>
          </text>
        </svg>
      </div>

      {/* Layer 2: Trailing outer ring (Inverts automatically with mix-blend-mode) */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[999998] rounded-full opacity-0"
        style={{
          width: 44,
          height: 44,
          border: '1.5px solid #ffffff',
          mixBlendMode: 'difference',
        }}
      >
        {/* Dynamic label */}
        <span
          className="cursor-label absolute inset-0 flex items-center justify-center font-jura text-[11px] font-bold tracking-[0.2em] text-[#D4FF90] text-center leading-tight opacity-0"
        />
      </div>

      {/* Layer 1: Precision center dot (Inverts automatically with mix-blend-mode) */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[999999] rounded-full bg-white opacity-0"
        style={{
          width: 7,
          height: 7,
          mixBlendMode: 'difference',
        }}
      />
    </>
  );
}
