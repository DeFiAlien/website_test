(function() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.5,
    alpha: Math.random()
  }));

  function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    stars.forEach(st => {
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255,255,255,${st.alpha})`;
      ctx.fill();
      st.alpha += (Math.random() - 0.5) * 0.05;
      if (st.alpha < 0) st.alpha = Math.random() * 0.1;
      if (st.alpha > 1) st.alpha = Math.random() * 0.9 + 0.1;
    });

    requestAnimationFrame(animate);
  }

  animate();
})();
