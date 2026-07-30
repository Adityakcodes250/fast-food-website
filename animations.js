// Scroll-reveal + small interaction animations.
// Written to observe the DOM rather than edit main.js's cart logic directly,
// so it stays independent of how the cart/menu code evolves.

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll-reveal ---------- */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  const observeReveal = (el) => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  };

  // Static content present at load — every section's intro heading plus its
  // content blocks, so scrolling down reveals the whole page section by section
  document.querySelectorAll(
    '#services [class="text-center"], #services .service-card, ' +
    '#menu [class="text-center"], ' +
    '#about .content, #about .image-container, .review-container, ' +
    '.app-container .content, .app-container .image-container, ' +
    '#newsletter [class="text-center"], .input-container, ' +
    '#contact [class="text-center"], #contact .contact-card, ' +
    '.footer-wrapper'
  ).forEach(observeReveal);

  // Menu cards are added dynamically after products.json loads — watch for them
  const cardList = document.querySelector('.card-list');
  if (cardList) {
    const cardObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('order-card')) {
            observeReveal(node);
          }
        });
      });
    });
    cardObserver.observe(cardList, { childList: true });
  }

  /* ---------- Cart icon feedback ---------- */

  const cartIcon = document.querySelector('.cart-icon');
  const cartListEl = document.querySelector('.cart-list');

  if (cartIcon && cartListEl) {
    const bump = () => {
      cartIcon.classList.remove('bump');
      // force reflow so the animation can re-trigger on rapid clicks
      void cartIcon.offsetWidth;
      cartIcon.classList.add('bump');
    };

    const cartObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.classList.contains('item')) {
            bump();
          }
        });
      });
    });
    cartObserver.observe(cartListEl, { childList: true });

    // Also bump on quantity +/- clicks (delegated, since buttons are added dynamically)
    cartListEl.addEventListener('click', (e) => {
      if (e.target.closest('.quantity-btn')) {
        bump();
      }
    });
  }
});
