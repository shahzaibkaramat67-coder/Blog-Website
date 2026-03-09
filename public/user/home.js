// Pro entrance + pointer tilt
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.card'));
  if (!cards.length) return;

  // Staggering function
  const setDelay = (el, i) => el.style.setProperty('--delay', `${i * 120}ms`);

  // IntersectionObserver: reveal on scroll
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = cards.indexOf(el);
        setDelay(el, idx);
        // double RAF so styles take effect before class toggle
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in-view')));
        observer.unobserve(el);
      });
    }, { threshold: 0.12 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach((el, i) => { setDelay(el, i); el.classList.add('in-view'); });
  }

  // Pointer tilt (subtle) with RAF
  cards.forEach(card => {
    let rafId = null;
    const rectCache = { w: 0, h: 0, left: 0, top: 0 };

    const updateRect = () => {
      const r = card.getBoundingClientRect();
      rectCache.w = r.width; rectCache.h = r.height; rectCache.left = r.left; rectCache.top = r.top;
    };

    const onMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateRect();
        const px = (e.clientX - rectCache.left) / rectCache.w;
        const py = (e.clientY - rectCache.top) / rectCache.h;
        const ry = (px - 0.5) * 16;   // rotateY
        const rx = (0.5 - py) * 10;   // rotateX
        const ty = Math.max(0, 12 - py * 12); // slight parallax
        card.style.setProperty('--ry', ry + 'deg');
        card.style.setProperty('--rx', rx + 'deg');
        card.style.setProperty('--ty', ty + 'px');
        card.style.setProperty('--s', '1.02');
      });
    };

    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      // smooth reset
      card.style.transition = 'transform 420ms cubic-bezier(.2,.9,.3,1)';
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ty', '0px');
      card.style.setProperty('--s', '1');
      setTimeout(() => card.style.transition = '', 420);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('focus', () => card.classList.add('in-view'));
  });
});