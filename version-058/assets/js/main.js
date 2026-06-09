(function () {
  var header = document.querySelector('[data-header]');
  var openMenu = document.querySelector('[data-open-menu]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 12) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (openMenu && mobileMenu && header) {
    openMenu.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      header.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var next = document.querySelector('[data-hero-next]');
  var prev = document.querySelector('[data-hero-prev]');
  var heroIndex = 0;
  var heroTimer = null;

  function setHero(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
    });
  }

  function restartHero() {
    if (!slides.length) {
      return;
    }
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }
    heroTimer = window.setInterval(function () {
      setHero(heroIndex + 1);
    }, 5200);
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setHero(index);
        restartHero();
      });
    });
    if (next) {
      next.addEventListener('click', function () {
        setHero(heroIndex + 1);
        restartHero();
      });
    }
    if (prev) {
      prev.addEventListener('click', function () {
        setHero(heroIndex - 1);
        restartHero();
      });
    }
    restartHero();
  }

  var searchInput = document.querySelector('[data-search-input]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-category-filter]'));
  var activeCategory = 'all';

  function applyFilters() {
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    cards.forEach(function (card) {
      var text = (card.getAttribute('data-search') || '').toLowerCase();
      var category = card.getAttribute('data-category') || '';
      var matchText = !query || text.indexOf(query) !== -1;
      var matchCategory = activeCategory === 'all' || category === activeCategory;
      card.classList.toggle('is-hidden', !(matchText && matchCategory));
    });
  }

  if (searchInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
    searchInput.addEventListener('input', applyFilters);
    applyFilters();
  }

  if (filterButtons.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeCategory = button.getAttribute('data-category-filter') || 'all';
        filterButtons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters();
      });
    });
  }
})();
