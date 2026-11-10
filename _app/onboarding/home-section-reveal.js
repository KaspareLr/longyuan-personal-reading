/* One quiet entrance per card, without changing layout or existing hover transforms. */
(() => {
  const home = document.querySelector('body > main#home');
  if (!home || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const pending = new Set();
  const running = new Map();
  const targets = home.querySelectorAll('#podcasts > .section-title, #podcasts .podcast, #daily > .section-title, #daily .daily-card, #articles > .section-title, #articles .article-item');
  const finish = element => {
    pending.delete(element);
    observer.unobserve(element);
    running.get(element)?.cancel();
    running.delete(element);
    element.style.removeProperty('opacity');
    element.style.removeProperty('translate');
  };
  const reveal = (element, delay = 0) => {
    if (!pending.has(element)) return;
    pending.delete(element);
    observer.unobserve(element);
    const heading = element.classList.contains('section-title');
    const animation = element.animate([
      { opacity: 0, translate: `0 ${heading ? 14 : 24}px` },
      { opacity: 1, translate: '0 0' }
    ], { duration: heading ? 640 : 780, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
    running.set(element, animation);
    animation.onfinish = () => finish(element);
  };
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting && pending.has(entry.target));
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    visible.forEach((entry, index) => reveal(entry.target, Math.min(index * 90, 270)));
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

  targets.forEach(element => {
    pending.add(element);
    element.style.opacity = '0';
    element.style.translate = '0 24px';
    observer.observe(element);
  });
  home.addEventListener('focusin', event => {
    [...pending, ...running.keys()].forEach(element => {
      if (element.contains(event.target)) finish(element);
    });
  });
  reduced.addEventListener('change', event => {
    if (!event.matches) return;
    [...pending, ...running.keys()].forEach(finish);
    observer.disconnect();
  });
})();
