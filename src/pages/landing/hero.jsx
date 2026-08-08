/**
 * hero.jsx
 
 * ──────────────────────────────────────────────────────────────────
 */

import HeroBackground from '../../components/heroBackground';
import Navbar from '../../components/navbar';
import HeroHeading from '../../components/heroHeading';
import HeroSubheading from '../../components/heroSubheading';
import AnimatedSection from '../../components/AnimatedSection';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeroBackground />
      <Navbar />

      <section
        id="hero"
        className="
          relative z-10
          min-h-screen
          flex flex-col items-center justify-center
          px-4 sm:px-6 pt-20 pb-16
          text-center
        "
        aria-label="Hero section"
      >
        {/* Animated Hero Heading */}
        <AnimatedSection animation="zoom-in" delay={100}>
          <HeroHeading />
        </AnimatedSection>

        {/* Animated Subheading */}
        <AnimatedSection animation="fade-in-up" delay={400} className="mt-5 sm:mt-6 mb-8 sm:mb-10">
          <HeroSubheading />
        </AnimatedSection>

        {/* Animated Register Button */}
        <AnimatedSection animation="fade-in-up" delay={700}>
          <button
            id="cta-register"
            onClick={() => navigate('/auth')}
            className="
              relative group btn-float-pulse
              px-8 sm:px-10 py-3.5 sm:py-4
              rounded-full
              font-semibold text-white text-xs sm:text-sm tracking-widest uppercase
              overflow-hidden
              transition-all duration-300
              hover:scale-110 active:scale-95 cursor-pointer
            "
            style={{
              background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 40%, #155e75 100%)',
            }}
            aria-label="Register for the event"
          >
            <span
              className="
                absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                transition-opacity duration-500
              "
              style={{
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 60%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }}
              aria-hidden="true"
            />
            <span className="relative z-10 font-bold">Register Now</span>
          </button>
        </AnimatedSection>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none"
          aria-hidden="true"
        >
          <span className="text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 sm:h-8 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse" />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
