document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector(".mobile-menu-button");
    var nav = document.querySelector(".site-nav");

    if (menuButton && nav) {
        menuButton.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    var hero = document.querySelector(".hero");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var pageFilter = document.querySelector("[data-card-filter]");
    if (pageFilter) {
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        pageFilter.addEventListener("input", function () {
            var value = pageFilter.value.trim().toLowerCase();
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type")
                ].join(" ").toLowerCase();
                card.style.display = text.indexOf(value) === -1 ? "none" : "";
            });
        });
    }
});
