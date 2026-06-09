(function () {
    "use strict";

    function initPlayer(box) {
        var video = box.querySelector("video");
        var button = box.querySelector(".player-start");
        var status = box.querySelector(".player-status");
        var source = box.getAttribute("data-src");
        var hls = null;
        var loaded = false;

        function setStatus(text) {
            if (status) {
                status.textContent = text || "";
            }
        }

        function attachSource() {
            if (loaded) {
                return Promise.resolve();
            }
            loaded = true;
            setStatus("播放源准备中");
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus("");
                    video.play().catch(function () {
                        setStatus("点击播放器继续播放");
                    });
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus("播放源暂时不可用");
                    }
                });
                return Promise.resolve();
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return video.play().then(function () {
                    setStatus("");
                }).catch(function () {
                    setStatus("点击播放器继续播放");
                });
            }
            setStatus("当前浏览器需要加载 HLS 播放组件");
            return Promise.resolve();
        }

        if (!video || !button || !source) {
            return;
        }

        button.addEventListener("click", function () {
            box.classList.add("is-playing");
            attachSource().then(function () {
                video.play().catch(function () {
                    setStatus("点击播放器继续播放");
                });
            });
        });

        video.addEventListener("play", function () {
            box.classList.add("is-playing");
            setStatus("");
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll("[data-player]").forEach(initPlayer);
    });
})();
