(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
      document.body.classList.toggle('menu-open', mobilePanel.classList.contains('open'));
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('.hero-prev');
    const next = hero.querySelector('.hero-next');
    let active = 0;
    let timer = null;

    const setActive = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, current) => {
        slide.classList.toggle('active', current === active);
      });
      dots.forEach((dot, current) => {
        dot.classList.toggle('active', current === active);
      });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => setActive(active + 1), 5600);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        setActive(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', () => {
        setActive(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        setActive(active + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    setActive(0);
    start();
  }

  const filterPanel = document.querySelector('[data-filter-panel]');
  const filterCards = Array.from(document.querySelectorAll('[data-card]'));
  const categorySearch = document.querySelector('[data-category-search]');

  if (filterPanel && filterCards.length) {
    const buttons = Array.from(filterPanel.querySelectorAll('[data-filter-value]'));
    let currentType = 'all';
    let currentValue = 'all';
    let currentQuery = '';

    const normalize = (text) => String(text || '').toLowerCase().trim();

    const applyFilter = () => {
      filterCards.forEach((card) => {
        const matchesButton = currentValue === 'all' || normalize(card.dataset[currentType]) === normalize(currentValue);
        const haystack = normalize(`${card.dataset.title} ${card.dataset.year} ${card.dataset.region} ${card.dataset.type}`);
        const matchesQuery = !currentQuery || haystack.includes(currentQuery);
        card.style.display = matchesButton && matchesQuery ? '' : 'none';
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        currentType = button.dataset.filterType || 'title';
        currentValue = button.dataset.filterValue || 'all';
        applyFilter();
      });
    });

    if (categorySearch) {
      categorySearch.addEventListener('input', () => {
        currentQuery = normalize(categorySearch.value);
        applyFilter();
      });
    }

    applyFilter();
  }
})();
