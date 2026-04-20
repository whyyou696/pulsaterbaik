/**
 * BEST MULTI PAYMENT - JS Logic
 * Lightweight, NO frameworks, Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavbar();
  initTiltCards();
  initMagneticButtons();
  initScrollProgress();
  initCounters();
  initMobileMenu();
});

/* --- 0. Mobile Menu --- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }
}

/* --- 1. Intersection Observer for Scroll Reveals --- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });
}

/* --- 2. Sticky Navbar --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --- 3. 3D Tilt Effect on Cards --- */
function initTiltCards() {
  // Only enable on non-touch devices for performance
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const tiltElements = document.querySelectorAll('.tilt-card');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;
      
      requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });
    
    el.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        el.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        el.style.transition = `transform 0.5s ease`;
      });
    });
    
    el.addEventListener('mouseenter', () => {
      el.style.transition = `none`; // Remove transition during mouse move
    });
  });
}

/* --- 4. Magnetic Button Effect --- */
function initMagneticButtons() {
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const magneticBtns = document.querySelectorAll('.magnetic-wrap');
  
  magneticBtns.forEach(wrap => {
    const btn = wrap.querySelector('.btn');
    if (!btn) return;

    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      requestAnimationFrame(() => {
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });
    });

    wrap.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        btn.style.transform = `translate(0px, 0px)`;
      });
    });
  });
}

/* --- 5. Scroll Progress Bar --- */
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('progress-bar');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTotal / height) * 100;
    
    requestAnimationFrame(() => {
      progressBar.style.width = scrollPercent + '%';
    });
  }, { passive: true });
}

/* --- 6. Animated Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'));
        const duration = 2000;
        const frameDuration = 1000 / 60;
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const count = () => {
          frame++;
          const progress = frame / totalFrames;
          const currentVal = Math.round(targetVal * easeOutExpo(progress));
          
          target.innerText = currentVal;
          
          if (frame < totalFrames) {
            requestAnimationFrame(count);
          } else {
            target.innerText = targetVal;
          }
        };
        
        count();
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
