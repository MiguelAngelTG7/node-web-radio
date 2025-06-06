const audio = document.getElementById('player');
const title = document.getElementById('track-title');
const cover = document.getElementById('cover');

let playlist = [];
let currentIndex = 0;
let isShuffle = false;

// ✅ Carga la canción por índice y la reproduce
function loadTrack(index) {
  const track = playlist[index];
  audio.src = `music/${track}`;
  title.textContent = track;
  audio.play();
}

// ✅ Avanza a la siguiente canción (aleatoria si shuffle está activo)
function nextTrack() {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
}

// ✅ Retrocede a la canción anterior
function prevTrack() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentIndex);
}

// ✅ Alterna el estado de shuffle y cambia el color del botón
function toggleShuffle() {
  isShuffle = !isShuffle;
  const shuffleBtn = document.getElementById('shuffle');
  shuffleBtn.style.backgroundColor = isShuffle ? '#e0e0e0' : '#ffffff'; // blanco oscuro o normal
}

// ✅ Carga la playlist desde la API
fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (!files.length) {
      title.textContent = "No tracks found.";
      return;
    }

    playlist = files;
    currentIndex = Math.floor(Math.random() * playlist.length); // Comienza con una canción aleatoria
    loadTrack(currentIndex); // Reproduce automáticamente

    // ✅ Reproduce la siguiente canción al terminar la actual
    audio.addEventListener('ended', nextTrack);

    // ✅ Botones de control
    document.getElementById('next').onclick = nextTrack;
    document.getElementById('prev').onclick = prevTrack;
    document.getElementById('shuffle').onclick = toggleShuffle;

    // ✅ Animación de latido cuando suena música
    audio.addEventListener('play', () => {
      cover.classList.add('heartbeat');
    });
    audio.addEventListener('pause', () => {
      cover.classList.remove('heartbeat');
    });
    audio.addEventListener('ended', () => {
      cover.classList.remove('heartbeat');
    });
  });
