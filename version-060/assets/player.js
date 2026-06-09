(function () {
  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var button = document.getElementById(options.buttonId);
    var layer = document.getElementById(options.layerId);
    var loaded = false;
    var hls = null;

    function attach() {
      if (loaded || !video || !options.source) {
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = options.source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(options.source);
        hls.attachMedia(video);
      } else {
        video.src = options.source;
      }
    }

    function play() {
      attach();
      if (layer) {
        layer.classList.add("is-hidden");
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          if (layer) {
            layer.classList.remove("is-hidden");
          }
        });
      }
    }

    if (!video) {
      return;
    }
    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }
    if (layer) {
      layer.addEventListener("click", function (event) {
        event.preventDefault();
        play();
      });
    }
    video.addEventListener("click", function () {
      if (!loaded) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
