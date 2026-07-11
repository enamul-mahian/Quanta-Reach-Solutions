import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// উইন্ডো অবজেক্টের উপস্থিতি পরীক্ষা করে GSAP ScrollTrigger প্লাগইন রেজিস্টার করা হচ্ছে
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * METAFORE TECHNOLOGIES - MOTION DESIGN TOKENS
 */
export const EASING = {
  premiumSmooth: 'cubic-bezier(0.76, 0, 0.24, 1)',
  strongReveal: 'cubic-bezier(0.16, 1, 0.3, 1)',
  softSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  quickHover: 'cubic-bezier(0.25, 1, 0.5, 1)',
  gsapPremium: 'power4.inOut',
  gsapReveal: 'power4.out',
  gsapSpring: 'back.out(1.4)',
};

export const DURATION = {
  micro: 0.25,
  button: 0.45,
  reveal: 0.85,
  transition: 1.1,
  hero: 2.2,
};

/**
 * MATHEMATICAL PHYSICS UTILITIES
 */
export const lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
};

export const clamp = (val: number, min: number, max: number): number => {
  return Math.max(min, Math.min(val, max));
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * UNICODE-SAFE BILINGUAL SPLIT TEXT ENGINE
 */
export interface SplitTextData {
  original: string;
  items: string[];
  type: 'chars' | 'words' | 'lines';
}

export const splitTextBilingual = (
  text: string,
  mode: 'chars' | 'words' | 'lines' = 'words',
  lang: 'en' | 'bn' = 'en'
): SplitTextData => {
  if (!text) return { original: '', items: [], type: mode };

  if (mode === 'lines') {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    return { original: text, items: lines, type: 'lines' };
  }

  if (mode === 'words') {
    const words = text.split(/\s+/).filter(Boolean);
    return { original: text, items: words, type: 'words' };
  }

  let items: string[] = [];

  if (lang === 'bn') {
    const IntlObj = Intl as any;
    if (typeof IntlObj !== 'undefined' && 'Segmenter' in IntlObj) {
      try {
        const segmenter = new IntlObj.Segmenter('bn', { granularity: 'grapheme' });
        items = Array.from(segmenter.segment(text)).map((seg: any) => seg.segment);
      } catch (e) {
        items = text.split(/\s+/).filter(Boolean);
      }
    } else {
      items = text.split(/\s+/).filter(Boolean);
    }
  } else {
    items = text.split('');
  }

  return { original: text, items, type: 'chars' };
};

/**
 * REACT INTERACTION HOOKS
 * GENERIC MAGNETIC HOOK: এটি বাটন বা অন্য যেকোনো এলিমেন্টের টাইপ সাপোর্ট করবে
 */
export const useMagnetic = <T extends HTMLElement>(strength = 0.35, easeStrength = 0.15) => {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    if (isReducedMotion()) return;

    const el = elementRef.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      targetX = dx * strength;
      targetY = dy * strength;
    };

    const loop = () => {
      currentX = lerp(currentX, targetX, easeStrength);
      currentY = lerp(currentY, targetY, easeStrength);
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        rafId = requestAnimationFrame(loop);
      } else {
        el.style.transform = 'translate3d(0px, 0px, 0px)';
      }
    };

    const handleMouseEnter = () => {
      isHovered = true;
      cancelAnimationFrame(rafId);
      loop();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [strength, easeStrength]);

  return elementRef;
};