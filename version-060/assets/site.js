(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    document.querySelectorAll(".site-search-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input) {
          return;
        }
        var query = input.value.trim();
        if (!query) {
          event.preventDefault();
          window.location.href = "./search.html";
        }
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var index = 0;
      var timer = null;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function start() {
        if (slides.length <= 1) {
          return;
        }
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5000);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          start();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          start();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot") || 0));
          start();
        });
      });
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var filterGrid = document.querySelector(".filterable");
    if (filterGrid) {
      var cards = Array.prototype.slice.call(filterGrid.querySelectorAll("[data-card]"));
      var input = document.querySelector(".filter-input");
      var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
      var yearSelect = document.querySelector(".filter-year");
      var empty = document.querySelector(".empty-state");
      var currentType = "";
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (input && query) {
        input.value = query;
      }

      function textOf(card) {
        return [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-genre") || "",
          card.getAttribute("data-tags") || ""
        ].join(" ").toLowerCase();
      }

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = textOf(card);
          var matchText = !keyword || text.indexOf(keyword) !== -1;
          var matchType = !currentType || (card.getAttribute("data-type") || "") === currentType;
          var matchYear = !year || (card.getAttribute("data-year") || "") === year;
          var show = matchText && matchType && matchYear;
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      if (yearSelect) {
        yearSelect.addEventListener("change", applyFilter);
      }
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          currentType = button.getAttribute("data-type-filter") || "";
          buttons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          applyFilter();
        });
      });
      applyFilter();
    }
  });
})();
