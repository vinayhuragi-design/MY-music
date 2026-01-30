const CLIENT_ID = "7d53593d"; 
const API_URL = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=50&include=musicinfo+stats+licenses&audioformat=mp32`;

let track_list = [];
let track_index = 0;
let isPlaying = false;
let updateTimer;

const curr_track = document.createElement("audio");

const track_art = document.getElementById("track_art");
const track_name = document.getElementById("track_name");
const track_artist = document.getElementById("track_artist");
const playpause_btn = document.getElementById("playpause");
const seek_slider = document.getElementById("seek_slider");
const volume_slider = document.getElementById("volume_slider");
const curr_time = document.getElementById("current-time");
const total_duration = document.getElementById("total-duration");

async function loadTracksFromAPI() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    track_list = data.results.map(song => ({
      name: song.name,
      artist: song.artist_name,
      image: song.album_image,
      path: song.audio
    }));

    console.log("Loaded songs:", track_list.length);

    loadTrack(0); // Load the first track
  } catch (err) {
    console.error("API ERROR:", err);
  }
}


function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();

  curr_track.src = track_list[index].path;
  curr_track.load();

  track_art.src = track_list[index].image;
  track_name.textContent = track_list[index].name;
  track_artist.textContent = track_list[index].artist;

  updateTimer = setInterval(seekUpdate, 1000);
}


function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}


function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play"></i>';
}


function nextTrack() {
  track_index = (track_index + 1) % track_list.length;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  track_index = (track_index - 1 + track_list.length) % track_list.length;
  loadTrack(track_index);
  playTrack();
}


seek_slider.addEventListener("input", () => {
  curr_track.currentTime = curr_track.duration * (seek_slider.value / 100);
});

volume_slider.addEventListener("input", () => {
  curr_track.volume = volume_slider.value / 100;
});

function seekUpdate() {
  if (!isNaN(curr_track.duration)) {
    let pos = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = pos;

    let cm = Math.floor(curr_track.currentTime / 60);
    let cs = Math.floor(curr_track.currentTime % 60);
    let dm = Math.floor(curr_track.duration / 60);
    let ds = Math.floor(curr_track.duration % 60);

    curr_time.textContent = `${cm}:${cs < 10 ? "0" : ""}${cs}`;
    total_duration.textContent = `${dm}:${ds < 10 ? "0" : ""}${ds}`;
  }
}


loadTracksFromAPI();
