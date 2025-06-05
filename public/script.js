const audio = document.getElementById('player');
let playlist = [];
let currentIndex = 0;
let isRandom = false;

function playSong() {
  audio.play();
}

function pauseSong() {
  audio.pause();
}

function stopSong() {
  audio.pause();
  audio.currentTime = 0;
}

function nextSong() {
  if (isRandom) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadAndPlay();
}

function prevSong() {
  if (isRandom) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  }
  loadAndPlay();
}

function toggleRandom() {
  isRandom = !isRandom;
  document.getElementById('randomStatus').textContent = isRandom ? 'ON' : 'OFF';
}

function loadAndPlay() {
  audio.src = `music/${playlist[currentIndex]}`;
  audio.play();
}

fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (!files.length) {
      alert('No hay canciones en la carpeta /music');
      return;
    }

    playlist = files;
    loadAndPlay();

    audio.addEventListener('ended', nextSong);
  })
  .catch(err => {
    console.error('Error al obtener la playlist:', err);
  });
