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

  // Subtle starfield: fewer stars, less contrast. Designed to sit behind typography.
  const STAR_COUNT = Math.min(320, Math.floor((w * h) / 6500));
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    z: Math.random(),
    r: 0.5 + Math.random() * 1.5,
    a: 0.10 + Math.random() * 0.55,
    tw: 0.0015 + Math.random() * 0.006,
  }));

  let t = 0;

  function drawBackground() {
    const g = ctx.createRadialGradient(w * 0.28, h * 0.18, 0, w * 0.28, h * 0.18, Math.max(w, h));
    g.addColorStop(0, '#0A0B14');
    g.addColorStop(0.55, '#06070C');
    g.addColorStop(1, '#04040A');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // A faint nebula wash
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(155,231,255,0.03)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(199,167,255,0.02)';
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }

  function frame() {
    t += 1;
    drawBackground();

    const driftX = prefersReducedMotion ? 0 : Math.sin(t / 1200) * 0.10;
    const driftY = prefersReducedMotion ? 0 : Math.cos(t / 1500) * 0.08;

    for (const s of stars) {
      if (!prefersReducedMotion) {
        s.a += (Math.random() - 0.5) * s.tw;
        if (s.a < 0.05) s.a = 0.05;
        if (s.a > 0.72) s.a = 0.72;
      }

      const px = s.x + driftX * (1 + s.z * 2);
      const py = s.y + driftY * (1 + s.z * 2);

      ctx.beginPath();
      ctx.arc(px, py, s.r * (0.70 + s.z), 0, Math.PI * 2);

      const cool = 215 + Math.floor(s.z * 16);
      ctx.fillStyle = `rgba(${cool}, ${cool + 10}, 255, ${s.a * (0.35 + s.z * 0.65)})`;
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(frame);
  }

  if (prefersReducedMotion) {
    drawBackground();
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(235, 242, 255, ${0.14 + s.z * 0.26})`;
      ctx.fill();
    }
  } else {
    requestAnimationFrame(frame);
  }
})();
