import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, Download, Cpu } from 'lucide-react';
import { navLinks, profile } from '../data/portfolio.js';
import ThemeToggle from './ThemeToggle.jsx';

/* ----------------------------------------------------------------
   Futuristic AI-inspired Navbar
   - Floating pill with glass morph
   - Cursor-follow glow behind glass
   - Geometric tech logo with animated circuit paths
   - Sliding pill indicator between links
   - Smooth entrance animation
   - Animated mobile menu
---------------------------------------------------------------- */

/* Abstract geometric logo - circuit-inspired emblem */
function TechLogo() {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center">
      {/* Animated glow ring */}
      <motion.span
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-violet-500 to-fuchsia-500
                   opacity-30 blur-md"
        animate={{ opacity: [0.25, 0.5, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Main emblem */}
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl
                       bg-gradient-to-br from-accent via-violet-600 to-fuchsia-600 shadow-lg overflow-hidden">
        {/* Circuit pattern overlay */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="absolute inset-0">
          {/* Hexagonal outline */}
          <path d="M22 5L36 13V31L22 39L8 31V13L22 5Z" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" fill="none" />
          {/* Inner circuit nodes */}
          <circle cx="22" cy="5" r="1.2" fill="rgba(255,255,255,0.45)" />
          <circle cx="36" cy="13" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="8" cy="13" r="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="22" cy="39" r="1" fill="rgba(255,255,255,0.25)" />
          {/* Cross wires */}
          <line x1="22" y1="5" x2="22" y2="16" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
          <line x1="22" y1="28" x2="22" y2="39" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
          <line x1="8" y1="13" x2="16" y2="22" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
          <line x1="36" y1="13" x2="28" y2="22" stroke="rgba(255,255,255,0.16)" strokeWidth="0.5" />
        </svg>
        <motion.span
          className="relative z-10 text-white"
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Cpu size={16} strokeWidth={2.2} />
        </motion.span>
      </span>
    </span>
  );
}

const TRAIL_PARTICLES = [
  { lag: 14, size: 8.5, color: 'rgba(186,230,253,0.95)', blur: 0.4, opacity: 0.48, spread: 0.5, scale: 1 },
  { lag: 27, size: 7.5, color: 'rgba(103,232,249,0.9)', blur: 0.7, opacity: 0.43, spread: 0.7, scale: 0.95 },
  { lag: 40, size: 6.8, color: 'rgba(56,189,248,0.86)', blur: 0.8, opacity: 0.38, spread: 1, scale: 0.9 },
  { lag: 55, size: 6.1, color: 'rgba(59,130,246,0.8)', blur: 1.1, opacity: 0.34, spread: 1.2, scale: 0.86 },
  { lag: 70, size: 5.5, color: 'rgba(99,102,241,0.76)', blur: 1.2, opacity: 0.3, spread: 1.45, scale: 0.82 },
  { lag: 86, size: 5, color: 'rgba(139,92,246,0.72)', blur: 1.5, opacity: 0.26, spread: 1.7, scale: 0.78 },
  { lag: 103, size: 4.6, color: 'rgba(168,85,247,0.68)', blur: 1.7, opacity: 0.22, spread: 1.95, scale: 0.74 },
  { lag: 122, size: 4.2, color: 'rgba(217,70,239,0.6)', blur: 1.9, opacity: 0.18, spread: 2.2, scale: 0.7 },
];

const DUST_PARTICLE_COUNT = 20;
const DUST_COLORS = [
  'rgba(186,230,253,0.25)',
  'rgba(125,211,252,0.22)',
  'rgba(129,140,248,0.2)',
  'rgba(196,181,253,0.2)',
  'rgba(255,255,255,0.2)',
];

function NavLink({ link, isActive, onHover }) {
  return (
    <a
      href={link.href}
      onMouseEnter={() => onHover(link.href)}
      className={`relative z-10 px-4 py-2 text-[14px] font-medium transition-colors duration-200
        ${isActive
          ? 'text-ink-900 dark:text-white'
          : 'text-ink-400 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white'
        }`}
    >
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navRef = useRef(null);
  const desktopNavRef = useRef(null);
  const indicatorRef = useRef(null);
  const orbitPathRef = useRef(null);
  const cometHeadRef = useRef(null);
  const cometTailRefs = useRef([]);
  const cometDustRefs = useRef([]);
  const hoveredRef = useRef(null);
  const scrolledRef = useRef(false);
  const [orbitSize, setOrbitSize] = useState({ w: 0, h: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const glowY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    scrolledRef.current = scrolled;
  }, [scrolled]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = navLinks.map((l) => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${sections[i]}`);
          return;
        }
      }
      setActive(null);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const node = navRef.current;
    if (!node) return;

    const updateOrbitSize = () => {
      const rect = node.getBoundingClientRect();
      setOrbitSize({ w: rect.width, h: rect.height });
    };

    updateOrbitSize();
    const observer = new ResizeObserver(updateOrbitSize);
    observer.observe(node);
    window.addEventListener('resize', updateOrbitSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOrbitSize);
    };
  }, []);

  const handleMouseMove = (e) => {
    const rect = navRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  // Sliding indicator
  useEffect(() => {
    const target = hovered || active;
    if (!target || !desktopNavRef.current) {
      if (indicatorRef.current) indicatorRef.current.style.opacity = '0';
      return;
    }
    const desktopNav = desktopNavRef.current;
    const link = desktopNav.querySelector(`a[href="${target}"]`);
    if (!link || !indicatorRef.current) return;
    const cRect = desktopNav.getBoundingClientRect();
    const lRect = link.getBoundingClientRect();
    indicatorRef.current.style.opacity = '1';
    indicatorRef.current.style.left = `${Math.round(lRect.left - cRect.left)}px`;
    indicatorRef.current.style.width = `${Math.round(lRect.width)}px`;
  }, [hovered, active]);

  // AI signal orbit: border-tracing comet with trailing energy tail.
  useEffect(() => {
    const pathEl = orbitPathRef.current;
    const headEl = cometHeadRef.current;
    if (!pathEl || !headEl) return;

    let raf;
    let last = performance.now();
    let distance = 0;

    const totalLength = pathEl.getTotalLength();
    if (!totalLength || Number.isNaN(totalLength)) return;

    const motionCycleMs = 7200;

    const wrapDistance = (d) => {
      let n = d;
      while (n < 0) n += totalLength;
      while (n >= totalLength) n -= totalLength;
      return n;
    };

    const getWaveEnvelope = (cycleT) => {
      if (cycleT < 0.32) return 0;
      if (cycleT < 0.72) {
        const p = (cycleT - 0.32) / 0.4;
        return Math.sin(p * Math.PI);
      }
      return 0;
    };

    const getPose = (d, now, waveScale, waveEnvelope) => {
      const point = pathEl.getPointAtLength(wrapDistance(d));
      const next = pathEl.getPointAtLength(wrapDistance(d + 2));

      const txRaw = next.x - point.x;
      const tyRaw = next.y - point.y;
      const tLen = Math.hypot(txRaw, tyRaw) || 1;
      const tx = txRaw / tLen;
      const ty = tyRaw / tLen;
      const nx = -ty;
      const ny = tx;

      const waveAmplitude = (4.5 + 1.5 * Math.sin(now * 0.0018 + 0.7)) * waveEnvelope * waveScale;
      const wave = Math.sin(now * 0.0105 + d * 0.033) * waveAmplitude;

      return {
        x: point.x + nx * wave,
        y: point.y + ny * wave,
        tx,
        ty,
        nx,
        ny,
      };
    };

    const loop = (now) => {
      const dt = Math.min(40, now - last);
      last = now;

      const cycleT = (now % motionCycleMs) / motionCycleMs;
      const waveEnvelope = getWaveEnvelope(cycleT);

      const organic = 1 + 0.12 * Math.sin(now * 0.0019) + 0.07 * Math.sin(now * 0.0011 + 1.7);
      const hoverSlow = hoveredRef.current ? 0.62 : 1;
      const scrollBoost = scrolledRef.current ? 1.12 : 1;
      const speed = 0.1 * organic * hoverSlow * scrollBoost * (1 + waveEnvelope * 0.12);

      distance = (distance + speed * dt) % totalLength;

      const headPose = getPose(distance, now, 1, waveEnvelope);
      const pulse = hoveredRef.current
        ? 1 + 0.2 * Math.sin(now * 0.01)
        : 1 + 0.05 * Math.sin(now * 0.007);

      headEl.style.transform = `translate(${headPose.x}px, ${headPose.y}px) translate(-50%, -50%) scale(${pulse})`;
      headEl.style.opacity = hoveredRef.current ? '1' : '0.92';

      const tailNodes = cometTailRefs.current;
      for (let i = 0; i < tailNodes.length; i++) {
        const node = tailNodes[i];
        if (!node) continue;

        const cfg = TRAIL_PARTICLES[i];
        const trailDistance = distance - cfg.lag;
        const pose = getPose(trailDistance, now - i * 14, 0.78, waveEnvelope);

        const spread = cfg.spread * waveEnvelope * Math.sin(now * 0.0065 + i * 1.35);
        const x = pose.x + pose.nx * spread;
        const y = pose.y + pose.ny * spread;

        const scale = Math.max(0.25, cfg.scale * (hoveredRef.current ? 1.05 : 1));
        node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = `${cfg.opacity}`;
      }

      const dustNodes = cometDustRefs.current;
      for (let i = 0; i < dustNodes.length; i++) {
        const node = dustNodes[i];
        if (!node) continue;

        const lag = 18 + i * 6;
        const dustDistance = distance - lag;
        const pose = getPose(dustDistance, now - i * 10, 0.55, waveEnvelope);

        const spreadStrength = 1.6 + (i % 5) * 0.7;
        const lateral = Math.sin(now * 0.0043 + i * 1.73) * spreadStrength * (1 + waveEnvelope * 1.4);
        const drag = i * 0.34;

        const x = pose.x - pose.tx * drag + pose.nx * lateral;
        const y = pose.y - pose.ty * drag + pose.ny * lateral;

        const fade = Math.max(0, 0.22 - i * 0.009);
        const opacity = fade * (0.72 + waveEnvelope * 0.35);
        const scale = 0.7 + (i % 3) * 0.16;

        node.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
        node.style.opacity = `${opacity}`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [orbitSize.w, orbitSize.h]);

  const currentHighlight = hovered || active;
  const inset = 2;
  const radius = 22;
  const innerW = Math.max(0, orbitSize.w - inset * 2);
  const innerH = Math.max(0, orbitSize.h - inset * 2);
  const pathD = innerW > 0 && innerH > 0
    ? `M ${inset + radius} ${inset}
       H ${inset + innerW - radius}
       Q ${inset + innerW} ${inset} ${inset + innerW} ${inset + radius}
       V ${inset + innerH - radius}
       Q ${inset + innerW} ${inset + innerH} ${inset + innerW - radius} ${inset + innerH}
       H ${inset + radius}
       Q ${inset} ${inset + innerH} ${inset} ${inset + innerH - radius}
       V ${inset + radius}
       Q ${inset} ${inset} ${inset + radius} ${inset}`
    : '';

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      <div
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        className={`relative flex w-full max-w-5xl items-center justify-between gap-2 rounded-3xl border px-4 py-3 transition-all duration-500
          ${scrolled
            ? 'border-ink-200/50 dark:border-white/[0.08] bg-white/75 dark:bg-ink-900/75 backdrop-blur-2xl shadow-lg shadow-ink-900/5 dark:shadow-black/30'
            : 'border-transparent bg-white/40 dark:bg-ink-900/40 backdrop-blur-xl'
          }`}
      >
        {/* Cursor-follow glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(200px circle at ${x}px ${y}px, rgba(31,111,235,0.12), transparent 65%)`
            ),
          }}
        />

        {/* AI signal orbit: comet traces navbar boundary with soft trail. */}
        {pathD && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-3xl">
            <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${orbitSize.w || 1} ${orbitSize.h || 1}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="aiSignalTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(56,189,248,0.0)" />
                  <stop offset="50%" stopColor="rgba(56,189,248,0.16)" />
                  <stop offset="100%" stopColor="rgba(168,85,247,0.0)" />
                </linearGradient>
              </defs>
              <path d={pathD} fill="none" stroke="url(#aiSignalTrack)" strokeWidth="1" />
              <path ref={orbitPathRef} d={pathD} fill="none" stroke="transparent" strokeWidth="1" />
            </svg>

            <div
              ref={cometHeadRef}
              className="absolute left-0 top-0 h-3 w-3 rounded-full
                         bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-400
                         shadow-[0_0_22px_4px_rgba(56,189,248,0.5),0_0_34px_8px_rgba(168,85,247,0.28)]"
              style={{ transform: 'translate(-9999px, -9999px)' }}
            />

            {TRAIL_PARTICLES.map((cfg, i) => (
              <div
                key={i}
                ref={(node) => { cometTailRefs.current[i] = node; }}
                className="absolute left-0 top-0 rounded-full"
                style={{
                  width: `${cfg.size}px`,
                  height: `${cfg.size}px`,
                  background: cfg.color,
                  filter: `blur(${cfg.blur}px)`,
                  transform: 'translate(-9999px, -9999px)',
                  opacity: 0,
                }}
              />
            ))}

            {Array.from({ length: DUST_PARTICLE_COUNT }).map((_, i) => (
              <div
                key={`dust-${i}`}
                ref={(node) => { cometDustRefs.current[i] = node; }}
                className="absolute left-0 top-0 rounded-full blur-[0.6px]"
                style={{
                  width: `${1 + (i % 4) * 0.3}px`,
                  height: `${1 + (i % 4) * 0.3}px`,
                  background: DUST_COLORS[i % DUST_COLORS.length],
                  transform: 'translate(-9999px, -9999px)',
                  opacity: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Logo */}
        <a href="#top" className="group relative flex shrink-0 items-center gap-3 pl-1 pr-4 font-display text-base font-semibold">
          <TechLogo />
          <span className="hidden sm:inline text-ink-800 dark:text-white tracking-tight">
            Shashank<span className="text-accent">.dev</span>
          </span>
        </a>

        <div className="hidden md:block h-7 w-px bg-ink-200/60 dark:bg-white/10 mx-2" />

        {/* Desktop links */}
        <nav ref={desktopNavRef} className="hidden md:flex items-center relative">
          <div
            ref={indicatorRef}
            className="absolute top-0 h-full rounded-2xl bg-ink-100/80 dark:bg-white/[0.07] transition-all duration-300 ease-out"
            style={{ opacity: 0 }}
          />
          {navLinks.map((l) => (
            <NavLink key={l.href} link={l} isActive={currentHighlight === l.href} onHover={setHovered} />
          ))}
        </nav>

        <div className="hidden md:block h-7 w-px bg-ink-200/60 dark:bg-white/10 mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <a
            href={profile.resumeUrl}
            download
            className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl px-4 py-2
                       text-[13px] font-medium text-ink-500 dark:text-ink-300
                       hover:text-accent hover:bg-accent/5 transition-all duration-200"
          >
            <Download size={14} /> Resume
          </a>
          <ThemeToggle />
          <button
            className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-xl
                       text-ink-500 dark:text-ink-300 hover:bg-ink-100/80 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl border border-ink-200/50
                       dark:border-white/[0.08] bg-white/90 dark:bg-ink-900/90 backdrop-blur-2xl
                       shadow-xl shadow-ink-900/10 dark:shadow-black/40 overflow-hidden"
          >
            <div className="flex flex-col p-2">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink-600 dark:text-ink-200
                             hover:bg-ink-100/70 dark:hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="mt-1 border-t border-ink-100 dark:border-white/10 pt-2">
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex items-center justify-center gap-2 rounded-xl bg-ink-900 dark:bg-white
                             text-white dark:text-ink-900 py-2.5 text-sm font-medium"
                >
                  <Download size={14} /> Download Resume
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
