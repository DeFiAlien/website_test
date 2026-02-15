(() => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0;
  let h = 0;

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Star model: position + depth gives subtle parallax drift.
  const STAR_COUNT = Math.min(420, Math.floor((w * h) / 4500));
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),              // 0..1 depth
    r: 0.6 + Math.random() * 1.6,
    a: 0.25 + Math.random() * 0.75,
    tw: 0.002 + Math.random() * 0.008,
  }));

  let t = 0;

  function drawBackground() {
    // A deep sky gradient (slightly bluish)
    const g = ctx.createRadialGradient(w * 0.3, h * 0.2, 0, w * 0.3, h * 0.2, Math.max(w, h));
    g.addColorStop(0, '#070A14');
    g.addColorStop(0.55, '#04050B');
    g.addColorStop(1, '#020308');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function frame() {
    t += 1;

    drawBackground();

    // Gentle drift (disabled if reduced motion)
    const driftX = prefersReducedMotion ? 0 : Math.sin(t / 900) * 0.12;
    const driftY = prefersReducedMotion ? 0 : Math.cos(t / 1100) * 0.10;

    for (const s of stars) {
      // Twinkle
      if (!prefersReducedMotion) {
        s.a += (Math.random() - 0.5) * s.tw;
        if (s.a < 0.15) s.a = 0.15;
        if (s.a > 1) s.a = 1;
      }

      const px = s.x + driftX * (1 + s.z * 2);
      const py = s.y + driftY * (1 + s.z * 2);

      ctx.beginPath();
      ctx.arc(px, py, s.r * (0.75 + s.z), 0, Math.PI * 2);

      // Slight color variance for depth
      const cool = 210 + Math.floor(s.z * 25); // bluish tint in deeper layer
      ctx.fillStyle = `rgba(${cool}, ${cool + 8}, 255, ${s.a * (0.5 + s.z * 0.7)})`;
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  // If reduced motion, draw once and stop.
  if (prefersReducedMotion) {
    drawBackground();
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 242, 255, ${0.35 + s.z * 0.45})`;
      ctx.fill();
    }
  } else {
    requestAnimationFrame(frame);
  }
})();
