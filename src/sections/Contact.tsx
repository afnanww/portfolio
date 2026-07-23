import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navCol1 = [
  { label: 'TOP', href: '#hero', isTop: true },
  { label: 'ABOUT', href: '#about', isTop: false },
  { label: 'WORKS', href: '#work', isTop: false },
];

const navCol2 = [
  { label: 'CERTS', href: '#certificates', isTop: false },
  { label: 'CONTACT', href: '#contact', isTop: false, isContact: true },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  // Chatbot State
  const [showChatbot, setShowChatbot] = useState(false);
  const [hasClickedContact, setHasClickedContact] = useState(false);
  const [inquiryType, setInquiryType] = useState<'email' | 'phone' | null>(null);

  // Sequential Typing & Timing States
  const [isTyping1, setIsTyping1] = useState(true);
  const [showGreeting, setShowGreeting] = useState(false);
  const [isTyping2, setIsTyping2] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping3, setIsTyping3] = useState(false);
  const [showResponseMsg, setShowResponseMsg] = useState(false);
  const [isTyping4, setIsTyping4] = useState(false);
  const [showLinkBubble, setShowLinkBubble] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Typewriter effect states for "Thank you" wording
  const [typedThankYou, setTypedThankYou] = useState('');
  const [showHeart, setShowHeart] = useState(false);

  const [currentTime, setCurrentTime] = useState('');

  // Typewriter effect for "Thank you" wording ONLY AFTER thankyou.webp finishes sliding in (1000ms)
  useEffect(() => {
    if (showThankYou) {
      setTypedThankYou('');
      setShowHeart(false);

      const photoTimer = setTimeout(() => {
        const fullText = "Thank you";
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < fullText.length) {
            setTypedThankYou(fullText.slice(0, i + 1));
            i++;
          } else {
            clearInterval(typeInterval);
            setShowHeart(true); // Red heart appears right after text finishes typing!
          }
        }, 80);

        return () => clearInterval(typeInterval);
      }, 1050);

      return () => clearTimeout(photoTimer);
    } else {
      setTypedThankYou('');
      setShowHeart(false);
    }
  }, [showThankYou]);

  // Sequential loading sequence when chatbot opens
  useEffect(() => {
    if (showChatbot) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);

      // Reset sequence
      setIsTyping1(true);
      setShowGreeting(false);
      setIsTyping2(false);
      setShowOptions(false);
      setInquiryType(null);
      setIsTyping3(false);
      setShowResponseMsg(false);
      setIsTyping4(false);
      setShowLinkBubble(false);
      setShowThankYou(false);

      // Step 1: Loading dots -> reveal greeting, then start 2nd loading dots
      const t1 = setTimeout(() => {
        setIsTyping1(false);
        setShowGreeting(true);
        setIsTyping2(true);
      }, 1000);

      // Step 2: Loading dots -> reveal options
      const t2 = setTimeout(() => {
        setIsTyping2(false);
        setShowOptions(true);
      }, 2000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [showChatbot]);

  // Lock scrolling when chatbot is open
  useEffect(() => {
    if (showChatbot) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const preventWheel = (e: WheelEvent | TouchEvent) => {
        const target = e.target as HTMLElement;
        if (target && target.closest('#chatbot-panel')) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener('wheel', preventWheel, { passive: false });
      window.addEventListener('touchmove', preventWheel, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('wheel', preventWheel);
        window.removeEventListener('touchmove', preventWheel);
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [showChatbot]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        nameRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' }
      );

      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { label: string; href: string; isContact?: boolean }) => {
    e.preventDefault();
    if (link.isContact) {
      setShowChatbot(true);
      setHasClickedContact(true);
    } else {
      setShowChatbot(false);
      const target = document.querySelector(link.href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOptionClick = (type: 'email' | 'phone') => {
    if (inquiryType === type) return;
    setInquiryType(type);

    setIsTyping3(true);
    setShowResponseMsg(false);
    setIsTyping4(false);
    setShowLinkBubble(false);
    setShowThankYou(false);

    // Step 3: Loading dots -> reveal Bot reply message, then start 4th loading dots
    setTimeout(() => {
      setIsTyping3(false);
      setShowResponseMsg(true);
      setIsTyping4(true);

      // Step 4: Loading dots -> reveal Bare Link Bubble
      setTimeout(() => {
        setIsTyping4(false);
        setShowLinkBubble(true);

        // Step 5: Reveal Thank You photo AFTER the last message is sent!
        setTimeout(() => {
          setShowThankYou(true);
        }, 600);
      }, 900);
    }, 900);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full min-h-screen flex flex-col bg-[#141416] pt-16 md:pt-20 overflow-hidden"
    >
      {/* ── Lime Footer Section (Smoothly pushes left when chatbot opens) ── */}
      <div
        className={`relative flex-1 bg-[#D2FD29] rounded-tl-[90px] md:rounded-tl-[140px] flex flex-col justify-between px-8 md:px-14 pt-12 pb-10 overflow-hidden shadow-2xl transition-transform duration-500 ease-out ${showChatbot
          ? '-translate-x-full md:-translate-x-[440px] lg:-translate-x-[480px]'
          : 'translate-x-0'
          }`}
      >

        {/* Top bar: nav links grid right side */}
        <div className="flex items-start justify-between w-full">
          {/* Empty left column */}
          <div />

          {/* Navigation Links Grid (top-right, Junni exact match - 20px font) */}
          <nav className="grid grid-cols-2 gap-x-10 md:gap-x-14 gap-y-3 text-left">
            {/* Column 1 */}
            <div className="space-y-2.5">
              {navCol1.map((link) => {
                const isActiveTop = link.isTop && !showChatbot;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="font-jura text-[20px] font-black tracking-[0.18em] text-black hover:opacity-70 transition-opacity uppercase flex items-center gap-2 group cursor-pointer"
                  >
                    {isActiveTop ? (
                      <span className="relative inline-flex items-center font-black">
                        <span className="w-4 h-[3px] bg-black inline-block mr-1.5"></span>
                        TOP
                        <span className="w-4 h-[3px] bg-black inline-block ml-1.5"></span>
                      </span>
                    ) : (
                      <>
                        <span className="text-black font-black text-[15px]">▪</span>
                        <span>{link.label}</span>
                      </>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="relative space-y-2.5">
              {navCol2.map((link) => {
                const isActiveContact = link.isContact && showChatbot;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className="font-jura text-[20px] font-black tracking-[0.18em] text-black hover:opacity-70 transition-opacity uppercase flex items-center gap-2 cursor-pointer"
                  >
                    {isActiveContact ? (
                      <span className="relative inline-flex items-center font-black">
                        <span className="w-4 h-[3px] bg-black inline-block mr-1.5"></span>
                        CONTACT
                        <span className="w-4 h-[3px] bg-black inline-block ml-1.5"></span>
                      </span>
                    ) : (
                      <>
                        <span className="text-black font-black text-[15px]">▪</span>
                        <span>{link.label}</span>
                      </>
                    )}
                  </a>
                );
              })}

              {/* Red Hand-Drawn Arrow & "click here" indicator pointing directly to CONTACT */}
              {!showChatbot && !hasClickedContact && (
                <div
                  onClick={() => {
                    setShowChatbot(true);
                    setHasClickedContact(true);
                  }}
                  className="absolute -bottom-16 -left-8 md:-bottom-20 md:-left-14 flex flex-col items-center cursor-pointer pointer-events-auto group z-20 animate-bounce duration-1000"
                >
                  <svg
                    className="w-14 h-12 md:w-20 md:h-16 text-red-600 stroke-current fill-none transform group-hover:scale-110 transition-transform drop-shadow-sm"
                    viewBox="0 0 100 70"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Hand-drawn looped arrow pointing up-right to CONTACT */}
                    <path d="M 12 55 C 22 45 28 48 24 38 C 20 28 32 35 48 30 C 64 25 72 18 82 8" />
                    <path d="M 64 8 L 84 7 L 80 25" />
                  </svg>
                  <span className="font-mono text-red-600 font-extrabold text-sm md:text-base tracking-wider transform -rotate-6 select-none -mt-2 group-hover:underline">
                    click here
                  </span>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center: Giant brand name */}
        <div ref={nameRef} className="my-auto py-8 text-center pointer-events-none" style={{ opacity: 0 }}>
          <h2 className="font-display text-[17vw] md:text-[14vw] lg:text-[12vw] leading-none tracking-tight text-black font-black select-none">
            AFNAN WAJDI
          </h2>

          <p ref={taglineRef} className="font-jura text-xl md:text-3xl tracking-[0.15em] text-black mt-4 font-extrabold">
            Full-Stack Developer。
          </p>

          {/* Social Links under Japanese sentence: LinkedIn & GitHub */}
          <div className="flex items-center justify-center gap-10 mt-8 pointer-events-auto">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/afnanw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-black hover:opacity-75 transition-all group"
            >
              <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform bg-transparent">
                <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <span className="font-jura text-[11px] font-black tracking-widest uppercase text-black">
                LinkedIn
              </span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/afnanww"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-black hover:opacity-75 transition-all group"
            >
              <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform bg-transparent">
                <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <span className="font-jura text-[11px] font-black tracking-widest uppercase text-black">
                GitHub
              </span>
            </a>

            {/* Resume */}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-black hover:opacity-75 transition-all group"
            >
              <div className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform bg-transparent">
                <svg className="w-5 h-5 fill-none stroke-black" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span className="font-jura text-[11px] font-black tracking-widest uppercase text-black">
                Resume
              </span>
            </a>
          </div>
        </div>

        {/* Bottom right: PAGE TOP double-chevron button */}
        <div className="flex justify-end pr-2 md:pr-4">
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center group cursor-pointer text-black select-none"
            aria-label="Back to top"
          >
            {/* Double chevron up */}
            <div className="flex flex-col -space-y-3 mb-1 group-hover:-translate-y-2 transition-transform duration-300">
              <svg className="w-7 h-7 stroke-black stroke-[4]" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <svg className="w-7 h-7 stroke-black stroke-[4]" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </div>
            <span className="font-jura text-[10px] tracking-[0.25em] font-black uppercase text-black">
              PAGE TOP
            </span>
          </button>
        </div>
      </div>

      {/* ── Bottom dark strip ── */}
      <div className="w-full bg-[#141416] py-3 px-8 md:px-16 flex items-center justify-between gap-6">
        <div className="font-sans text-xs tracking-wider text-gray-500 uppercase">
          AFNAN WAJDI — FULL-STACK DEVELOPER
        </div>
        <a
          href="mailto:afnanwajdi@email.com"
          className="font-sans text-xs tracking-wider text-gray-400 hover:text-[#D2FD29] transition-colors duration-300 hidden md:block"
        >
          afnanwajdi@email.com
        </a>
      </div>

      {/* ── Dedicated Chatbot Side Drawer Overlay ── */}
      {showChatbot && (
        <div
          id="chatbot-panel"
          className="fixed top-0 right-0 bottom-0 z-[99999] w-full md:w-[440px] lg:w-[480px] bg-[#EAE8E6] text-stone-900 flex flex-col justify-between p-6 md:p-8 overflow-y-auto overflow-x-hidden border-l border-black/10 shadow-2xl animate-in slide-in-from-right duration-400"
        >
          {/* Header Bar: BOLD "CONTACT US" + » Close Icon top-right */}
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-stone-300/60">
            <h3 className="font-display text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-stone-900 uppercase">
              CONTACT ME
            </h3>
            <button
              onClick={() => {
                setShowChatbot(false);
                setInquiryType(null);
              }}
              className="text-4xl font-black text-stone-800 hover:text-black transition-colors px-2 py-1 cursor-pointer select-none"
              aria-label="Close contact drawer"
            >
              »
            </button>
          </div>

          {/* Profile Avatar — pfpchatbot.webp (locked without gray border ring) */}
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-black overflow-hidden relative shadow-lg mx-auto my-6 flex-shrink-0">
            <img
              src="/images/pfpchatbot.webp"
              alt="Afnan-kun Chatbot"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Chat Content Body */}
          <div className="flex-1 py-2 space-y-4 overflow-y-auto overflow-x-hidden">

            {/* 1. First Loading Dots (Before Greeting) */}
            {isTyping1 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-400 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* 2. Greeting Chat Bubble (Bigger text + time on the side) */}
            {showGreeting && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm max-w-[82%] shadow-stone-200/50">
                  <p className="font-sans text-base md:text-lg text-stone-800 leading-relaxed font-medium">
                    Hi, I'm Afnan Wajdi Please choose the type of inquiry from the options below!
                  </p>
                </div>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

            {/* 3. Second Loading Dots (Before Options Card) */}
            {isTyping2 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-400 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* 4. Options Card (Bigger text + time on the side) */}
            {showOptions && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm max-w-[82%] space-y-2.5 shadow-stone-200/50 w-full">
                  <button
                    onClick={() => handleOptionClick('email')}
                    className={`w-full py-2.5 px-4 rounded-full text-center font-sans text-base transition-all cursor-pointer font-semibold ${inquiryType === 'email'
                      ? 'bg-black text-white'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                  >
                    Inquiry by Email
                  </button>
                  <button
                    onClick={() => handleOptionClick('phone')}
                    className={`w-full py-2.5 px-4 rounded-full text-center font-sans text-base transition-all cursor-pointer font-semibold ${inquiryType === 'phone'
                      ? 'bg-black text-white'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                  >
                    Phone inquiries
                  </button>
                </div>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

            {/* 5. Third Loading Dots (Before Bot Reply Message) */}
            {isTyping3 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-400 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* 6. Bot Reply Message (Bigger text + time on the side) */}
            {showResponseMsg && inquiryType === 'email' && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm max-w-[82%]">
                  <p className="font-sans text-base md:text-lg text-stone-800 leading-relaxed font-medium">
                    Email inquiry<br />
                    Please send your message to the address below.
                  </p>
                </div>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

            {showResponseMsg && inquiryType === 'phone' && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm max-w-[82%]">
                  <p className="font-sans text-base md:text-lg text-stone-800 leading-relaxed font-medium">
                    Telephone inquiry <br />
                    Available on call, WhatsApp and Telegram!

                  </p>
                </div>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

            {/* 7. Fourth Loading Dots (Before Bare Link Bubble) */}
            {isTyping4 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 duration-400 ease-out">
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* 8. Bare Link Bubble (Bigger text + time on the side) */}
            {showLinkBubble && inquiryType === 'email' && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <a
                  href="mailto:afnanwajdi@email.com"
                  className="inline-block bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm font-sans text-base md:text-lg text-stone-700 hover:text-black transition-colors underline underline-offset-2 font-medium"
                >
                  afnanwajdi@gmail.com
                </a>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

            {showLinkBubble && inquiryType === 'phone' && (
              <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 zoom-in-95 duration-500 ease-out">
                <a
                  href="tel:+60123456789"
                  className="inline-block bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm font-sans text-base md:text-lg text-stone-700 hover:text-black transition-colors underline underline-offset-2 font-medium"
                >
                  +60 10-8106400
                </a>
                <span className="font-mono text-[11px] text-stone-400 select-none whitespace-nowrap pb-1">
                  {currentTime}
                </span>
              </div>
            )}

          </div>

          {/* Footer Bar with Thank You Mascot sitting flush right on top of the line */}
          <div className="relative pt-4 border-t border-stone-300 flex items-center justify-between text-stone-500 font-jura text-[10px] uppercase tracking-widest mt-auto overflow-visible">
            {/* Thank You Mascot Animation (Slides in slowly from right of line AFTER last message) */}
            {showThankYou && inquiryType !== null && (
              <div className="absolute right-2 bottom-full pointer-events-none select-none animate-in fade-in duration-1000 ease-out overflow-visible">
                <div className="relative w-28 md:w-32 flex-shrink-0 animate-in slide-in-from-right-full duration-1000 ease-out">
                  {/* "Thank you ♡" floating next to character head (types out ONLY AFTER photo finishes sliding in!) */}
                  <div className="absolute -left-28 top-2 flex items-center gap-1 -rotate-6 transform origin-bottom-left whitespace-nowrap normal-case font-normal min-h-[32px]">
                    <span className="font-['Caveat',cursive] text-2xl text-stone-500 font-bold tracking-wide">
                      {typedThankYou}
                    </span>
                    {showHeart && (
                      <svg className="w-5 h-5 fill-none stroke-red-500 stroke-[3] animate-in fade-in duration-300" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    )}
                  </div>
                  {/* Character image sitting flush right on top of the border line */}
                  <img
                    src="/images/thankyou.webp"
                    alt="Thank you character"
                    className="w-full h-auto object-contain object-bottom block drop-shadow-lg"
                  />
                </div>
              </div>
            )}
            <span>LET'S CONNECT</span>
          </div>
        </div>
      )}
    </section>
  );
}
