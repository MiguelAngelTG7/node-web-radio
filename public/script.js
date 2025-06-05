const audio = document.getElementById('player');
const playPauseBtn = document.getElementById('playPauseBtn');
const stopBtn = document.getElementById('stopBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const randomBtn = document.getElementById('randomBtn');
const trackInfo = document.getElementById('trackInfo');

let playlist = [];
let currentIndex = 0;
let isRandom = false;

// Obtener lista
fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (files.length === 0) {
      alert('No hay canciones en la carpeta /music');
      return;
    }
    playlist = files;
    loadAndPlay(currentIndex);
    audio.addEventListener('ended', playNext);
  });

function loadAndPlay(index) {
  const file = playlist[index];
  audio.src = `music/${file}`;
  audio.play();
  updateTrackInfo(file);
  updatePlayPauseIcon();
}

function updateTrackInfo(fileName) {
  trackInfo.textContent = `Reproduciendo: ${fileName}`;
}

function updatePlayPauseIcon() {
  playPauseBtn.textContent = audio.paused ? '▶️' : '⏸';
}

function playNext() {
  if (isRandom) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentIndex && playlist.length > 1);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadAndPlay(currentIndex);
}

function playPrevious() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadAndPlay(currentIndex);
}

// Controles
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
  updatePlayPauseIcon();
});

stopBtn.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
  updatePlayPauseIcon();
});

nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrevious);

randomBtn.addEventListener('click', () => {
  isRandom = !isRandom;
  randomBtn.classList.toggle('active', isRandom);
});
