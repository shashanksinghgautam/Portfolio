import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

/* ---------------------------------------------------------------
   Immersive cosmic background:
   - 130 star particles with mouse-gravity distortion
   - Particles warp / gravitate toward cursor with smooth easing
   - Connection lines form a constellation mesh
   - Cursor-warped square grid that curves near the mouse
   - Scroll-reactive nebula vortex (CSS gradients)
   - Masked canvas layers for elegant depth
   Perf: pure canvas - zero React re-renders during animation.
--------------------------------------------------------------- */

function DistortedGridCanvas() {
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

    const GRID_SPACING = 50;
    const GRID_SEGMENT = 16;
    const DISTORT_RADIUS = 180;
    const DISTORT_PUSH = 24;

    const mouse = { x: -9999, y: -9999, active: false };
    const smoothMouse = { x: -9999, y: -9999 };
    const MOUSE_LERP = 0.14;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function onMouseLeave() {
      mouse.active = false;
    }

    function warpPoint(x, y, mx, my) {
      const dx = x - mx;
      const dy = y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= DISTORT_RADIUS || dist < 0.001) return { x, y };

      const t = 1 - dist / DISTORT_RADIUS;
      const ease = t * t * (3 - 2 * t);
      const nx = dx / dist;
      const ny = dy / dist;

      // Radial push plus tiny swirl for curved-square feel.
      const radial = DISTORT_PUSH * ease;
      const swirl = 6 * ease;
      return {
        x: x + nx * radial - ny * swirl,
        y: y + ny * radial + nx * swirl,
      };
    }

    function drawLine(isVertical, fixedPos, mx, my) {
      ctx.beginPath();
      const max = isVertical ? h : w;
      let started = false;
      for (let p = 0; p <= max + GRID_SEGMENT; p += GRID_SEGMENT) {
        const x = isVertical ? fixedPos : p;
        const y = isVertical ? p : fixedPos;
        const warped = warpPoint(x, y, mx, my);
        if (!started) {
          ctx.moveTo(warped.x, warped.y);
          started = true;
        } else {
          ctx.lineTo(warped.x, warped.y);
        }
      }
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = themeRef.current === 'dark';

      if (mouse.active) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * MOUSE_LERP;
        smoothMouse.y += (mouse.y - smoothMouse.y) * MOUSE_LERP;
      } else {
        smoothMouse.x += (-9999 - smoothMouse.x) * 0.04;
        smoothMouse.y += (-9999 - smoothMouse.y) * 0.04;
      }

      const mx = smoothMouse.x;
      const my = smoothMouse.y;

      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= w + GRID_SPACING; x += GRID_SPACING) {
        drawLine(true, x, mx, my);
      }
      for (let y = 0; y <= h + GRID_SPACING; y += GRID_SPACING) {
        drawLine(false, y, mx, my);
      }

      // Subtle cursor field to emphasize distortion zone.
      if (mouse.active && mx > -5000) {
        const accent = isDark ? [96, 165, 250] : [31, 111, 235];
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, DISTORT_RADIUS);
        grad.addColorStop(0, `rgba(${accent[0]},${accent[1]},${accent[2]},${isDark ? 0.06 : 0.04})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(mx - DISTORT_RADIUS, my - DISTORT_RADIUS, DISTORT_RADIUS * 2, DISTORT_RADIUS * 2);
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => init(), [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{
        opacity: 0.9,
        maskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, black 25%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 30%, black 25%, transparent 70%)',
      }}
    />
  );
}

function StarCanvas() {
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

    const PARTICLE_COUNT = 130;
    const CONNECTION_DIST_SQ = 7200;   // ~85px radius
    const GRAVITY_RADIUS = 180;        // cursor gravity reach
    const GRAVITY_STRENGTH = 0.035;    // pull intensity
    const RETURN_STRENGTH = 0.025;     // spring-back to origin
    const particles = [];

    // Smoothly-interpolated mouse position
    const mouse = { x: -9999, y: -9999, active: false };
    const smoothMouse = { x: -9999, y: -9999 };
    const MOUSE_LERP = 0.12;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function seed() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ox = Math.random() * w;
        const oy = Math.random() * h;
        particles.push({
          x: ox, y: oy,
          ox, oy,                                         // origin (for spring-back)
          r: Math.random() * 1.6 + 0.4,
          dx: (Math.random() - 0.5) * 0.12,
          dy: (Math.random() - 0.5) * 0.12,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.008 + 0.003,
          vx: 0, vy: 0,                                  // velocity from gravity
        });
      }
    }

    function onMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onMouseLeave() {
      mouse.active = false;
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isDark = themeRef.current === 'dark';
      const base = isDark ? [200, 210, 230] : [80, 90, 110];
      const accentRGB = isDark ? [96, 165, 250] : [31, 111, 235]; // accent color for gravity glow

      // Smooth mouse interpolation
      if (mouse.active) {
        smoothMouse.x += (mouse.x - smoothMouse.x) * MOUSE_LERP;
        smoothMouse.y += (mouse.y - smoothMouse.y) * MOUSE_LERP;
      } else {
        // Gradually move smoothMouse off-screen so particles return
        smoothMouse.x += (-9999 - smoothMouse.x) * 0.03;
        smoothMouse.y += (-9999 - smoothMouse.y) * 0.03;
      }

      const mx = smoothMouse.x;
      const my = smoothMouse.y;

      // Draw subtle cursor gravity field (only when mouse active)
      if (mouse.active && mx > -5000) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, GRAVITY_RADIUS);
        grad.addColorStop(0, `rgba(${accentRGB[0]},${accentRGB[1]},${accentRGB[2]},${isDark ? 0.04 : 0.03})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(mx - GRAVITY_RADIUS, my - GRAVITY_RADIUS, GRAVITY_RADIUS * 2, GRAVITY_RADIUS * 2);
      }

      for (const p of particles) {
        // Drift
        p.ox += p.dx;
        p.oy += p.dy;
        p.pulse += p.pulseSpeed;
        if (p.ox < -10) p.ox = w + 10;
        if (p.ox > w + 10) p.ox = -10;
        if (p.oy < -10) p.oy = h + 10;
        if (p.oy > h + 10) p.oy = -10;

        // Mouse gravity
        const gdx = mx - p.x;
        const gdy = my - p.y;
        const gDist = Math.sqrt(gdx * gdx + gdy * gdy);

        if (gDist < GRAVITY_RADIUS && gDist > 1) {
          const force = (1 - gDist / GRAVITY_RADIUS) * GRAVITY_STRENGTH;
          p.vx += (gdx / gDist) * force;
          p.vy += (gdy / gDist) * force;
        }

        // Spring back to origin
        p.vx += (p.ox - p.x) * RETURN_STRENGTH;
        p.vy += (p.oy - p.y) * RETURN_STRENGTH;

        // Damping
        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        // Pulse opacity
        const alpha = (0.4 + Math.sin(p.pulse) * 0.25) * (isDark ? 1 : 0.5);

        // Particles near cursor glow brighter
        const cursorProximity = gDist < GRAVITY_RADIUS ? 1 - gDist / GRAVITY_RADIUS : 0;
        const r = p.r + cursorProximity * 0.8;

        // Color: blend toward accent near cursor
        const cr = base[0] + (accentRGB[0] - base[0]) * cursorProximity * 0.6;
        const cg = base[1] + (accentRGB[1] - base[1]) * cursorProximity * 0.6;
        const cb = base[2] + (accentRGB[2] - base[2]) * cursorProximity * 0.6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${alpha + cursorProximity * 0.3})`;
        ctx.fill();
      }

      // Connection lines (constellation mesh)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = dx * dx + dy * dy;
          if (dist < CONNECTION_DIST_SQ) {
            const a = (1 - dist / CONNECTION_DIST_SQ) * (isDark ? 0.09 : 0.05);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${base[0]},${base[1]},${base[2]},${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    seed();
    draw();
    const onResize = () => { resize(); seed(); };
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => init(), [init]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ opacity: 0.75 }} />;
}

export default function BackgroundDecor() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.45, 0.3, 0.25, 0.15]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Interactive warped square grid */}
      <DistortedGridCanvas />

      {/* Cosmic vortex - scroll-reactive */}
      <motion.div
        style={{ rotate, scale, opacity }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2
                   h-[700px] w-[700px] sm:h-[900px] sm:w-[900px]"
      >
        <div className="absolute inset-0 rounded-full
                        bg-[conic-gradient(from_0deg,#1F6FEB_0%,#7C3AED_25%,#ec4899_50%,#1F6FEB_75%,#7C3AED_100%)]
                        blur-[100px] dark:blur-[120px]" />
        <div className="absolute inset-[15%] rounded-full
                        bg-ink-50 dark:bg-ink-900 blur-[40px]" />
      </motion.div>

      {/* Secondary depth orb */}
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0.4, 0.8], [0, 0.3]),
          y: useTransform(scrollYProgress, [0.4, 1], [60, -40]),
        }}
        className="absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full
                   bg-[radial-gradient(circle,rgba(124,58,237,0.2),transparent_65%)]
                   blur-[60px]"
      />

      {/* Star particles with mouse gravity */}
      <div className="pointer-events-auto absolute inset-0">
        <StarCanvas />
      </div>
    </div>
  );
}
