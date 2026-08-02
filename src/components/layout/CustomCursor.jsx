'use client';

import { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function CustomCursor() {
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    if (!isFinePointer) return undefined;

    document.body.classList.add('has-custom-cursor');

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const ringLabel = ring?.querySelector('.cursor-label');
    if (!dot || !ring || !ringLabel) return undefined;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId = null;
    let activeTarget = null;

    const onMove = (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    const animateRing = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animateRing);
    };

    const setHover = (target) => {
      if (activeTarget === target) return;
      activeTarget = target;
      if (!target) {
        document.body.classList.remove('cursor-hover-card', 'cursor-hover-play');
        return;
      }
      const type = target.getAttribute('data-cursor');
      document.body.classList.add(type === 'play' ? 'cursor-hover-play' : 'cursor-hover-card');
      document.body.classList.remove(type === 'play' ? 'cursor-hover-card' : 'cursor-hover-play');
      ringLabel.textContent = type === 'play' ? 'Play' : 'View';
    };

    const onPointerOver = (event) => {
      const target = event.target.closest('[data-cursor]');
      setHover(target);
    };

    const onPointerOut = (event) => {
      const related = event.relatedTarget?.closest?.('[data-cursor]');
      if (!related) setHover(null);
    };

    document.addEventListener('pointerover', onPointerOver);
    document.addEventListener('pointerout', onPointerOut);
    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove('has-custom-cursor', 'cursor-hover-card', 'cursor-hover-play');
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('mousemove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      <div className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">View</span>
      </div>
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
