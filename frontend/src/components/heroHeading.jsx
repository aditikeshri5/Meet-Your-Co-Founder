/**
 * heroHeading.jsx — Reduced glow intensity on the hero heading
 ─────────────────────────────
 */

const HeroHeading = () => {
  return (
    <div
      className="relative text-center select-none max-w-full px-2 py-4"
      role="heading"
      aria-level={1}
      aria-label="Meet Your Co-Founder"
    >
      {/* ── SVG Flame & Motion Distortion Filter ──────────────────── */}
      <svg width="0" height="0" className="absolute top-0 left-0" aria-hidden="true">
        <defs>
          {/* Organic flame wavering filter */}
          <filter id="blue-flame-motion" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.05"
              numOctaves="3"
              seed="5"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.02 0.05; 0.035 0.08; 0.02 0.05"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Displace text edges into organic flames */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedText"
            />

            {/* Softer Cyan Bloom Glow (reduced stdDeviation) */}
            <feGaussianBlur in="displacedText" stdDeviation="1.8" result="cyanGlow" />
            <feColorMatrix
              in="cyanGlow"
              type="matrix"
              values="
                0 0 0 0 0.05
                0 0.6 0 0 0.6
                0 0 0.9 0 0.85
                0 0 0 0.75 0
              "
              result="cyanFlameColor"
            />

            {/* Composite cyan glow behind displaced main text */}
            <feMerge>
              <feMergeNode in="cyanFlameColor" />
              <feMergeNode in="displacedText" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Line 1: MEET YOUR ─────────────────────────────────────── */}
      <div className="relative inline-block">
        {/* Motion trail — reduced blur & opacity */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            color: '#286e77',
            opacity: 0.35,
            transform: 'translate(-6px, 10px) skewX(-12deg) scale(0.98)',
            filter: 'blur(7px) drop-shadow(-10px 18px 24px rgba(92, 192, 235, 0.45))',
          }}
        >
          MEET YOUR
        </span>

        {/* Core Text */}
        <span
          className="relative block leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            color: '#ffffff',
            filter: 'url(#blue-flame-motion)',
            textShadow: `
              0 0 8px rgba(255, 255, 255, 0.75),
              0 0 16px rgba(56, 189, 248, 0.55),
              0 0 30px rgba(56, 189, 248, 0.35),
              -4px 6px 14px rgba(14, 165, 233, 0.3)
            `,
          }}
        >
          MEET YOUR
        </span>
      </div>

      {/* ── Line 2: CO-FOUNDER ────────────────────────────────────── */}
      <div className="relative inline-block block mt-1 sm:mt-2">
        {/* Motion trail — reduced blur & opacity */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            color: '#89cedabd',
            opacity: 0.35,
            transform: 'translate(-6px, 10px) skewX(-12deg) scale(0.98)',
            filter: 'blur(7px) drop-shadow(-10px 18px 24px rgba(6, 181, 212, 0.4))',
          }}
        >
          CO-FOUNDER
        </span>

        {/* Core Text */}
        <span
          className="relative block leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            background: 'linear-gradient(135deg, #97bbd3 0%, #38bdf8 40%, #067d92ee 70%, #035063 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'url(#blue-flame-motion)',
          }}
        >
          CO-FOUNDER
        </span>
      </div>
    </div>
  );
};

export default HeroHeading;
