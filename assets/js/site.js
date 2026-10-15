(function () {
  'use strict';

  var nav = document.querySelector('.site-nav');
  var hero = document.querySelector('.hero');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  var top = document.getElementById('top');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var threshold = hero ? Math.max(hero.offsetHeight - 80, 60) : 0;
    if (nav) nav.classList.toggle('is-visible', nav.hasAttribute('data-always') || y > threshold);
    if (top) top.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.fa').className = open ? 'fa fa-times' : 'fa fa-bars';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && links.classList.contains('is-open')) toggle.click();
    });
  }

  var newsToggle = document.querySelector('.news-toggle');
  var newsMore = document.getElementById('news-more');
  if (newsToggle && newsMore) {
    newsToggle.addEventListener('click', function () {
      var open = newsMore.classList.toggle('is-open');
      newsToggle.setAttribute('aria-expanded', String(open));
      newsToggle.querySelector('.label').textContent = open ? 'Show less' : 'Show more';
      newsToggle.querySelector('.fa').className = open ? 'fa fa-angle-up' : 'fa fa-angle-down';
      if (!open) {
        var heading = document.querySelector('#news .section-heading');
        if (heading && heading.getBoundingClientRect().top < 80) heading.scrollIntoView();
      }
    });
  }

  if (top) {
    top.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll-triggered animations (replaces css3-animate-it from the reference theme)
  var animated = document.querySelectorAll('.animated');
  function go(el) {
    el.classList.add('go');
    el.addEventListener('animationend', function () { el.classList.add('done'); }, { once: true });
  }
  function reset(el) { el.classList.remove('go', 'done'); }
  if ('IntersectionObserver' in window) {
    // Replay on every entry: reset when the element fully leaves the viewport (like the reference's css3-animate-it)
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var tall = entry.boundingClientRect.height > window.innerHeight * 0.8;
        if (entry.isIntersecting && (entry.intersectionRatio >= 0.15 || tall)) go(entry.target);
        else if (!entry.isIntersecting && entry.target.classList.contains('go')) reset(entry.target);
      });
    }, { threshold: [0, 0.15] });
    animated.forEach(function (el) { io.observe(el); });
  } else {
    animated.forEach(go);
  }

  // Mouse-trail stars in the hero (ported from the reference's myjs.js). Desktop pointers only.
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (hero && finePointer && !reduceMotion) {
    var layer = document.createElement('div');
    layer.className = 'star-layer';
    layer.setAttribute('aria-hidden', 'true');
    hero.appendChild(layer);
    var floats = ['floatOne', 'floatTwo', 'floatThree', 'floatFour', 'floatFive'];
    // Autumn palette: hue sweeps red (0) -> orange -> gold (50) and back
    var hue = 0, dir = 1;
    setInterval(function () { hue += dir; if (hue >= 50 || hue <= 0) dir = -dir; }, 20);
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var leaf = document.createElement('span');
      leaf.className = 'mouse-star fab fa-canadian-maple-leaf';
      leaf.style.left = (e.clientX - rect.left) + 'px';
      leaf.style.top = (e.clientY - rect.top) + 'px';
      leaf.style.color = 'hsla(' + hue + ',95%,' + (55 + Math.random() * 15) + '%,0.75)';
      leaf.style.animationName = floats[Math.floor(Math.random() * floats.length)];
      leaf.style.setProperty('--sway', (Math.random() * 40 - 20) + 'px');
      layer.appendChild(leaf);
      setTimeout(function () { leaf.remove(); }, 1100);
    });
  }

  // Typing animation for the About greeting (replays whenever it scrolls back into view)
  var typingEl = document.querySelector('.about-greeting .typing');
  if (typingEl && !reduceMotion) {
    var text = typingEl.textContent;
    var chars = Array.from(text);  // split by code point so emoji (surrogate pairs) type correctly
    typingEl.textContent = '';
    var iv = null, timer = null, running = false;
    function stopTyping() {
      if (iv) clearInterval(iv);
      if (timer) clearTimeout(timer);
      iv = timer = null;
      running = false;
    }
    function eraseLoop() {
      iv = setInterval(function () {
        typingEl.textContent = Array.from(typingEl.textContent).slice(0, -1).join('');
        if (!typingEl.textContent.length) {
          clearInterval(iv); iv = null;
          timer = setTimeout(typeLoop, 700);   // short pause, then retype
        }
      }, 45);
    }
    function typeLoop() {
      running = true;
      typingEl.textContent = '';
      var i = 0;
      iv = setInterval(function () {
        typingEl.textContent = chars.slice(0, ++i).join('');
        if (i >= chars.length) {
          clearInterval(iv); iv = null;
          timer = setTimeout(eraseLoop, 2000); // hold the full sentence, then erase
        }
      }, 90);
    }
    if ('IntersectionObserver' in window) {
      var tio = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { if (!running) timer = setTimeout(typeLoop, 350); }
        else { stopTyping(); typingEl.textContent = ''; }
      }, { threshold: 0.9 });
      tio.observe(typingEl);
    } else {
      typeLoop();
    }
  }

  // Light / dark theme toggle (defaults to light; initial theme is applied inline in <head> to avoid a flash)
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  var lastedit = document.getElementById('lastedit');
  if (lastedit) {
    var d = new Date(document.lastModified);
    lastedit.textContent = isNaN(d) ? document.lastModified : d.toISOString().slice(0, 10);
  }
})();
