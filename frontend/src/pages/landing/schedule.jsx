/**
 * schedule.jsx
 * ──────────────────────────────────────────────────────────────────
 */

import GlowCard from '../../components/card';
import AnimatedSection from '../../components/AnimatedSection';

const PHASES = [
  {
    id: 'phase-1',
    number: '01',
    title: 'Welcome',
    label: 'Phase 1',
    description: 'Fast-paced introductions and event briefing. Set the energy and get everyone aligned on the goals.',
  },
  {
    id: 'phase-2',
    number: '02',
    title: 'Founder Speed Matching',
    label: 'Phase 2',
    description: 'Quick one-on-one rounds where you assess compatibility on communication style, creativity, and drive.',
  },
  {
    id: 'phase-3',
    number: '03',
    title: 'Open Networking',
    label: 'Phase 3',
    description: 'Unstructured time to reconnect with standout matches and explore ideas together organically.',
  },
  {
    id: 'phase-4a',
    number: '4A',
    title: 'Choose Your Co-Founder',
    label: 'Phase 4 · Round A',
    description: 'Select your partner and lock in your team. Compatibility and conviction matter here.',
  },
  {
    id: 'phase-4b',
    number: '4B',
    title: 'Startup Creation',
    label: 'Phase 4 · Round B',
    description: 'Ideate and frame your startup concept — problem, solution, and target user in under 15 minutes.',
  },
  {
    id: 'phase-4c',
    number: '4C',
    title: 'Marketing Strategy',
    label: 'Phase 4 · Round C',
    description: 'Draft a rapid go-to-market plan. Who are you reaching and how?',
  },
  {
    id: 'phase-4d',
    number: '4D',
    title: 'Startup Pitches',
    label: 'Phase 4 · Round D',
    description: 'Teams pitch their startup in 60 seconds. High energy, high stakes, great practice.',
  },
  {
    id: 'phase-5',
    number: '05',
    title: 'Closing Ceremony',
    label: 'Phase 5',
    description: 'Closing activity, photobooth, and celebrations. Leave with a potential co-founder and great memories.',
  },
];

const Schedule = () => {
  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-32 flex flex-col items-center"
    >
      {/* Animated Heading & Glowing Underline */}
      <AnimatedSection animation="fade-in-up" delay={100}>
        <h2
          id="schedule-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight mb-12 sm:mb-16 text-white text-center"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Event Schedule
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

      <div className="relative w-full max-w-2xl">
        {/* Animated Flowing Energy Beam Timeline Line */}
        <div
          className="absolute left-[24px] sm:left-[30px] top-0 bottom-0 w-1 timeline-beam rounded-full"
          aria-hidden="true"
        />

        {PHASES.map((phase, index) => (
          <AnimatedSection key={phase.id} animation="fade-in-up" delay={index * 120}>
            <TimelineItem phase={phase} isLast={index === PHASES.length - 1} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

const TimelineItem = ({ phase, isLast }) => {
  return (
    <div
      className="relative flex gap-4 sm:gap-6 mb-6 last:mb-0 items-start group"
      aria-label={`${phase.label}: ${phase.title}`}
    >
      {/* Pulsing Phase Badge */}
      <div
        className="
          relative z-10 flex-shrink-0
          w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] rounded-full
          flex items-center justify-center
          font-black text-xs sm:text-sm text-cyan-300
          border border-cyan-500/50
          bg-[rgba(5,20,50,0.9)]
          transition-transform duration-300 group-hover:scale-110
        "
        style={{
          boxShadow: '0 0 18px rgba(56,189,248,0.4), inset 0 0 10px rgba(56,189,248,0.2)',
          fontFamily: "'Outfit', sans-serif",
        }}
        aria-hidden="true"
      >
        {phase.number}
      </div>

      <div className="flex-1 pb-2">
        <GlowCard className="w-full p-4 sm:p-6 transition-all duration-300">
          <p
            className="text-[11px] sm:text-xs text-cyan-400 font-semibold tracking-widest uppercase mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {phase.label}
          </p>

          <h3
            className="text-base sm:text-lg font-bold text-white mb-1.5 sm:mb-2 group-hover:text-cyan-200 transition-colors"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {phase.title}
          </h3>

          <p
            className="text-slate-400 text-xs sm:text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {phase.description}
          </p>
        </GlowCard>

        {!isLast && (
          <div className="flex justify-start pl-3 sm:pl-4 mt-2 mb-0" aria-hidden="true">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" className="animate-bounce">
              <path
                d="M7 0 L7 14 M2 9 L7 15 L12 9"
                stroke="rgba(56,189,248,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
