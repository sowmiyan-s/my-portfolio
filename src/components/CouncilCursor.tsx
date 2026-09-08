import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface CouncilCursorProps {
  size?: number; // Display size in px (default 38)
}

const CouncilCursor: React.FC<CouncilCursorProps> = ({ size = 38 }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Hotspot ratio from original 128x128 frame: tip is at (2, 0)
  const hotspotX = Math.round(size * (2 / 128));
  const hotspotY = 0;

  // Enable only on desktop devices with fine pointer (no touch/mobile)
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hasNoHover = window.matchMedia('(hover: none)').matches;
    const isSmallScreen = window.innerWidth <= 1024;
    const mobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
      navigator.userAgent.toLowerCase()
    );
    return (
      !isCoarse &&
      !hasNoHover &&
      !mobileUA &&
      !(hasTouch && isSmallScreen) &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    );
  });

  useEffect(() => {
    const checkMedia = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const hasNoHover = window.matchMedia('(hover: none)').matches;
      const isSmall = window.innerWidth <= 1024;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setEnabled(!isCoarse && !hasNoHover && !(hasTouch && isSmall) && isSmall === false);
    };

    window.addEventListener('resize', checkMedia, { passive: true });
    return () => window.removeEventListener('resize', checkMedia);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = -100;
    let mouseY = -100;
    let rafId: number | null = null;

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX - hotspotX}px, ${mouseY - hotspotY}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest(
          'a, button, [role="button"], input, select, textarea, .cursor-pointer, .clickable, .group, [data-cursor-target]'
        )
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const spark: Spark = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setSparks((prev) => [...prev.slice(-4), spark]);

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== spark.id));
      }, 450);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, hotspotX, hotspotY, isVisible]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999999] overflow-hidden select-none">
      {/* Click crisp white ripple (no glow) */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{ left: spark.x, top: spark.y }}
        >
          {/* Clean white expanding ring without glow, shadow, or blur */}
          <div className="w-8 h-8 -ml-4 -mt-4 rounded-full border border-white/80 cursor-click-ripple" />
        </div>
      ))}

      {/* Main Animated Cursor Arrow */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.15s ease-out',
        }}
      >
        <div
          className="relative transition-transform duration-150 ease-out origin-top-left"
          style={{
            transform: isClicking
              ? 'scale(0.9) rotate(-3deg)'
              : isHovering
              ? 'scale(1.12) rotate(2deg)'
              : 'scale(1) rotate(0deg)',
            filter: 'none',
          }}
        >
          <img
            src="/cursor/angry-cursor.png"
            alt="Angry Internet Explorer Cursor"
            width={size}
            height={size}
            className="block select-none pointer-events-none"
            draggable={false}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              objectFit: 'contain',
              imageRendering: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const AngryCursor = CouncilCursor;
export default CouncilCursor;
