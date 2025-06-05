const audio = document.getElementById('player');
const title = document.getElementById('track-title');
const togglePlayBtn = document.getElementById('toggle-play');
let playlist = [];
let currentIndex = 0;
let isShuffle = false;

function loadTrack(index) {
  const track = playlist[index];
  audio.src = `music/${track}`;
  title.textContent = track;
}

function playTrack() {
  audio.play();
  togglePlayBtn.classList.add('playing');
}

function pauseTrack() {
  audio.pause();
  togglePlayBtn.classList.remove('playing');
}

function nextTrack() {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
  playTrack();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentIndex);
  playTrack();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert(`Shuffle ${isShuffle ? "enabled" : "disabled"}`);
}

function togglePlayPause() {
  if (audio.paused) {
    playTrack();
  } else {
    pauseTrack();
  }
}

fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (!files.length) {
      title.textContent = "No tracks found.";
      return;
    }
    playlist = files;
    currentIndex = Math.floor(Math.random() * playlist.length); // Auto aleatorio
    loadTrack(currentIndex);
    playTrack(); // Autoplay

    audio.addEventListener('ended', nextTrack);
    togglePlayBtn.addEventListener('click', togglePlayPause);
    document.getElementById('next').onclick = nextTrack;
    document.getElementById('prev').onclick = prevTrack;
    document.getElementById('shuffle').onclick = toggleShuffle;
  });
