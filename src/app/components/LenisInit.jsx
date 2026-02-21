"use client";
import React, { useMemo } from 'react';
import { ReactLenis } from 'lenis/react';
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
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;