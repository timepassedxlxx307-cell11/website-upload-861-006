(function () {
    "use strict";

    function rootPrefix() {
        var path = window.location.pathname.replace(/\\/g, "/");
        if (path.indexOf("/movies/") !== -1 || path.indexOf("/categories/") !== -1) {
            return "../";
        }
        return "";
    }

    function clean(value) {
        return String(value || "").replace(/[&<>"]/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
            }[char];
        });
    }

    function pathFor(value) {
        return rootPrefix() + String(value || "").replace(/^\.?\//, "");
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var shell = document.querySelector("[data-hero-carousel]");
        if (!shell) {
            return;
        }
        var slides = Array.prototype.slice.call(shell.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(shell.querySelectorAll("[data-hero-dot]"));
        var prev = shell.querySelector("[data-hero-prev]");
        var next = shell.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                play();
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                show(i);
                play();
            });
        });
        show(0);
        play();
    }

    function setupSearch() {
        var boxes = document.querySelectorAll("[data-site-search]");
        if (!boxes.length || !window.SEARCH_INDEX) {
            return;
        }
        boxes.forEach(function (box) {
            var input = box.querySelector(".site-search-input");
            var results = box.querySelector(".site-search-results");
            if (!input || !results) {
                return;
            }
            input.addEventListener("input", function () {
                var query = input.value.trim().toLowerCase();
                if (!query) {
                    results.hidden = true;
                    results.innerHTML = "";
                    return;
                }
                var hits = window.SEARCH_INDEX.filter(function (item) {
                    return String(item.search || "").toLowerCase().indexOf(query) !== -1;
                }).slice(0, 9);
                if (!hits.length) {
                    results.hidden = false;
                    results.innerHTML = '<div class="search-result"><span></span><span class="search-meta">暂无匹配影片</span></div>';
                    return;
                }
                results.hidden = false;
                results.innerHTML = hits.map(function (item) {
                    return '<a class="search-result" href="' + clean(pathFor(item.href)) + '">' +
                        '<span class="search-thumb" style="--search-image: url(\'' + clean(pathFor(item.cover)) + '\');"></span>' +
                        '<span><strong class="search-title">' + clean(item.title) + '</strong>' +
                        '<small class="search-meta">' + clean(item.meta) + '</small></span>' +
                        '</a>';
                }).join("");
            });
            document.addEventListener("click", function (event) {
                if (!box.contains(event.target)) {
                    results.hidden = true;
                }
            });
        });
    }

    function setupFilters() {
        var scopes = document.querySelectorAll("[data-filter-scope]");
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var pills = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-card]"));
            var selected = "";

            function apply() {
                var query = input ? input.value.trim().toLowerCase() : "";
                cards.forEach(function (card) {
                    var source = String(card.getAttribute("data-search") || "").toLowerCase();
                    var okQuery = !query || source.indexOf(query) !== -1;
                    var okPill = !selected || source.indexOf(selected.toLowerCase()) !== -1;
                    card.classList.toggle("is-hidden", !(okQuery && okPill));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            pills.forEach(function (pill) {
                pill.addEventListener("click", function () {
                    selected = pill.getAttribute("data-filter-value") || "";
                    pills.forEach(function (node) {
                        node.classList.toggle("is-active", node === pill);
                    });
                    apply();
                });
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupSearch();
        setupFilters();
    });
})();
