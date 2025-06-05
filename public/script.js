const audio = document.getElementById('audio');
const songTitle = document.getElementById('songTitle');

const btnPlayPause = document.getElementById('playPause');
const btnStop = document.getElementById('stop');
const btnNext = document.getElementById('next');
const btnPrev = document.getElementById('prev');
const btnShuffle = document.getElementById('shuffle');

let playlist = [];
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;

// Carga la lista de canciones desde el backend o carpeta /music
fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (files.length === 0) {
      songTitle.textContent = 'No hay canciones en la carpeta /music';
      return;
    }
    playlist = files;
    loadSong(currentIndex);
  })
  .catch(() => {
    songTitle.textContent = 'Error cargando la lista de canciones';
  });

// Cargar canción y actualizar título
function loadSong(index) {
  audio.src = `music/${playlist[index]}`;
  songTitle.textContent = playlist[index];
}

// Play o Pause según el estado actual
function togglePlayPause() {
  if (!isPlaying) {
    audio.play();
  } else {
    audio.pause();
  }
}

audio.onplay = () => {
  isPlaying = true;
  btnPlayPause.innerHTML = '<i class="fas fa-pause"></i>';
  btnPlayPause.title = "Pausar";
};

audio.onpause = () => {
  isPlaying = false;
  btnPlayPause.innerHTML = '<i class="fas fa-play"></i>';
  btnPlayPause.title = "Reproducir";
};

btnPlayPause.addEventListener('click', togglePlayPause);

// Stop: pausa y vuelve al inicio
btnStop.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
});

// Siguiente canción
btnNext.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadSong(currentIndex);
  audio.play();
});

// Canción anterior
btnPrev.addEventListener('click', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  }
  loadSong(currentIndex);
  audio.play();
});

// Reproducción aleatoria toggle
btnShuffle.addEventListener('click', () => {
  isShuffle = !isShuffle;
  btnShuffle.classList.toggle('active', isShuffle);
});

// Cuando termina una canción, pasar a la siguiente
audio.addEventListener('ended', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadSong(currentIndex);
  audio.play();
});
