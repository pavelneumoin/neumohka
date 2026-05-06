// uroki-podpiska — minimal vanilla JS for FAQ, filters, toggles, etc.

document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.toggle('open');
      const a = item.querySelector('.faq-a');
      if (a) a.style.maxHeight = isOpen ? a.scrollHeight + 'px' : '0';
    });
  });

  // Toggle (settings switches)
  document.querySelectorAll('.toggle').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  // Filter chips remove
  document.querySelectorAll('[data-remove-chip]').forEach(c => {
    c.addEventListener('click', e => {
      e.preventDefault();
      c.remove();
    });
  });

  // Lesson card → detail page
  document.querySelectorAll('[data-lesson-link]').forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = 'lesson.html';
    });
  });

  // Pricing toggle (used on pricing page)
  const pricingToggle = document.querySelector('[data-pricing-toggle]');
  if (pricingToggle) {
    pricingToggle.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => {
        pricingToggle.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
  }

  // Lesson preview navigation (carousel)
  document.querySelectorAll('[data-slide-nav]').forEach(nav => {
    const total = parseInt(nav.dataset.total || '18', 10);
    let i = 1;
    const counter = nav.querySelector('[data-slide-count]');
    const update = () => { if (counter) counter.textContent = `${i} / ${total}`; };
    nav.querySelector('[data-slide-prev]').addEventListener('click', () => { i = Math.max(1, i - 1); update(); });
    nav.querySelector('[data-slide-next]').addEventListener('click', () => { i = Math.min(total, i + 1); update(); });
    update();
  });

  // Mobile nav toggle (placeholder — could open a drawer)
  document.querySelectorAll('.nav-mobile-toggle').forEach(b => {
    b.addEventListener('click', () => {
      const n = document.querySelector('.nav');
      if (!n) return;
      const visible = n.style.display === 'flex';
      n.style.display = visible ? '' : 'flex';
      n.style.position = 'absolute';
      n.style.top = '68px';
      n.style.right = '16px';
      n.style.flexDirection = 'column';
      n.style.background = 'var(--bg)';
      n.style.padding = '20px';
      n.style.border = '1px solid var(--line)';
      n.style.borderRadius = '12px';
      n.style.boxShadow = 'var(--shadow-md)';
      if (visible) { n.style.cssText = ''; }
    });
  });
});
