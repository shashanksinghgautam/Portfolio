import { useState, useEffect, useMemo } from 'react';

/**
 * Detects device capability and returns performance tier.
 * - 'low': mobile/tablet or prefers-reduced-motion
 * - 'high': desktop with fine pointer
 */
function getPerformanceTier() {
  if (typeof window === 'undefined') return 'high';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 'low';

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.innerWidth < 768;
  const isMidRange = window.innerWidth < 1024;

  if (isCoarse || isNarrow) return 'low';
  if (isMidRange) return 'low';

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
