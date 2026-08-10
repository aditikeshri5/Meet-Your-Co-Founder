/**
 * hero.jsx — Two CTA buttons: Register + Login
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
        <AnimatedSection animation="fade-in-up" delay={400} className="mt-5 sm:mt-6 mb-10 sm:mb-12">
          <HeroSubheading />
        </AnimatedSection>

        {/* Dual CTA Buttons */}
        <AnimatedSection animation="fade-in-up" delay={700}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">

            {/* Register Button — Primary */}
            <button
              id="cta-register"
              onClick={() => navigate('/auth?tab=register')}
              className="
                relative group btn-float-pulse
                px-9 sm:px-11 py-3.5 sm:py-4
                rounded-full
                font-bold text-white text-xs sm:text-sm tracking-widest uppercase
                overflow-hidden
                transition-all duration-300
                hover:scale-105 active:scale-95 cursor-pointer
              "
              style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 45%, #155e75 100%)',
                boxShadow: '0 0 25px rgba(8,145,178,0.45)',
              }}
              aria-label="Register for the event"
            >
              {/* Shimmer overlay */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 60%, transparent 70%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                }}
                aria-hidden="true"
              />
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Register
              </span>
            </button>

            {/* Login Button — Ghost / Outline */}
            <button
              id="cta-login"
              onClick={() => navigate('/auth?tab=login')}
              className="
                relative group
                px-9 sm:px-11 py-3.5 sm:py-4
                rounded-full
                font-bold text-cyan-300 text-xs sm:text-sm tracking-widest uppercase
                overflow-hidden
                border border-cyan-500/40
                hover:border-cyan-400/70
                hover:text-white
                hover:scale-105 active:scale-95
                transition-all duration-300 cursor-pointer
              "
              style={{
                background: 'rgba(8,145,178,0.08)',
                backdropFilter: 'blur(8px)',
              }}
              aria-label="Login to your account"
            >
              {/* Hover glow bg */}
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(8,145,178,0.12)' }}
                aria-hidden="true"
              />
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            </button>
          </div>
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
