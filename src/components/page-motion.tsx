import { useEffect } from 'react';

export function PageMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const targets = entry.target.querySelectorAll(':scope > div, :scope > article, :scope > h2, :scope > p');
        (targets.length ? Array.from(targets) : [entry.target]).forEach((element, i) => {
          animations.push(element.animate([{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 900, delay: Math.min(i, 4) * 90, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }));
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('main > section:not(.hero):not(.costs-v2):not(.prototype-section), .cost-intro, .cost-price, .cost-capacity, .cost-ledger, .equipment-investment').forEach(section => observer.observe(section));
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); };
  }, []);
  return null;
}