function initMoviePlayer(streamUrl) {
  const video = document.getElementById('movie-player');
  const cover = document.querySelector('[data-player-cover]');
  const message = document.querySelector('[data-player-message]');

  if (!video || !streamUrl) {
    return;
  }

  let hls = null;

  const showMessage = (text) => {
    if (message) {
      message.textContent = text;
      message.classList.add('show');
    }
  };

  const attach = () => {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, (event, data) => {
        if (data && data.fatal) {
          showMessage('播放暂时无法加载，请稍后再试');
        }
      });
      return;
    }

    video.src = streamUrl;
  };

  const play = () => {
    if (cover) {
      cover.classList.add('is-hidden');
    }
    video.setAttribute('controls', 'controls');
    const task = video.play();
    if (task && typeof task.catch === 'function') {
      task.catch(() => {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
        showMessage('点击播放按钮即可继续观看');
      });
    }
  };

  attach();

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
}
