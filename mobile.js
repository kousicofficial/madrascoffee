/**
 * Madras Coffee House — Mobile JS
 * Hamburger menu, touch slider, lazy load, franchise sticky CTA
 */
(function () {
  'use strict';

  /* ── DOM Ready ─────────────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ────────────────────────────────────────────────────────
       1. HAMBURGER MENU
       Builds overlay if not already in HTML.
       Works across all pages.
    ──────────────────────────────────────────────────────── */
    const hamburger = document.querySelector('.mob-btn');
    if (hamburger) {
      // Build overlay
      const backdrop = document.createElement('div');
      backdrop.className = 'mobile-nav-backdrop';
      document.body.appendChild(backdrop);

      const overlay = document.createElement('nav');
      overlay.className = 'mobile-nav-overlay';
      overlay.setAttribute('aria-label', 'Mobile navigation');
      overlay.setAttribute('role', 'navigation');

      // Gather links from desktop nav
      const desktopLinks = document.querySelectorAll('.nav-center a, nav .nav-links a');
      let linksHTML = '';
      if (desktopLinks.length) {
        desktopLinks.forEach(a => {
          linksHTML += `<a href="${a.href}">${a.textContent.trim()}</a>`;
        });
      } else {
        // Fallback link set
        linksHTML = `
          <a href="index.html">Home</a>
          <a href="menu.html">Our Menu</a>
          <a href="index.html#store-format">Store Format</a>
          <a href="index.html#about">About</a>
          <a href="franchise.html">Franchise</a>
          <a href="stores.html">Our Stores</a>
          <a href="gallery.html">Gallery</a>
          <a href="contact.html">Contact</a>
        `;
      }

      // Logo src
      const logoEl = document.querySelector('.logo img, .nav-logo img, header img');
      const logoSrc = logoEl ? logoEl.src : '';

      overlay.innerHTML = `
        <div class="mnav-header">
          ${logoSrc ? `<img src="${logoSrc}" alt="MCH Logo" style="height:36px;object-fit:contain">` : '<strong style="font-family:\'Playfair Display\',serif;color:#e4272e">MCH</strong>'}
          <button class="mnav-close" aria-label="Close menu">&#x2715;</button>
        </div>
        <div class="mnav-links">${linksHTML}</div>
        <div class="mnav-cta">
          <a href="franchise.html">Enquire for Franchise</a>
        </div>
      `;
      document.body.appendChild(overlay);

      // Highlight active link
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      overlay.querySelectorAll('.mnav-links a').forEach(a => {
        if (a.getAttribute('href') === currentPage || a.getAttribute('href').includes(currentPage)) {
          a.classList.add('active');
        }
      });

      function openMenu() {
        hamburger.classList.add('open');
        overlay.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
        overlay.querySelector('.mnav-close').focus();
      }
      function closeMenu() {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }

      hamburger.addEventListener('click', function () {
        overlay.classList.contains('open') ? closeMenu() : openMenu();
      });
      overlay.querySelector('.mnav-close').addEventListener('click', closeMenu);
      backdrop.addEventListener('click', closeMenu);
      overlay.querySelectorAll('.mnav-links a').forEach(a => {
        a.addEventListener('click', closeMenu);
      });

      // Keyboard trap inside menu
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
      });
    }

    /* ────────────────────────────────────────────────────────
       2. TESTIMONIAL TOUCH SLIDER + DOTS
    ──────────────────────────────────────────────────────── */
    const testiTrack = document.getElementById('testiTrack');
    if (testiTrack) {
      // Only apply touch slider on mobile
      if (window.innerWidth <= 768) {
        testiTrack.style.animation = 'none';

        const cards = testiTrack.querySelectorAll('.testimonial-card:not([aria-hidden])');
        const dotsWrap = document.createElement('div');
        dotsWrap.className = 'testi-dots';

        cards.forEach((_, i) => {
          const dot = document.createElement('button');
          dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
          dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
          dot.addEventListener('click', () => scrollToCard(i));
          dotsWrap.appendChild(dot);
        });

        const testiSection = document.getElementById('testimonials');
        if (testiSection) testiSection.appendChild(dotsWrap);

        function scrollToCard(idx) {
          const card = cards[idx];
          if (!card) return;
          testiTrack.scrollTo({ left: card.offsetLeft - testiTrack.offsetLeft, behavior: 'smooth' });
          dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        // Update dots on scroll
        testiTrack.addEventListener('scroll', debounce(function () {
          const trackLeft = testiTrack.scrollLeft;
          let closest = 0, minDist = Infinity;
          cards.forEach((c, i) => {
            const dist = Math.abs(c.offsetLeft - testiTrack.offsetLeft - trackLeft);
            if (dist < minDist) { minDist = dist; closest = i; }
          });
          dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === closest));
        }, 80));
      }
    }

    /* ────────────────────────────────────────────────────────
       3. FRANCHISE STICKY CTA BAR (mobile only)
    ──────────────────────────────────────────────────────── */
    if (document.body.classList.contains('franchise-page') ||
        window.location.pathname.includes('franchise')) {
      const existingCta = document.querySelector('.fran-sticky-cta');
      if (!existingCta) {
        const stickyCta = document.createElement('a');
        stickyCta.href = '#enquiry';
        stickyCta.className = 'fran-sticky-cta';
        stickyCta.innerHTML = 'Enquire for Franchise &rarr;';
        stickyCta.setAttribute('aria-label', 'Enquire for Franchise');
        document.body.appendChild(stickyCta);
        document.body.classList.add('franchise-page');
      }

      // Hide sticky CTA when form is in view
      const enquirySection = document.getElementById('enquiry');
      if (enquirySection && 'IntersectionObserver' in window) {
        const obs = new IntersectionObserver(([entry]) => {
          const cta = document.querySelector('.fran-sticky-cta');
          if (cta) cta.style.display = entry.isIntersecting ? 'none' : '';
        }, { threshold: 0.2 });
        obs.observe(enquirySection);
      }
    }

    /* ────────────────────────────────────────────────────────
       4. IMAGE LAZY LOADING
    ──────────────────────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
      const lazyImgs = document.querySelectorAll('img[data-src]');
      if (lazyImgs.length) {
        const imgObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              if (img.dataset.srcset) img.srcset = img.dataset.srcset;
              img.classList.add('loaded');
              imgObs.unobserve(img);
            }
          });
        }, { rootMargin: '200px' });
        lazyImgs.forEach(img => imgObs.observe(img));
      }
    }

    /* ────────────────────────────────────────────────────────
       5. LAZY LOAD YOUTUBE IFRAMES
    ──────────────────────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
      const lazyFrames = document.querySelectorAll('iframe[data-src]');
      if (lazyFrames.length) {
        const frameObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const frame = entry.target;
              frame.src = frame.dataset.src;
              frameObs.unobserve(frame);
            }
          });
        }, { rootMargin: '300px' });
        lazyFrames.forEach(f => frameObs.observe(f));
      }
    }

    /* ────────────────────────────────────────────────────────
       6. REDUCE ANIMATIONS ON MOBILE
    ──────────────────────────────────────────────────────── */
    if (window.innerWidth <= 768) {
      // Shorter animation durations override
      document.documentElement.style.setProperty('--anim-dur', '0.4s');
      // Disable non-essential heavy animations
      const style = document.createElement('style');
      style.textContent = `
        @media (max-width: 768px) {
          @keyframes testiScroll { to { transform: none; } }
          .testi-track { animation: none !important; }
          .hero-bg-img { animation-duration: 0s !important; }
        }
      `;
      document.head.appendChild(style);
    }

    /* ────────────────────────────────────────────────────────
       7. SMOOTH REVEAL OBSERVER (used across all pages)
    ──────────────────────────────────────────────────────── */
    if ('IntersectionObserver' in window) {
      const revealEls = document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-in, .reveal');
      if (revealEls.length) {
        const revObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              revObs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revObs.observe(el));
      }
    }

  }); // end ready()

  /* ── UTILS ──────────────────────────────────────────────── */
  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

})();
