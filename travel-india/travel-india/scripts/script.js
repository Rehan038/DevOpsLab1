/* =============================================
   Explore India – Main Script
   Preserves from main branch:
     - showMessage()   (feat/interactive-ui)
     - toggleTheme()   (feat/dark-mode-hero)
   Adds new:
     - Hamburger menu
     - Active nav link detection
     - Scroll-reveal (IntersectionObserver)
     - Lightbox (gallery page)
     - Contact form validation
     - scrollToPlaces()
   ============================================= */

// ── showMessage — preserved from main branch ───
function showMessage() {
  alert("Welcome to Incredible India!");
}

// ── toggleTheme — preserved from main branch ───
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
}

// ── scrollToPlaces ──────────────────────────────
function scrollToPlaces() {
  var target = document.getElementById('places');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Hamburger menu ─────────────────────────────
(function () {
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('main-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
    });
  });
})();

// ── Active nav link based on current page ──────
(function () {
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ── Scroll-reveal animation ─────────────────────
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { observer.observe(el); });
})();

// ── Lightbox (gallery page) ─────────────────────
(function () {
  var lightbox = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lightbox-img');
  var lbCap    = document.getElementById('lightbox-caption');
  var lbClose  = document.getElementById('lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      lbImg.src         = item.getAttribute('data-src');
      lbImg.alt         = item.getAttribute('data-caption') || '';
      lbCap.textContent = item.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ── Contact Form Validation ─────────────────────
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var fields = {
    name:        { el: document.getElementById('name'),        group: document.getElementById('fg-name'),        validate: function(v){ return v.trim().length >= 2; } },
    email:       { el: document.getElementById('email'),       group: document.getElementById('fg-email'),       validate: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
    phone:       { el: document.getElementById('phone'),       group: document.getElementById('fg-phone'),       validate: function(v){ return v.trim() === '' || /^[\d\s\+\-\(\)]{7,15}$/.test(v.trim()); } },
    destination: { el: document.getElementById('destination'), group: document.getElementById('fg-destination'), validate: function(v){ return v !== ''; } },
    message:     { el: document.getElementById('message'),     group: document.getElementById('fg-message'),     validate: function(v){ return v.trim().length >= 20; } }
  };

  function validateField(key) {
    var f = fields[key];
    if (!f.el) return true;
    var isValid = f.validate(f.el.value);
    f.group.classList.toggle('has-error', !isValid);
    return isValid;
  }

  Object.keys(fields).forEach(function (key) {
    var f = fields[key];
    if (f.el) {
      f.el.addEventListener('blur',  function () { validateField(key); });
      f.el.addEventListener('input', function () {
        if (f.group.classList.contains('has-error')) validateField(key);
      });
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var allValid = Object.keys(fields).reduce(function(ok, key) {
      return validateField(key) && ok;
    }, true);

    if (allValid) {
      var btn        = document.getElementById('submit-btn');
      var successBox = document.getElementById('form-success');
      btn.disabled      = true;
      btn.textContent   = '⏳ Sending...';
      setTimeout(function () {
        form.style.display  = 'none';
        successBox.style.display = 'block';
      }, 1200);
    }
  });
})();