/**
 * card.jsx
 * ──────────────────────────────────────────────────────────────────
 */

const GlowCard = ({ children, className = '', glowActive = true }) => {
  return (
    <div
      className={`
        relative rounded-2xl p-6
        bg-[rgba(5,15,40,0.55)]
        backdrop-blur-xl
        border border-transparent
        ${glowActive ? 'glow-card' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlowCard;
