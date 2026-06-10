import { useState, useEffect } from 'react';

/**
 * Detects device capability and returns performance tier.
 * - 'low': small-screen mobile/tablet (narrow + touch)
 * - 'high': laptop/desktop (any screen with fine pointer, or wide screens)
 */
function getPerformanceTier() {
  if (typeof window === 'undefined') return 'high';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 'low';

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 768;

  // Only mark as low if BOTH touch device AND small screen
  // This preserves full animations on laptops, desktops, and large tablets
  if (isCoarse && isNarrow) return 'low';

  // Small screen without touch (unlikely but safe)
  if (isNarrow) return 'low';

  return 'high';
}

export function useDevicePerformance() {
  const [tier, setTier] = useState(getPerformanceTier);

  useEffect(() => {
    const handleResize = () => setTier(getPerformanceTier());
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotion = () => setTier(getPerformanceTier());

    window.addEventListener('resize', handleResize);
    mql.addEventListener('change', handleMotion);
    return () => {
      window.removeEventListener('resize', handleResize);
      mql.removeEventListener('change', handleMotion);
    };
  }, []);

  return tier;
}

export function useIsMobile() {
  const tier = useDevicePerformance();
  return tier === 'low';
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}
