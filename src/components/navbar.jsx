/**
 * navbar.jsx

 * ──────────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'About',    href: '#about'    },
  { label: 'Schedule', href: '#schedule' },
  { label: 'FAQs',     href: '#faqs'     },
];

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const linkRefs = useRef([]);
  const [comet, setComet] = useState(null);
  const [cometVisible, setCometVisible] = useState(false);

  const handleNavClick = (e, index) => {
    e.preventDefault();

    const fromEl = linkRefs.current[activeIndex];
    const toEl   = linkRefs.current[index];

    if (fromEl && toEl && index !== activeIndex) {
      const fromRect = fromEl.getBoundingClientRect();
      const toRect   = toEl.getBoundingClientRect();

      const startX = fromRect.left + fromRect.width / 2;
      const startY = fromRect.top  + fromRect.height / 2;
      const endX = toRect.left + toRect.width / 2;
      const endY = toRect.top  + toRect.height / 2;

      setComet({ startX, startY, endX, endY });
      setCometVisible(true);
      setTimeout(() => setCometVisible(false), 700);
    }

    setActiveIndex(index);

    const targetId = NAV_LINKS[index].href.replace('#', '');
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observers = NAV_LINKS.map((link, i) => {
      const target = document.getElementById(link.href.replace('#', ''));
      if (!target) return null;

      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.4 }
      );
      observer.observe(target);
      return observer;
    });

    return () => observers.forEach(obs => obs?.disconnect());
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-4 sm:px-8 md:px-12 py-3
          bg-[rgba(2,8,25,0.8)]
          backdrop-blur-lg
          border-b border-[rgba(0,160,255,0.15)]
        "
      >
        {/* LEFT ALIGNED: EIS Logo with white text & transparent background */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 no-underline group cursor-pointer"
          aria-label="Entrepreneur & Innovation Society - Back to top"
        >
          <img
            src="/eis-logo-raw.jpg"
            alt="EIS Logo"
            className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            style={{
              filter: 'invert(1) brightness(1.2) contrast(1.1)',
              mixBlendMode: 'screen',
            }}
          />
        </a>

        {/* RIGHT ALIGNED: Navigation Tabs */}
        <ul className="flex items-center gap-2 sm:gap-6 list-none m-0 p-0">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <a
                ref={el => { linkRefs.current[i] = el; }}
                href={link.href}
                id={`nav-link-${link.label.toLowerCase()}`}
                onClick={e => handleNavClick(e, i)}
                className={`
                  relative font-medium text-xs sm:text-sm tracking-widest uppercase
                  transition-all duration-300 no-underline
                  px-2.5 sm:px-3.5 py-1.5 rounded-full block
                  ${activeIndex === i
                    ? 'text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                {link.label}
                <span
                  className={`
                    absolute bottom-0 left-2 right-2 h-0.5
                    bg-gradient-to-r from-transparent via-cyan-400 to-transparent
                    origin-center transition-transform duration-300
                    ${activeIndex === i ? 'scale-x-100' : 'scale-x-0'}
                  `}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {cometVisible && comet && (
        <CometStar
          startX={comet.startX}
          startY={comet.startY}
          endX={comet.endX}
          endY={comet.endY}
        />
      )}
    </>
  );
};

const CometStar = ({ startX, startY, endX, endY }) => {
  const starRef = useRef(null);

  useEffect(() => {
    if (!starRef.current) return;
    starRef.current.style.transform = `translate(${startX}px, ${startY}px)`;

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (starRef.current) {
          starRef.current.style.transform = `translate(${endX}px, ${endY}px)`;
        }
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [startX, startY, endX, endY]);

  const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
  const distance = Math.hypot(endX - startX, endY - startY);

  return (
    <div
      ref={starRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        transform: `translate(${startX}px, ${startY}px)`,
        transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 20%, #38bdf8 60%, transparent 80%)',
          boxShadow: '0 0 8px 3px rgba(56,189,248,0.8), 0 0 20px 8px rgba(56,189,248,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          width: `${Math.min(distance * 0.4, 60)}px`,
          height: '2px',
          background: 'linear-gradient(to left, rgba(56,189,248,0.9), transparent)',
          transformOrigin: 'left center',
          transform: `rotate(${angle + 180}deg)`,
          borderRadius: '1px',
          opacity: 0.8,
        }}
      />
    </div>
  );
};

export default Navbar;
