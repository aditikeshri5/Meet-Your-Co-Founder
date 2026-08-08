/**
 * index.jsx (Landing Page Container)

 * ──────────────────────────────────────────────────────────────────
 */

import HeroSection from './hero';
import About from './about';
import Schedule from './schedule';
import FAQs from './faqs';

const LandingPage = () => {
  return (
    <main className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black text-white min-h-screen">
      <HeroSection />
      <About />
      <Schedule />
      <FAQs />

      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-slate-500 text-xs sm:text-sm">
        <p>© {new Date().getFullYear()} Meet Your Co-Founder. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default LandingPage;
