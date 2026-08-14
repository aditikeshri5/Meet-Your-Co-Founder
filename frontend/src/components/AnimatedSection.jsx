/**
 * AnimatedSection.jsx
 * Scroll-triggered reveal using Framer Motion's whileInView.
 */

import { motion } from 'framer-motion';

const animations = {
  'fade-in-up': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  'zoom-in': {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
}) => {
  const variant = animations[animation] || animations['fade-in-up'];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variant}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
