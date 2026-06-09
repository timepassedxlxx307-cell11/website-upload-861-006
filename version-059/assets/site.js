(function () {
    var navToggle = document.querySelector(".nav-toggle");
    var mainNav = document.querySelector(".main-nav");

    if (navToggle && mainNav) {
        navToggle.addEventListener("click", function () {
            mainNav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    }

    function startTimer() {
        if (!slides.length) {
            return;
        }
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(current - 1);
            startTimer();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(current + 1);
            startTimer();
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startTimer();
        });
    });

    startTimer();

    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    panels.forEach(function (panel) {
        var scope = panel.parentElement || document;
        var input = panel.querySelector("[data-movie-search]");
        var typeSelect = panel.querySelector("[data-movie-type]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

        function normalize(value) {
            return (value || "").toString().toLowerCase().trim();
        }

        function filterCards() {
            var query = normalize(input ? input.value : "");
            var typeValue = normalize(typeSelect ? typeSelect.value : "");

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre")
                ].map(normalize).join(" ");

                var matchQuery = !query || haystack.indexOf(query) !== -1;
                var matchType = !typeValue || haystack.indexOf(typeValue) !== -1;
                card.classList.toggle("is-hidden", !(matchQuery && matchType));
            });
        }

        if (input) {
            input.addEventListener("input", filterCards);
        }
        if (typeSelect) {
            typeSelect.addEventListener("change", filterCards);
        }
    });
}());
