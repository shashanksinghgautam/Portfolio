import { useRef, useEffect, useCallback, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useDevicePerformance.js';

/* ================================================================
   BACKGROUND SYSTEM - Performance-optimized
   Desktop: Full particle field + aurora + geometry + grid
   Mobile/Tablet: Static gradient blobs only (no canvas, no parallax)
================================================================ */

// --- Layer: Interactive Particle Field (DESKTOP ONLY) ---
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;

    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 110;
    const MOUSE_RADIUS = 200;
    const REPEL_STRENGTH = 0.07;
    const ATTRACT_STRENGTH = 0.01;
    const particles = [];

    const mouse = { x: -9999, y: -9999, active: false };
    const smoothMouse = { x: -9999, y: -9999 };

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        particles.push({
          x: ox, y: oy, ox, oy,
          r: Math.random() * 2 + 0.4,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.01 + 0.003,
          vx: 0, vy: 0,
          colorIdx: Math.floor(Math.random() * 3),
        });
      }
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onMouseLeave() { mouse.active = false; }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = themeRef.current === 'dark';

      if (mouse.active) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.1;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.1;
      } else {
        smoothMouse.x += (-9999 - smoothMouse.x) * 0.02;
        smoothMouse.y += (-9999 - smoothMouse.y) * 0.02;
      }

      const mx = smoothMouse.x;
      const my = smoothMouse.y;

      const colors = isDark
        ? [[0, 229, 160], [34, 211, 238], [167, 139, 250]]
        : [[14, 165, 233], [16, 185, 129], [139, 92, 246]];

      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const force = (1 - dist / MOUSE_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        p.vx += (p.ox - p.x) * ATTRACT_STRENGTH;
        p.vy += (p.oy - p.y) * ATTRACT_STRENGTH;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.x += p.vx + p.dx;
        p.y += p.vy + p.dy;
        if (p.x < -30) { p.x = w + 30; p.ox = p.x; }
        if (p.x > w + 30) { p.x = -30; p.ox = p.x; }
        if (p.y < -30) { p.y = h + 30; p.oy = p.y; }
        if (p.y > h + 30) { p.y = -30; p.oy = p.y; }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const dd = ddx * ddx + ddy * ddy;
          if (dd < CONNECTION_DIST * CONNECTION_DIST) {
            const ratio = 1 - Math.sqrt(dd) / CONNECTION_DIST;
            const opacity = ratio * (isDark ? 0.25 : 0.12);
            const c = colors[a.colorIdx];
            ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + opacity + ')';
            ctx.lineWidth = ratio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const glow = 0.5 + 0.5 * Math.sin(p.pulse);
        const size = p.r * (0.85 + glow * 0.4);
        const opacity = isDark ? (0.5 + glow * 0.4) : (0.3 + glow * 0.25);
        const c = colors[p.colorIdx];
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + opacity + ')';
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    window.addEventListener('resize', function() { resize(); seed(); });
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return function() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(function() { return init(); }, [init]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
  );
}

// --- Layer: Aurora Blobs ---
function AuroraLayer({ isMobile }) {
  const { scrollYProgress } = useScroll();
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 0.8]);
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[400px] w-[400px]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1)_0%,rgba(52,211,153,0.05)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.08)_0%,rgba(34,211,238,0.04)_40%,transparent_70%)] blur-[30px]" />
        </div>
        <div className="absolute top-[40%] -right-[15%] h-[350px] w-[350px]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.07)_0%,rgba(59,130,246,0.04)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.05)_0%,rgba(34,211,238,0.03)_40%,transparent_70%)] blur-[30px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{ rotate: rotate1, scale: scale1, y: y1 }}
        className="absolute -top-[25%] -left-[15%] h-[800px] w-[800px]"
      >
        <div className="h-full w-full rounded-full animate-morph-1 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.16)_0%,rgba(52,211,153,0.09)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.14)_0%,rgba(34,211,238,0.07)_40%,transparent_70%)] blur-[80px]" />
      </motion.div>

      <div className="absolute top-[25%] -right-[20%] h-[700px] w-[700px]">
        <div className="h-full w-full rounded-full animate-morph-2 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,rgba(59,130,246,0.07)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.1)_0%,rgba(34,211,238,0.05)_40%,transparent_70%)] blur-[100px]" />
      </div>

      <div className="absolute top-[8%] right-[15%] h-[450px] w-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08)_0%,transparent_60%)] dark:bg-transparent blur-[80px] animate-pulse-slow" />
    </div>
  );
}

// --- Layer: Floating Geometric Shapes (DESKTOP ONLY) ---
function GeometricShapes() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [45, -90]);

  return (
    <div className="absolute inset-0">
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[12%] left-[6%] h-16 w-16 border border-accent/20 dark:border-accent/10 rounded-lg animate-float"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[42%] right-[10%] h-20 w-20 border border-glow-cyan/15 dark:border-glow-cyan/10 rounded-full animate-float [animation-delay:1s]"
      />
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute top-[22%] right-[22%] h-3 w-3 bg-accent/20 dark:bg-accent/10 rounded-full animate-pulse-slow"
      />
    </div>
  );
}

// --- Layer: Perspective Grid (DESKTOP ONLY) ---
function PerspectiveGrid() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, 78]);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1000px' }}>
      <motion.div
        style={{ rotateX }}
        className="absolute bottom-0 left-[-25%] right-[-25%] h-[45vh] origin-bottom"
      >
        <div className="h-full w-full opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
          }}
        />
      </motion.div>
    </div>
  );
}

// --- Main Export ---
function BackgroundDecor() {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const disableHeavy = isMobile || reducedMotion;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-base" />

      <div
        className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] md:opacity-[0.12] md:dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.6px, transparent 0.6px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      <AuroraLayer isMobile={disableHeavy} />

      {!disableHeavy && (
        <>
          <GeometricShapes />
          <div className="pointer-events-auto">
            <ParticleCanvas />
          </div>
          <PerspectiveGrid />
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}

export default memo(BackgroundDecor);
