import { useState } from 'react';

const navLinks = [
  { label: 'TOP', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'WORKS', href: '#work' },
  { label: 'CERTS', href: '#certificates' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Right Menu Trigger (No borders, automatic color inversion per section) */}
      <div
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 pointer-events-auto"
        style={{ mixBlendMode: 'difference' }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 px-3 py-1.5 transition-all duration-300 select-none cursor-pointer"
        >
          <span className="font-jura text-xs tracking-[0.25em] text-white uppercase font-extrabold transition-all">
            {isOpen ? 'CLOSE' : 'MENU'}
          </span>
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white group-hover:scale-125 transition-transform" />
          </div>
        </button>
      </div>

      {/* Right Vertical Copyright Text (Automatic color inversion per section) */}
      <div
        className="fixed right-4 md:right-6 bottom-10 z-40 pointer-events-none select-none hidden md:block"
        style={{ mixBlendMode: 'difference' }}
      >
        <p className="font-jura text-[10px] tracking-[0.3em] text-white font-semibold uppercase [writing-mode:vertical-rl] rotate-180">
          Copyright © AFNAN WAJDI. All Rights Reserved.
        </p>
      </div>

      {/* Fullscreen Overlay Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808]/95 backdrop-blur-2xl transition-all duration-500 flex items-center justify-center ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="text-center space-y-6">
          <ul className="space-y-6">
            {navLinks.map((link) => (
              <li key={link.label} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="font-display text-4xl md:text-6xl text-gray-400 hover:text-white hover:tracking-wider transition-all duration-300 inline-block cursor-pointer select-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
