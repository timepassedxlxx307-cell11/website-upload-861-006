(() => {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');

  if (!input || !results || !Array.isArray(window.SEARCH_INDEX)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;

  const normalize = (text) => String(text || '').toLowerCase().trim();

  const renderCard = (item) => `
    <article class="movie-card poster-card">
      <a href="./${item.file}">
        <figure class="poster-cover">
          <img src="${item.cover}" alt="${item.title}" loading="lazy">
          <span class="cover-shade"></span>
          <span class="type-badge">${item.type}</span>
          <span class="poster-meta">${item.year} · ${item.region}</span>
        </figure>
        <div class="poster-info">
          <h3>${item.title}</h3>
          <p>${item.oneLine}</p>
        </div>
      </a>
    </article>`;

  const render = () => {
    const query = normalize(input.value);
    const list = window.SEARCH_INDEX.filter((item) => {
      if (!query) {
        return true;
      }
      return normalize(`${item.title} ${item.region} ${item.type} ${item.year} ${item.genre} ${item.tags} ${item.oneLine}`).includes(query);
    }).slice(0, 96);

    if (!list.length) {
      results.innerHTML = '<div class="search-empty">没有匹配内容</div>';
      return;
    }

    results.innerHTML = list.map(renderCard).join('');
  };

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = input.value.trim();
      const url = query ? `./search.html?q=${encodeURIComponent(query)}` : './search.html';
      window.history.replaceState(null, '', url);
      render();
    });
  }

  input.addEventListener('input', render);
  render();
})();
