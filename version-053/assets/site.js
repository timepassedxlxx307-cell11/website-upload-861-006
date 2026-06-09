(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

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
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
        if (!inputs.length) {
            return;
        }
        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                var value = input.value.trim().toLowerCase();
                var scope = input.closest("main") || document;
                var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-year") || "",
                        card.getAttribute("data-tags") || ""
                    ].join(" ").toLowerCase();
                    var matched = !value || haystack.indexOf(value) !== -1;
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                Array.prototype.slice.call(scope.querySelectorAll("[data-empty-state]")).forEach(function (empty) {
                    empty.hidden = visible !== 0;
                });
            });
        });
    }

    function attachSource(video, source) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return null;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            return hls;
        }
        video.src = source;
        return null;
    }

    function initPlayer(id, source) {
        var root = document.getElementById(id);
        if (!root) {
            return;
        }
        var video = root.querySelector("video");
        var cover = root.querySelector(".player-cover");
        if (!video || !cover) {
            return;
        }
        var started = false;
        var engine = null;

        function play() {
            if (!started) {
                engine = attachSource(video, source);
                started = true;
            }
            root.classList.add("is-playing");
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {
                    root.classList.remove("is-playing");
                });
            }
        }

        cover.addEventListener("click", play);
        video.addEventListener("play", function () {
            root.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
            if (!video.ended) {
                return;
            }
            root.classList.remove("is-playing");
        });
        video.addEventListener("error", function () {
            root.classList.remove("is-playing");
        });
        window.addEventListener("beforeunload", function () {
            if (engine && typeof engine.destroy === "function") {
                engine.destroy();
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });

    window.MoviePlayer = {
        init: initPlayer
    };
})();
