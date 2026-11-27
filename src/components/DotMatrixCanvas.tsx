import React, { useEffect, useRef } from 'react';

interface DotMatrixCanvasProps {
  accentHex: string;
  isDark: boolean;
}

export const DotMatrixCanvas: React.FC<DotMatrixCanvasProps> = ({ accentHex, isDark }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const onLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const spacing = 34;
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const radius = 190;

      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = spacing / 2; y < h; y += spacing) {
          const dx = x - px;
          const dy = y - py;
          const dist = Math.hypot(dx, dy);

          if (pointerRef.current.active && dist < radius && !prefersReducedMotion) {
            const strength = 1 - dist / radius;
            const r = 1.2 + strength * 2.1;
            ctx.fillStyle = accentHex;
            ctx.globalAlpha = 0.14 + strength * 0.65;
            ctx.beginPath();
            ctx.arc(x + dx * strength * 0.06, y + dy * strength * 0.06, r, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)';
            ctx.globalAlpha = 1;
            ctx.beginPath();
            ctx.arc(x, y, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      if (!prefersReducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [accentHex, isDark]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};

