/**
 * heroHeading.jsx
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
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedText"
            />

            {/* Electric Cyan Bloom Glow */}
            <feGaussianBlur in="displacedText" stdDeviation="2.5" result="cyanGlow" />
            <feColorMatrix
              in="cyanGlow"
              type="matrix"
              values="
                0 0 0 0 0.1
                0 0.8 0 0 0.7
                0 0 1 0 0.95
                0 0 0 1 0
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

      {/* ── Line 1: MEET YOUR (White core + Cyan Flame Streak) ─────── */}
      <div className="relative inline-block">
        {/* Motion trail shadow (renders blue flame streak extending down-left) */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            color: '#286e77',
            opacity: 0.65,
            transform: 'translate(-8px, 12px) skewX(-12deg) scale(0.98)',
            filter: 'blur(10px) drop-shadow(-15px 25px 35px rgba(92, 192, 235, 0.8))',
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
              0 0 10px rgba(255, 255, 255, 0.9),
              0 0 20px rgba(56, 189, 248, 0.9),
              0 0 40px rgba(56, 189, 248, 0.7),
              -6px 8px 18px rgba(14, 165, 233, 0.6),
              -12px 16px 30px rgba(6, 182, 212, 0.4)
            `,
          }}
        >
          MEET YOUR
        </span>
      </div>

      {/* ── Line 2: CO-FOUNDER (Light Blue → Teal Gradient + Cyan Flame Streak) ── */}
      <div className="relative inline-block block mt-1 sm:mt-2">
        {/* Motion trail shadow */}
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none leading-[0.95] font-black italic tracking-tighter"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.5rem, 9.5vw, 6.8rem)',
            color: '#89cedabd',
            opacity: 0.65,
            transform: 'translate(-8px, 12px) skewX(-12deg) scale(0.98)',
            filter: 'blur(10px) drop-shadow(-15px 25px 35px rgba(6, 181, 212, 0.7))',
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
            dropShadow: '0 0 25px rgba(56, 189, 248, 0.8)',
          }}
        >
          CO-FOUNDER
        </span>
      </div>
    </div>
  );
};

export default HeroHeading;
