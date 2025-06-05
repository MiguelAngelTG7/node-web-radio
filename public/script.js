const audio = document.getElementById('player');
const title = document.getElementById('track-title');
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
}

function pauseTrack() {
  audio.pause();
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

fetch('/api/playlist')
  .then(res => res.json())
  .then(files => {
    if (!files.length) {
      title.textContent = "No tracks found.";
      return;
    }
    playlist = files;
    loadTrack(currentIndex);

    audio.addEventListener('ended', nextTrack);

    document.getElementById('play').onclick = playTrack;
    document.getElementById('pause').onclick = pauseTrack;
    document.getElementById('next').onclick = nextTrack;
    document.getElementById('prev').onclick = prevTrack;
    document.getElementById('shuffle').onclick = toggleShuffle;
  });
