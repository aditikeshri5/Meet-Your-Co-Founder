/**
 * AnimatedSection.jsx
 */

import { useState, useEffect, useRef } from 'react';

const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-in-up', // 'fade-in-up' | 'zoom-in'
  delay = 0, // delay in ms
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const animClass = animation === 'zoom-in' ? 'animate-zoom-in' : 'animate-fade-in-up';

  return (
    <div
      ref={domRef}
      className={`transition-opacity duration-700 ${isVisible ? animClass : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
