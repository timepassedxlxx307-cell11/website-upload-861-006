(function() {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function() {
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

        function show(target) {
            if (!slides.length) {
                return;
            }
            index = (target + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
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
            prev.addEventListener("click", function() {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function() {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function(dot, i) {
            dot.addEventListener("click", function() {
                show(i);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearch() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-card-search]"));
        panels.forEach(function(panel) {
            var input = panel.querySelector("[data-search-input]");
            var select = panel.querySelector("[data-year-filter]");
            var scope = panel.parentElement || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".card-item"));

            function apply() {
                var keyword = input ? input.value.trim().toLowerCase() : "";
                var year = select ? select.value : "";
                cards.forEach(function(card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedYear = !year || cardYear === year;
                    card.classList.toggle("is-hidden", !(matchedKeyword && matchedYear));
                });
            }

            if (input) {
                input.addEventListener("input", apply);
            }
            if (select) {
                select.addEventListener("change", apply);
            }
            apply();
        });
    }

    function setupMoviePlayer(url) {
        var video = document.getElementById("moviePlayer");
        var cover = document.getElementById("playCover");
        var shell = document.getElementById("playerShell");
        if (!video || !url) {
            return;
        }
        var loaded = false;
        var hlsInstance = null;

        function attach() {
            if (loaded) {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
            } else {
                video.src = url;
            }
            loaded = true;
        }

        function play() {
            attach();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function() {});
            }
        }

        if (cover) {
            cover.addEventListener("click", play);
        }
        if (shell) {
            shell.addEventListener("click", function(event) {
                if (event.target === shell) {
                    play();
                }
            });
        }
        video.addEventListener("play", function() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });
        window.addEventListener("beforeunload", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;

    ready(function() {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
