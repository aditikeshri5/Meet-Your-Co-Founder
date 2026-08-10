/**
 * heroSubheading.jsx
 
 * ──────────────────────────────────────────────────────────────────
 */

const WORDS = ['network', 'collaborate', 'pitch'];

const HeroSubheading = () => {
  return (
    <p
      className="flex items-center gap-2 sm:gap-3 text-center justify-center flex-wrap"
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(0.9rem, 3.5vw, 1.4rem)',
        letterSpacing: '0.2em',
        fontWeight: 300,
        color: 'rgba(255,255,255,0.75)',
      }}
    >
      {WORDS.map((word, i) => (
        <span key={word} className="flex items-center gap-2 sm:gap-3">
          <span
            className="glow-word"
            style={{
              animationDelay: `${1 + i * 1}s`,
              animationDuration: `${WORDS.length * 1}s`,
            }}
          >
            {word}
          </span>
          {i < WORDS.length - 1 && (
            <span className="text-cyan-600 opacity-60" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </p>
  );
};

export default HeroSubheading;
