import { useRef, useEffect, useCallback, memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useDevicePerformance.js';

/* ================================================================
   IMMERSIVE MULTI-LAYER BACKGROUND SYSTEM
   ================================================================
   - Responsive particle count: Desktop 120, Tablet 50, Mobile 0
   - Connection distance scales with viewport
   - Aurora blobs simplified for small screens
   - Geometric shapes hidden below 768px
   - Perspective grid hidden below 768px
   - Full animations preserved for laptop/desktop
================================================================ */

// Helper: get responsive particle settings based on viewport width
function getParticleSettings() {
  const w = window.innerWidth;
  if (w >= 1200) return { count: 120, connectionDist: 130, mouseRadius: 260 };
  if (w >= 1024) return { count: 90, connectionDist: 120, mouseRadius: 220 };
  if (w >= 768)  return { count: 50, connectionDist: 100, mouseRadius: 180 };
  return { count: 0, connectionDist: 0, mouseRadius: 0 }; // Mobile: no canvas
}

// --- Layer: Interactive Particle Field ---
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
    let settings = getParticleSettings();

    const REPEL_STRENGTH = 0.09;
    const ATTRACT_STRENGTH = 0.012;
    const particles = [];
    const ripples = [];

    const mouse = { x: -9999, y: -9999, active: false };
    const smoothMouse = { x: -9999, y: -9999 };
    const trail = [];
    const TRAIL_LEN = 12;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      settings = getParticleSettings();
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < settings.count; i++) {
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        particles.push({
          x: ox, y: oy, ox, oy,
          r: Math.random() * 2.2 + 0.4,
          dx: (Math.random() - 0.5) * 0.25,
          dy: (Math.random() - 0.5) * 0.25,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.012 + 0.004,
          vx: 0, vy: 0,
          colorIdx: Math.floor(Math.random() * 3),
        });
      }
    }

    function addRipple(x, y) {
      ripples.push({ x, y, radius: 0, maxRadius: 350, alpha: 0.7, speed: 5 });
      ripples.push({ x, y, radius: 0, maxRadius: 200, alpha: 0.4, speed: 3 });
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onMouseLeave() { mouse.active = false; }
    function onClick(e) {
      addRipple(e.clientX, e.clientY);
      for (const p of particles) {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 1) {
          const force = (1 - dist / 250) * 4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      if (settings.count === 0) { raf = requestAnimationFrame(draw); return; }
      const isDark = themeRef.current === 'dark';
      const CONN_DIST = settings.connectionDist;
      const MOUSE_RAD = settings.mouseRadius;

      // Smooth mouse
      if (mouse.active) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.12;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.12;
      } else {
        smoothMouse.x += (-9999 - smoothMouse.x) * 0.02;
        smoothMouse.y += (-9999 - smoothMouse.y) * 0.02;
      }

      const mx = smoothMouse.x;
      const my = smoothMouse.y;

      // Track mouse trail
      if (mouse.active) {
        trail.push({ x: mx, y: my });
        if (trail.length > TRAIL_LEN) trail.shift();
      }

      // Colors per theme
      const colors = isDark
        ? [[0, 229, 160], [34, 211, 238], [167, 139, 250]]
        : [[14, 165, 233], [16, 185, 129], [139, 92, 246]];

      // Update particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed;

        // Mouse repel
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RAD && dist > 1) {
          const force = (1 - dist / MOUSE_RAD) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring back
        p.vx += (p.ox - p.x) * ATTRACT_STRENGTH;
        p.vy += (p.oy - p.y) * ATTRACT_STRENGTH;

        // Damping
        p.vx *= 0.93;
        p.vy *= 0.93;

        p.x += p.vx + p.dx;
        p.y += p.vy + p.dy;

        // Wrap
        if (p.x < -30) { p.x = w + 30; p.ox = p.x; }
        if (p.x > w + 30) { p.x = -30; p.ox = p.x; }
        if (p.y < -30) { p.y = h + 30; p.oy = p.y; }
        if (p.y > h + 30) { p.y = -30; p.oy = p.y; }
      }

      // Connections
      const connDistSq = CONN_DIST * CONN_DIST;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const dd = ddx * ddx + ddy * ddy;
          if (dd < connDistSq) {
            const ratio = 1 - Math.sqrt(dd) / CONN_DIST;
            const opacity = ratio * (isDark ? 0.3 : 0.16);
            const c = colors[a.colorIdx];
            ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + opacity + ')';
            ctx.lineWidth = ratio * 1.2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles with outer glow
      for (const p of particles) {
        const glow = 0.5 + 0.5 * Math.sin(p.pulse);
        const size = p.r * (0.8 + glow * 0.6);
        const opacity = isDark ? (0.5 + glow * 0.45) : (0.32 + glow * 0.28);
        const c = colors[p.colorIdx];

        // Outer glow ring (only on desktop with many particles)
        if (size > 1.3 && settings.count >= 90) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (opacity * 0.06) + ')';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + opacity + ')';
        ctx.fill();
      }

      // Cursor energy rings (desktop only)
      if (mouse.active && mx > -5000 && settings.count >= 90) {
        const accent = colors[0];
        for (let ring = 0; ring < 3; ring++) {
          const radius = MOUSE_RAD * (0.25 + ring * 0.3);
          const grad = ctx.createRadialGradient(mx, my, radius * 0.7, mx, my, radius);
          grad.addColorStop(0, 'rgba(' + accent[0] + ',' + accent[1] + ',' + accent[2] + ',' + (isDark ? 0.04 : 0.025) + ')');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mx, my, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Mouse trail
        if (trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = 'rgba(' + accent[0] + ',' + accent[1] + ',' + accent[2] + ',' + (isDark ? 0.15 : 0.1) + ')';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.01;
        if (r.alpha <= 0) { ripples.splice(i, 1); continue; }
        const c = colors[i % 3];
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + r.alpha + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    function handleResize() { resize(); seed(); }
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onMouseLeave);

    return function() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(function() { return init(); }, [init]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
  );
}

// --- Layer: Morphing Aurora Blobs ---
function AuroraLayer({ isMobile }) {
  const { scrollYProgress } = useScroll();
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 0.7]);
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  // Mobile: static, smaller, less blur
  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] h-[350px] w-[350px]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.1)_0%,rgba(52,211,153,0.05)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.08)_0%,rgba(34,211,238,0.04)_40%,transparent_70%)] blur-[30px]" />
        </div>
        <div className="absolute top-[40%] -right-[15%] h-[300px] w-[300px]">
          <div className="h-full w-full rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.07)_0%,rgba(59,130,246,0.04)_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.05)_0%,rgba(34,211,238,0.03)_40%,transparent_70%)] blur-[30px]" />
        </div>
      </div>
    );
  }

  // Desktop/laptop: full animated aurora
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary aurora */}
      <motion.div
        style={{ rotate: rotate1, scale: scale1, y: y1 }}
        className="absolute -top-[25%] -left-[15%] h-[800px] w-[800px]"
      >
        <div className="h-full w-full rounded-full animate-morph-1
          bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.16)_0%,rgba(52,211,153,0.09)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.14)_0%,rgba(34,211,238,0.07)_40%,transparent_70%)]
          blur-[80px]" />
      </motion.div>

      {/* Secondary blob */}
      <motion.div
        style={{ rotate: rotate2, y: y2 }}
        className="absolute top-[25%] -right-[20%] h-[700px] w-[700px]"
      >
        <div className="h-full w-full rounded-full animate-morph-2
          bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,rgba(59,130,246,0.07)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.1)_0%,rgba(34,211,238,0.05)_40%,transparent_70%)]
          blur-[100px]" />
      </motion.div>

      {/* Tertiary accent */}
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-[15%] left-[15%] h-[600px] w-[600px]"
      >
        <div className="h-full w-full rounded-full animate-morph-3
          bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,rgba(167,139,250,0.07)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.07)_0%,rgba(167,139,250,0.04)_40%,transparent_70%)]
          blur-[90px]" />
      </motion.div>

      {/* Light mode warmth accent */}
      <div className="absolute top-[8%] right-[15%] h-[450px] w-[450px] rounded-full
        bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08)_0%,transparent_60%)]
        dark:bg-transparent blur-[80px] animate-pulse-slow" />
    </div>
  );
}

// --- Layer: Floating Geometric Shapes (hidden below 768px) ---
function GeometricShapes() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [45, -90]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 240]);

  return (
    <div className="absolute inset-0 hidden md:block">
      {/* Hollow square */}
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[12%] left-[6%] h-16 w-16 border border-accent/20 dark:border-accent/10 rounded-lg animate-float"
      />
      {/* Circle */}
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[42%] right-[10%] h-20 w-20 border border-glow-cyan/15 dark:border-glow-cyan/10 rounded-full animate-float [animation-delay:1s]"
      />
      {/* Diamond */}
      <motion.div
        style={{ y: y3, rotate: rotate3 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[68%] left-[12%] h-12 w-12 border border-glow-purple/15 dark:border-glow-purple/10 rotate-45 animate-float [animation-delay:2s]"
      />
      {/* Small filled dot */}
      <motion.div
        style={{ y: y1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
        className="absolute top-[22%] right-[22%] h-3 w-3 bg-accent/20 dark:bg-accent/10 rounded-full animate-pulse-slow"
      />
      {/* Cross/plus */}
      <motion.div
        style={{ y: y2, rotate: rotate1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute top-[55%] left-[38%] text-accent/15 dark:text-accent/10 text-2xl font-thin animate-float [animation-delay:3s]"
      >
        +
      </motion.div>
      {/* Rounded rect */}
      <motion.div
        style={{ y: y3, rotate: rotate2 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1.8 }}
        className="absolute top-[82%] right-[28%] h-10 w-16 border border-accent/10 rounded-xl animate-float [animation-delay:1.5s]"
      />
    </div>
  );
}

// --- Layer: Perspective Grid (hidden below 768px) ---
function PerspectiveGrid() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, 78]);

  return (
    <div className="absolute inset-0 overflow-hidden hidden md:block" style={{ perspective: '1000px' }}>
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

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base color */}
      <div className="absolute inset-0 bg-base" />

      {/* Dot grid - responsive density via layered elements */}
      <div
        className="absolute inset-0 hidden lg:block opacity-[0.10] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.6px, transparent 0.6px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
        }}
      />
      <div
        className="absolute inset-0 hidden md:block lg:hidden opacity-[0.07] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.5px, transparent 0.5px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
        }}
      />
      <div
        className="absolute inset-0 md:hidden opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.4px, transparent 0.4px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      {/* Aurora blobs */}
      <AuroraLayer isMobile={isMobile} />

      {/* Floating geometry - desktop/laptop only */}
      <GeometricShapes />

      {/* Interactive particles */}
      {!isMobile && !reducedMotion && (
        <div className="pointer-events-auto">
          <ParticleCanvas />
        </div>
      )}

      {/* Perspective grid - desktop/laptop only */}
      <PerspectiveGrid />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}

export default memo(BackgroundDecor);
