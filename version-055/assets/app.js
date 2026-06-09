(function () {
    var menuButton = document.querySelector(".menu-button");
    var mainNav = document.querySelector(".main-nav");

    if (menuButton && mainNav) {
        menuButton.addEventListener("click", function () {
            var isOpen = mainNav.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeIndex);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
            showSlide(dotIndex);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5000);
    }

    var grid = document.getElementById("searchGrid");
    var searchInput = document.getElementById("movieSearch");
    var typeFilter = document.getElementById("typeFilter");
    var regionFilter = document.getElementById("regionFilter");
    var yearFilter = document.getElementById("yearFilter");

    function readQuery() {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q") || "";
        if (searchInput && q) {
            searchInput.value = q;
        }
    }

    function filterCards() {
        if (!grid) {
            return;
        }

        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var typeValue = typeFilter ? typeFilter.value : "";
        var regionValue = regionFilter ? regionFilter.value : "";
        var yearValue = yearFilter ? yearFilter.value : "";
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

        cards.forEach(function (card) {
            var text = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-type") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-genre") || "",
                card.getAttribute("data-tags") || "",
                card.textContent || ""
            ].join(" ").toLowerCase();

            var typeOk = !typeValue || card.getAttribute("data-type") === typeValue;
            var regionOk = !regionValue || card.getAttribute("data-region") === regionValue;
            var yearOk = !yearValue || card.getAttribute("data-year") === yearValue;
            var queryOk = !query || text.indexOf(query) !== -1;

            card.classList.toggle("is-hidden", !(typeOk && regionOk && yearOk && queryOk));
        });
    }

    [searchInput, typeFilter, regionFilter, yearFilter].forEach(function (item) {
        if (item) {
            item.addEventListener("input", filterCards);
            item.addEventListener("change", filterCards);
        }
    });

    readQuery();
    filterCards();

    window.initPlayer = function (playUrl) {
        var video = document.getElementById("videoPlayer");
        var cover = document.getElementById("playCover");
        var hlsInstance = null;
        var ready = false;

        if (!video || !playUrl) {
            return;
        }

        function bindVideo() {
            if (ready) {
                return;
            }

            ready = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playUrl);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = playUrl;
            } else {
                video.src = playUrl;
            }
        }

        function startVideo() {
            bindVideo();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    if (cover) {
                        cover.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (cover) {
            cover.addEventListener("click", startVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startVideo();
            }
        });

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
}());
