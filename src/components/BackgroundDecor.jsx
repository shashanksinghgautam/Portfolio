import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

/* ================================================================
   IMMERSIVE MULTI-LAYER BACKGROUND SYSTEM
   ================================================================
   Layer 1: Morphing aurora gradient blobs (scroll-reactive)
   Layer 2: Interactive particle field (mouse-reactive, 150 particles)
   Layer 3: Floating geometric shapes (parallax + rotation)
   Layer 4: Click ripple effects (burst particles outward)
   Layer 5: Perspective grid at bottom
   Layer 6: Vignette + noise
   
   Both light & dark modes are equally stunning:
   - Dark: Deep space with cyan/green aurora washes
   - Light: Luminous mesh with teal/violet/orange accents
================================================================ */

// ─── Layer: Interactive Particle Field ────────────────────────────
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

    const PARTICLE_COUNT = 150;
    const CONNECTION_DIST = 130;
    const MOUSE_RADIUS = 260;
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
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
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
      const isDark = themeRef.current === 'dark';

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
        : [[5, 150, 105], [20, 184, 166], [139, 92, 246]];

      // Update particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed;

        // Mouse repel
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 1) {
          const force = (1 - dist / MOUSE_RADIUS) * REPEL_STRENGTH;
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

      // Connections - gradient colored
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const dd = ddx * ddx + ddy * ddy;
          if (dd < CONNECTION_DIST * CONNECTION_DIST) {
            const ratio = 1 - Math.sqrt(dd) / CONNECTION_DIST;
            const opacity = ratio * (isDark ? 0.3 : 0.18);
            const c = colors[a.colorIdx];
            ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity})`;
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
        const opacity = isDark ? (0.5 + glow * 0.45) : (0.35 + glow * 0.35);
        const c = colors[p.colorIdx];

        // Outer glow ring
        if (size > 1.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity * 0.06})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${opacity})`;
        ctx.fill();
      }

      // Cursor energy rings
      if (mouse.active && mx > -5000) {
        const accent = colors[0];
        for (let ring = 0; ring < 3; ring++) {
          const radius = MOUSE_RADIUS * (0.25 + ring * 0.3);
          const grad = ctx.createRadialGradient(mx, my, radius * 0.7, mx, my, radius);
          grad.addColorStop(0, `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${isDark ? 0.04 : 0.025})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(mx, my, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw mouse trail
        if (trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          ctx.strokeStyle = `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${isDark ? 0.15 : 0.1})`;
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
        ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${r.alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();

    window.addEventListener('resize', () => { resize(); seed(); });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => init(), [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
    />
  );
}

// ─── Layer: Morphing Aurora Blobs ─────────────────────────────────
function AuroraLayer() {
  const { scrollYProgress } = useScroll();
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 0.7]);
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-40%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary aurora */}
      <motion.div
        style={{ rotate: rotate1, scale: scale1, y: y1 }}
        className="absolute -top-[25%] -left-[15%] h-[800px] w-[800px]"
      >
        <div className="h-full w-full rounded-full animate-morph-1
          bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.12)_0%,rgba(20,184,166,0.06)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.14)_0%,rgba(34,211,238,0.07)_40%,transparent_70%)]
          blur-[80px]" />
      </motion.div>

      {/* Secondary blob */}
      <motion.div
        style={{ rotate: rotate2, y: y2 }}
        className="absolute top-[25%] -right-[20%] h-[700px] w-[700px]"
      >
        <div className="h-full w-full rounded-full animate-morph-2
          bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1)_0%,rgba(20,184,166,0.05)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.1)_0%,rgba(34,211,238,0.05)_40%,transparent_70%)]
          blur-[100px]" />
      </motion.div>

      {/* Tertiary accent */}
      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-[15%] left-[15%] h-[600px] w-[600px]"
      >
        <div className="h-full w-full rounded-full animate-morph-3
          bg-[radial-gradient(ellipse_at_center,rgba(5,150,105,0.08)_0%,rgba(139,92,246,0.05)_40%,transparent_70%)]
          dark:bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.07)_0%,rgba(167,139,250,0.04)_40%,transparent_70%)]
          blur-[90px]" />
      </motion.div>

      {/* Light mode warmth accent */}
      <div className="absolute top-[8%] right-[15%] h-[450px] w-[450px] rounded-full
        bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.07)_0%,transparent_60%)]
        dark:bg-transparent blur-[80px] animate-pulse-slow" />
    </div>
  );
}

// ─── Layer: Floating Geometric Shapes ─────────────────────────────
function GeometricShapes() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [45, -90]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 240]);

  return (
    <div className="absolute inset-0">
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

// ─── Layer: Perspective Grid ──────────────────────────────────────
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
            backgroundImage: `
              linear-gradient(var(--accent) 1px, transparent 1px),
              linear-gradient(90deg, var(--accent) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 70%)',
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────
export default function BackgroundDecor() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base color */}
      <div className="absolute inset-0 bg-base" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--text-tertiary) 0.6px, transparent 0.6px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      {/* Aurora blobs */}
      <AuroraLayer />

      {/* Floating geometry */}
      <GeometricShapes />

      {/* Interactive particles - clickable */}
      <div className="pointer-events-auto">
        <ParticleCanvas />
      </div>

      {/* Perspective grid */}
      <PerspectiveGrid />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--bg)_100%)]" />
    </div>
  );
}
