const audio = document.getElementById('player');
const togglePlayBtn = document.getElementById('toggle-play');
const cover = document.getElementById('cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const songAlbum = document.getElementById('song-album');

let playlist = [];
let currentIndex = 0;
let isShuffle = false;

function loadTrack(index) {
  const track = playlist[index];
  audio.src = `music/${track.file}`;
  songTitle.textContent = track.title;
  songArtist.textContent = track.artist;
  songAlbum.textContent = `${track.album} (${track.year})`;
  cover.src = track.cover || 'default-cover.png';
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
  .then(tracks => {
    if (!tracks.length) {
      songTitle.textContent = "No tracks found.";
      return;
    }
    playlist = tracks;
    currentIndex = Math.floor(Math.random() * playlist.length); // random start
    loadTrack(currentIndex);
    playTrack(); // autoplay

    audio.addEventListener('ended', nextTrack);
    togglePlayBtn.addEventListener('click', togglePlayPause);
    document.getElementById('next').onclick = nextTrack;
    document.getElementById('prev').onclick = prevTrack;
    document.getElementById('shuffle').onclick = toggleShuffle;
  });
