"use client";
import React, { useMemo, useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import 'lenis/dist/lenis.css';


const SmoothScroll = ({ children, root = true, className = '' }) => {
  const lenisOptions = useMemo(() => ({
    lerp: 0.3,
    duration: 1.7,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    orientation: 'vertical',
    gestureDirection: 'vertical',
    infinite: false,
  }), []);

  return (
    <ReactLenis root={root} options={lenisOptions} className={className}>
      <LenisRouteReset>
        {children}
      </LenisRouteReset>
    </ReactLenis>
  );
};

export default SmoothScroll;

function LenisRouteReset({ children }) {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;
    // scroll instantly to top on route change to avoid preserved scroll position
    try {
      if (typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(0, { immediate: true });
      } else if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    } catch (e) {
      // fallback
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }
  }, [lenis, pathname]);

  return <>{children}</>;
}