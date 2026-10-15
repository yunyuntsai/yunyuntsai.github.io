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
    var hue = 0;
    setInterval(function () { hue = (hue + 1) % 360; }, 10);
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var star = document.createElement('div');
      star.className = 'mouse-star';
      star.textContent = '\u272E';
      star.style.left = (e.clientX - rect.left) + 'px';
      star.style.top = (e.clientY - rect.top) + 'px';
      star.style.color = 'hsla(' + hue + ',100%,70%,0.6)';
      star.style.animationName = floats[Math.floor(Math.random() * floats.length)];
      layer.appendChild(star);
      setTimeout(function () { star.remove(); }, 900);
    });
  }

  var lastedit = document.getElementById('lastedit');
  if (lastedit) {
    var d = new Date(document.lastModified);
    lastedit.textContent = isNaN(d) ? document.lastModified : d.toISOString().slice(0, 10);
  }
})();
