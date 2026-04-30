const API_URL = "https://api.jamendo.com/v3.0/tracks/?client_id=7d53593d&format=json&limit=20";

let songs = [];
let currentIndex = 0;
let isPlaying = false;

const grid = document.getElementById("songGrid");
const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("nowPlaying");
const progress = document.getElementById("progress");

// Load songs
async function loadSongs() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    songs = data.results;
    renderSongs(songs);
  } catch (err) {
    console.error("Error:", err);
  }
}

// Render UI
function renderSongs(list) {
  grid.innerHTML = "";

  list.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${song.album_image}" />
      <p>${song.name}</p>
      <small>${song.artist_name}</small>
    `;

    card.onclick = () => playSong(index);

    grid.appendChild(card);
  });
}

// Play song
function playSong(index) {
  currentIndex = index;
  audio.src = songs[index].audio;

  nowPlaying.textContent =
    songs[index].name + " - " + songs[index].artist_name;

  audio.play();
  isPlaying = true;
}

// Play/Pause
function playPause() {
  if (!audio.src) return;

  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }

  isPlaying = !isPlaying;
}

// Next
function nextTrack() {
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
}

// Previous
function prevTrack() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
}

// Progress update
audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

// Seek
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Auto next
audio.addEventListener("ended", nextTrack);

// Search
document.getElementById("searchBox").addEventListener("input", (e) => {
  const q = e.target.value.toLowerCase();

  const filtered = songs.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.artist_name.toLowerCase().includes(q)
  );

  renderSongs(filtered);
});

loadSongs();
