/* ============================================================
   こむぎ＆ドル子 公式LP — script.js
   Scroll Animation · FAQ Accordion · Counter · Lightbox
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. Scroll Fade-In Animation ---------- */
  function initScrollAnimation() {
    var targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 2. FAQ Accordion ---------- */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all other items
        faqItems.forEach(function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            var otherAnswer = other.querySelector('.faq-answer');
            var otherBtn = other.querySelector('.faq-question');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          answer.style.maxHeight = '0';
          question.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- 3. Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute('href');
      if (!id || id === '#' || id === '#line') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ---------- 4. Counter Animation ---------- */
  function initCounterAnimation() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(function (el) {
        el.textContent = formatNumber(parseInt(el.getAttribute('data-count'), 10));
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var duration = 1500;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target);
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(num) {
    if (num >= 10000) {
      var man = num / 10000;
      // 1.7万のように小数点があればそのまま表示
      if (man % 1 !== 0) {
        return man.toFixed(1);
      }
      return man.toLocaleString();
    }
    return num.toLocaleString();
  }

  /* ---------- 5. Gallery Lightbox ---------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lbImg = lightbox.querySelector('.lightbox-content img');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (img && img.src) {
          lbImg.src = img.src;
          lbImg.alt = img.alt || 'ギャラリー画像';
          openLightbox();
        }
      });
    });

    function openLightbox() {
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  }

  /* ---------- 6. Resize Handler ---------- */
  function initResizeHandler() {
    var timer;
    window.addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        document.querySelectorAll('.faq-item.is-open').forEach(function (item) {
          var answer = item.querySelector('.faq-answer');
          if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        });
      }, 250);
    });
  }

  /* ---------- 7. Floating CTA ---------- */
  function initFloatingCta() {
    var cta = document.getElementById('floating-cta');
    var hero = document.getElementById('hero');
    if (!cta || !hero) return;

    function update() {
      var threshold = hero.offsetTop + hero.offsetHeight;
      if (window.scrollY > threshold) {
        cta.classList.add('is-visible');
        cta.setAttribute('aria-hidden', 'false');
      } else {
        cta.classList.remove('is-visible');
        cta.setAttribute('aria-hidden', 'true');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimation();
    initFaqAccordion();
    initSmoothScroll();
    initCounterAnimation();
    initLightbox();
    initResizeHandler();
    initFloatingCta();
  });
})();
