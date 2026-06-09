function startMoviePlayer(videoId, buttonId, sourceUrl) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  var hls = null;
  var ready = false;

  function load() {
    if (!video || ready) {
      return;
    }
    ready = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  }

  function play() {
    if (!video) {
      return;
    }
    load();
    if (button) {
      button.classList.add('is-hidden');
    }
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
    video.addEventListener('ended', function () {
      if (button) {
        button.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
