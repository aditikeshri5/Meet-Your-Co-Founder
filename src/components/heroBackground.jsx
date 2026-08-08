/**
 * heroBackground.jsx
 
 * ──────────────────────────────────────────────────────────────────
 */

import Galaxy from './Galaxy';

const HeroBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom, #001a1f 0%, #000a2e 40%, #000008 80%, #000000 100%)',
      }}
    >
      <Galaxy
        starSpeed={0.2}
        density={0.5}
        hueShift={125}
        speed={0.4}
        glowIntensity={0.15}
        saturation={0.1}
        mouseRepulsion={false}
        repulsionStrength={1}
        twinkleIntensity={0.3}
        rotationSpeed={0.1}
        transparent
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default HeroBackground;
