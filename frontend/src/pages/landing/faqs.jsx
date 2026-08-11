/**
 * faqs.jsx
 
 * ──────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import GlowCard from '../../components/card';
import AnimatedSection from '../../components/AnimatedSection';

const FAQS = [
  {
    id: 'faq-1',
    question: 'Who can attend Meet Your Co-Founder?',
    answer:
      "The event is open to all students — whether you're a first-year exploring entrepreneurship or a final-year with a fully formed idea. The only requirement is a genuine interest in building something.",
  },
  {
    id: 'faq-2',
    question: 'Do I need a startup idea to participate?',
    answer:
      'Not at all! Many attendees come with no idea at all. The event is designed to help you find someone to think with, not just someone to join your existing plan.',
  },
  {
    id: 'faq-3',
    question: 'How long is the event?',
    answer:
      'The event runs for approximately 3 hours across five structured phases — from speed matching to pitches and a closing ceremony.',
  },
  {
    id: 'faq-4',
    question: 'Do I need a team before registering?',
    answer:
      "No — that's the whole point! You register individually and find your co-founder during the event through our structured matching process.",
  },
  {
    id: 'faq-5',
    question: 'Is there a registration fee?',
    answer:
      'Details on registration and any fees will be communicated closer to the event date. Register now to secure your spot and stay updated.',
  },
  {
    id: 'faq-6',
    question: 'What should I bring or prepare?',
    answer:
      'Just yourself and an open mind. No presentations or documents required. If you have rough ideas, feel free to mentally prepare them — but the most important thing is to show up ready to engage.',
  },
];

const FAQs = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <section
      id="faqs"
      aria-labelledby="faqs-heading"
      className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-32 flex flex-col items-center pb-28 sm:pb-32"
    >
      {/* Animated Heading & Glowing Underline */}
      <AnimatedSection animation="fade-in-up" delay={100}>
        <h2
          id="faqs-heading"
          className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tight mb-12 sm:mb-16 text-white text-center"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          FAQs
          <span
            className="block mt-2 mx-auto rounded-full h-1 w-16 sm:w-20 title-underline-glow"
            style={{
              background: 'linear-gradient(to right, transparent, #38bdf8, transparent)',
              boxShadow: '0 0 14px rgba(56,189,248,0.8)',
            }}
            aria-hidden="true"
          />
        </h2>
      </AnimatedSection>

      <div
        className="w-full max-w-2xl flex flex-col gap-3"
        role="list"
        aria-label="Frequently asked questions"
      >
        {FAQS.map((faq, index) => (
          <AnimatedSection key={faq.id} animation="fade-in-up" delay={index * 90}>
            <FAQItem
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggle(faq.id)}
            />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};

const FAQItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div role="listitem">
      <GlowCard
        glowActive={isOpen}
        className={`
          cursor-pointer transition-all duration-300 p-4 sm:p-6
          ${isOpen ? 'border-cyan-500/40 shadow-[0_0_25px_rgba(56,189,248,0.25)]' : 'border-transparent hover:border-cyan-900/40'}
        `}
      >
        <button
          id={`${faq.id}-trigger`}
          className="
            w-full flex items-center justify-between text-left
            gap-3 sm:gap-4 p-0 bg-transparent border-none cursor-pointer
          "
          aria-expanded={isOpen}
          aria-controls={`${faq.id}-answer`}
          onClick={onToggle}
        >
          <span
            className="font-semibold text-sm sm:text-base md:text-lg text-white pr-2 hover:text-cyan-200 transition-colors"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {faq.question}
          </span>

          <span
            className={`
              flex-shrink-0 text-cyan-400 transition-transform duration-300
              ${isOpen ? 'rotate-45 text-cyan-300' : 'rotate-0'}
            `}
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </span>
        </button>

        <div
          id={`${faq.id}-answer`}
          role="region"
          aria-labelledby={`${faq.id}-trigger`}
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isOpen ? '250px' : '0px', opacity: isOpen ? 1 : 0 }}
        >
          <p
            className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-3 sm:pt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {faq.answer}
          </p>
        </div>
      </GlowCard>
    </div>
  );
};

export default FAQs;
