/* ═══════════════════════════════════════════════════════════════
   script.js — Portfolio Interactions
   ═══════════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  /* ─── DOM CACHE ─── */
  const navbar     = document.getElementById("navbar");
  const navToggle  = document.getElementById("nav-toggle");
  const navMenu    = document.getElementById("nav-menu");
  const navLinks   = document.querySelectorAll(".nav-link");
  const reveals    = document.querySelectorAll(".reveal");
  const skillFills = document.querySelectorAll(".skill-fill");
  const statNums   = document.querySelectorAll(".stat-number");
  const sections   = document.querySelectorAll("section[id]");

  /* ─── NAVBAR: scroll state ─── */
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 60);
    lastScroll = y;
  }, { passive: true });

  /* ─── MOBILE MENU ─── */
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("open");
    navMenu.classList.toggle("open");
  });
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("open");
      navMenu.classList.remove("open");
    });
  });

  /* ─── ACTIVE NAV LINK on scroll ─── */
  function setActiveLink() {
    let current = "";
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", setActiveLink, { passive: true });

  /* ─── INTERSECTION OBSERVER: reveals ─── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach(el => revealObserver.observe(el));

  /* ─── SKILL BAR animation ─── */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const w = fill.dataset.width;
          fill.style.setProperty("--w", w + "%");
          fill.classList.add("animate");
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillFills.forEach(el => skillObserver.observe(el));

  /* ─── STAT counter animation ─── */
  function animateCounter(el) {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach(el => statObserver.observe(el));

  /* ─── STAGGERED REVEAL for children ─── */
  document.querySelectorAll(".portfolio-grid .reveal, .contact-cards .reveal, .about-stats .reveal").forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  /* ─── Initial trigger ─── */
  setActiveLink();
})();
