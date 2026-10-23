document.querySelectorAll('[data-gui-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('[data-carousel-slide]')];
  const dots = [...carousel.querySelectorAll('[data-carousel-go]')];
  const toggle = carousel.querySelector('[data-carousel-toggle]');
  const viewport = carousel.querySelector('.gui-carousel-slides');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let timer;

  function schedule() {
    window.clearTimeout(timer);
    if (!paused && !hovered && !focused && visible && !document.hidden) {
      timer = window.setTimeout(() => show(current + 1), 6000);
    }
  }

  function updatePlayback() {
    toggle.querySelector('[data-carousel-toggle-icon]').textContent = paused ? '▶' : 'Ⅱ';
    toggle.querySelector('[data-carousel-toggle-text]').textContent = paused ? '자동 재생' : '일시정지';
    toggle.setAttribute('aria-label', paused ? '조립 화면 자동 전환 시작' : '조립 화면 자동 전환 일시정지');
    viewport.setAttribute('aria-live', paused ? 'polite' : 'off');
    schedule();
  }

  function show(index, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    // Load the next screenshot before its turn without fetching all slides up front.
    slides[(current + 1) % slides.length].querySelector('img').loading = 'eager';
    if (manual) paused = true;
    updatePlayback();
  }

  toggle.hidden = false;
  carousel.querySelector('[data-carousel-controls]').hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    focused = false;
    updatePlayback();
  });
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => show(current - 1, true));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => show(current + 1, true));
  dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.carouselGo), true)));
  carousel.addEventListener('mouseenter', () => { hovered = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; schedule(); });
  carousel.addEventListener('focusin', () => { focused = true; schedule(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) { focused = false; schedule(); }
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    }
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { paused = true; updatePlayback(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) slides[(current + 1) % slides.length].querySelector('img').loading = 'eager';
      schedule();
    }, { threshold: 0.15 }).observe(carousel);
  } else {
    visible = true;
  }
  updatePlayback();
});
