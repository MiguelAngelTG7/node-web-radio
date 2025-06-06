const audio = document.getElementById('player');
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
  audio.play();
}

function nextTrack() {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentIndex);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert(`Shuffle ${isShuffle ? "enabled" : "disabled"}`);
}

fetch('/api/playlist')
  .then(res => res.json())
  .then(tracks => {
    if (!tracks.length) {
      songTitle.textContent = "No tracks found.";
      return;
    }
    playlist = tracks;
    currentIndex = Math.floor(Math.random() * playlist.length);
    loadTrack(currentIndex);

    audio.addEventListener('ended', nextTrack);
    document.getElementById('next').onclick = nextTrack;
    document.getElementById('prev').onclick = prevTrack;
    document.getElementById('shuffle').onclick = toggleShuffle;
  });
