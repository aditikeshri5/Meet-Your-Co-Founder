/**
 * about.jsx
 * ──────────────────────────────────────────────────────────────────
 */

import GlowCard from '../../components/card';
import AnimatedSection from '../../components/AnimatedSection';

const About = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-32 flex flex-col items-center"
    >
      {/* Animated Heading & Glowing Underline */}
      <AnimatedSection animation="fade-in-up" delay={100}>
        <h2
          id="about-heading"
          className="
            text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight mb-8 sm:mb-12
            text-white text-center
          "
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          About the Event
          <span
            className="block mt-2 mx-auto rounded-full h-1 w-20 sm:w-24 title-underline-glow"
            style={{
              background: 'linear-gradient(to right, transparent, #38bdf8, transparent)',
              boxShadow: '0 0 14px rgba(56,189,248,0.8)',
            }}
            aria-hidden="true"
          />
        </h2>
      </AnimatedSection>

      {/* Animated Card */}
      <AnimatedSection animation="zoom-in" delay={250} className="w-full flex justify-center">
        <GlowCard className="max-w-3xl text-left p-5 sm:p-8">
          <p
            className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="text-cyan-300 font-semibold">"Meet Your Co-Founder"</span> is a
            structured, high-energy networking event designed to help students discover people
            they'd actually want to build a startup with — not just make friends, but evaluate
            real compatibility: communication style, creativity, problem-solving, teamwork, and
            shared values.
          </p>

          <p
            className="text-slate-300 leading-relaxed text-sm sm:text-base md:text-lg mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            The event runs in <span className="text-cyan-300 font-semibold">five phases</span>{' '}
            over roughly <span className="text-cyan-300 font-semibold">3 hours</span>: a fast
            welcome, one-on-one speed matching, open networking, a hands-on{' '}
            <span className="text-cyan-300 font-semibold">Startup Sprint Challenge</span> with
            self-selected pairs, and an energetic closing with a fun activity and a photobooth
            to make it memorable.
          </p>
        </GlowCard>
      </AnimatedSection>
    </section>
  );
};

export default About;
