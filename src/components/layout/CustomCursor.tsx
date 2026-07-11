import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { lerp, isReducedMotion } from '../../lib/motion';

type CursorStateType = 'default' | 'pointer' | 'view' | 'drag' | 'play';

export const CustomCursor: React.FC = () => {
  const { language } = useLanguage();
  const [cursorState, setCursorState] = useState<CursorStateType>('default');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // অ্যাক্সেসিবিলিটি ট্র্যাকিং এবং টাচ ডিভাইস ফিল্টারেশন
    const isTouchDevice = 
      typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);

    if (isTouchDevice || isReducedMotion()) {
      return;
    }

    setIsMounted(true);

    // সিস্টেম কার্সার হাইড করার জন্য ডাইনামিক স্টাইল শিট তৈরি করা হচ্ছে
    const systemCursorStyle = document.createElement('style');
    systemCursorStyle.id = 'metafore-hide-system-cursor';
    systemCursorStyle.innerHTML = `
      body, a, button, input, select, textarea, [role="button"], .cursor-pointer {
        cursor: none !important;
      }
    `;
    document.head.appendChild(systemCursorStyle);

    // মাউস কো-অর্ডিনেট ট্র্যাকিং
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    // গ্লোবাল হোভার স্টেট মনিটরিং
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const hoverTarget = target.closest('[data-cursor], a, button, [role="button"], .cursor-pointer');
      if (hoverTarget) {
        const customState = hoverTarget.getAttribute('data-cursor') as CursorStateType;
        if (customState) {
          setCursorState(customState);
        } else {
          setCursorState('pointer');
        }
      } else {
        setCursorState('default');
      }
    };

    const renderLoop = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot && ring) {
        // ডট তুলনামূলক দ্রুত এবং রিংটি সামান্য ল্যাগ ফিল নিয়ে মাউস অনুসরণ করে
        dotPos.current.x = lerp(dotPos.current.x, mousePos.current.x, 0.28);
        dotPos.current.y = lerp(dotPos.current.y, mousePos.current.y, 0.28);

        ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.12);
        ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.12);

        dot.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    rafId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      
      const el = document.getElementById('metafore-hide-system-cursor');
      if (el) el.remove();
    };
  }, []);

  if (!isMounted) return null;

  // কার্সারের ভাষাভিত্তিক টেক্সট লেবেল
  const getLabel = (): string => {
    if (cursorState === 'view') return language === 'en' ? 'VIEW' : 'দেখুন';
    if (cursorState === 'drag') return language === 'en' ? 'DRAG' : 'টানুন';
    if (cursorState === 'play') return language === 'en' ? 'PLAY' : 'প্লে';
    return '';
  };

  const isTextState = ['view', 'drag', 'play'].includes(cursorState);

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden mix-blend-difference">
      {/* ১. সেন্ট্রাল ডট কার্সার */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-[#168BFF] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
          isTextState ? 'scale-0' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* ২. মাউস ট্রেইল রিং */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-out ${
          cursorState === 'default'
            ? 'w-10 h-10 border border-[#168BFF]'
            : cursorState === 'pointer'
            ? 'w-16 h-16 border border-[#168BFF] bg-[#168BFF]/10'
            : 'w-20 h-20 border-none bg-[#168BFF] text-white'
        }`}
        style={{ willChange: 'transform, width, height, background-color' }}
      >
        {/* ৩. টেক্সট মাস্ক লেবেল */}
        {isTextState && (
          <span className="text-[10px] font-mono tracking-wider font-extrabold text-[#071426] select-none uppercase animate-[pulse_1.5s_infinite]">
            {getLabel()}
          </span>
        )}
      </div>
    </div>
  );
};