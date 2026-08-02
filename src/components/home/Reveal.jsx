'use client';

import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils/cn';

/**
 * Fades/slides content in once it scrolls into view. Respects
 * prefers-reduced-motion by rendering visible immediately.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'in-view translate-y-0 opacity-100' : 'translate-y-9 opacity-0',
        className
      )}
    >
      {children}
    </Tag>
  );
}

Reveal.propTypes = {
  as: PropTypes.elementType,
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};
