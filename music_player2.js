const songList = document.getElementById('song-list');
const genreFilter = document.getElementById('genre-filter');
const searchInput = document.getElementById('search-input');
const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const audioPlayer = document.getElementById('audio-player');
const currentPlaylist = document.getElementById('current-playlist');
const allPlaylists = document.getElementById('all-playlists');
const playlistName = document.getElementById('playlist-name');
const createPlaylistBtn = document.getElementById('create-playlist');
const addToPlaylistBtn = document.getElementById('add-to-playlist');
const removeFromPlaylistBtn = document.getElementById('remove-from-playlist');
const prevBtn = document.getElementById('prev-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const savePlaylistsBtn = document.getElementById('save-playlists');
const loadPlaylistsBtn = document.getElementById('load-playlists');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progressEl = document.getElementById('progress');

// Sample song data
const songs = [
    {
        title: 'Lag ja Gale',
        artist: 'Lata Mangeshkar',
        genre: 'Old',
        artUrl: 'ljg.jpg',
        audioUrl: 'lag ja gale.mp3',
        duration: '233'
    },
    {
        title: 'Dil Sambhal Ja Zara ',
        artist: 'Arijit Singh',
        genre: 'Old',
        artUrl: 'Dsjz.jpg',
        audioUrl: 'Dil-sambhal-Ja-zara.jpg',
        duration: '269'
    },
    // Add more songs here
    ,
    {
        title: 'Pal Pal dil K sath',
        artist: 'Kishore Kumar',
        genre: 'Old',
        artUrl: 'https://example.com/all-of-me.jpg',
        audioUrl: 'https://example.com/all-of-me.mp3',
        duration: '269'
    },,
    {
        title: 'Lover',
        artist: 'Taylor Swift',
        genre: 'Taylor Swift',
        artUrl: 'lover.jpg',
        audioUrl: 'lover.mp3',
        duration: '269'
    },,
    {
        title: 'Cruel Summer',
        artist: 'Taylor Swift',
        genre: 'Taylor Swift',
        artUrl: 'cruel summer.jpg',
        audioUrl: 'Cruel Summer.mp3',
        duration: '269'
    },,
    {
        title: 'Venom',
        artist: 'Adele',
        genre: 'BlackPink',
        artUrl: 'venom.jpg',
        audioUrl: 'venom.mp3',
        duration: '269'
    },,
    {
        title: 'Bejeweled',
        artist: 'Taylor Swift',
        genre: 'Taylor Swift',
        artUrl: 'bejewled.jpg',
        audioUrl: 'Bejewled.mp3',
        duration: '269'
    },,
    {
        title: 'All Of Me',
        artist: 'Adele',
        genre: 'BlackPink',
        artUrl: 'https://example.com/all-of-me.jpg',
        audioUrl: 'https://example.com/all-of-me.mp3',
        duration: '269'
    },,
    {
        title: 'All Of Me',
        artist: 'Taylor Swift',
        genre: 'Taylor Swift',
        artUrl: 'https://example.com/all-of-me.jpg',
        audioUrl: 'https://example.com/all-of-me.mp3',
        duration: '269'
    },
    
       
];

// Initialize playlists
let playlists = [];
let currentPlaylistIndex = -1;
let shuffledSongs = [];
let currentSongIndex = 0;
let isShuffled = false;
let isRepeated = false;
let currentSong = null;
let isDragging = false;
let draggedSong = null;

// Populate song list
function populateSongList(genre = 'all', searchTerm = '') {
    songList.innerHTML = '';
    const filteredSongs = songs.filter(song => {
        return (
            (genre === 'all' || song.genre === genre) &&
            (searchTerm === '' || song.title.toLowerCase().includes(searchTerm.toLowerCase()) || song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    filteredSongs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => playSong(song));
        songList.appendChild(li);
    });
}

// Play a song
function playSong(song) {
    if (currentSong !== song) {
        currentSong = song;
        albumArt.src = song.artUrl;
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        audioPlayer.src = song.audioUrl;
        audioPlayer.currentTime = 0;
        audioPlayer.play();
        updateDuration(song.duration);
    } else {
        togglePlayPause();
    }
}

// Update song duration
function updateDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    durationEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Update song progress
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progress = (currentTime / duration) * 100;
    progressEl.style.width = `${progress}%`;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
}

// Filter songs by genre
genreFilter.addEventListener('change', () => {
    const selectedGenre = genreFilter.value;
    const searchTerm = searchInput.value.trim();
    populateSongList(selectedGenre, searchTerm);
});

// Search for songs
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim();
    const selectedGenre = genreFilter.value;
    populateSongList(selectedGenre, searchTerm);
});

// Create a new playlist
createPlaylistBtn.addEventListener('click', () => {
    const name = playlistName.value.trim();
    if (name) {
        const playlist = { name, songs: [] };
        playlists.push(playlist);
        const li = document.createElement('li');
        li.textContent = name;
        li.addEventListener('click', () => showPlaylist(playlists.indexOf(playlist)));
        allPlaylists.appendChild(li);
        playlistName.value = '';
    }
});

// Show playlist
function showPlaylist(index) {
    currentPlaylistIndex = index;
    currentPlaylist.innerHTML = '';
    const playlist = playlists[currentPlaylistIndex];
    playlist.songs.forEach((song, i) => {
        const li = document.createElement('li');
        li.textContent = `${song.title} - ${song.artist}`;
        li.addEventListener('click', () => playSong(song));
        li.addEventListener('dragstart', () => dragStartHandler(i));
        li.addEventListener('dragover', e => e.preventDefault());
        li.addEventListener('drop', () => dropHandler(i));
        currentPlaylist.appendChild(li);
    });
}

// Add song to playlist
addToPlaylistBtn.addEventListener('click', () => {
    if (currentPlaylistIndex !== -1) {
        const selectedSongs = songs.filter((song, index) => songList.children[index].classList.contains('selected'));
        const playlist = playlists[currentPlaylistIndex];
        selectedSongs.forEach(song => {
            if (!playlist.songs.includes(song)) {
                playlist.songs.push(song);
                const li = document.createElement('li');
                li.textContent = `${song.title} - ${song.artist}`;
                li.addEventListener('click', () => playSong(song));
                li.addEventListener('dragstart', () => dragStartHandler(playlist.songs.length - 1));
                li.addEventListener('dragover', e => e.preventDefault());
                li.addEventListener('drop', () => dropHandler(playlist.songs.length - 1));
                currentPlaylist.appendChild(li);
            }
        });
    }
});

// Remove song from playlist
removeFromPlaylistBtn.addEventListener('click', () => {
    if (currentPlaylistIndex !== -1) {
        const selectedSongs = Array.from(currentPlaylist.children).filter(li => li.classList.contains('selected'));
        const playlist = playlists[currentPlaylistIndex];
        selectedSongs.forEach(li => {
            const song = playlist.songs.find(song => `${song.title} - ${song.artist}` === li.textContent);
            const index = playlist.songs.indexOf(song);
            if (index !== -1) {
                playlist.songs.splice(index, 1);
                li.remove();
            }
        });
    }
});

// Playlist item selection
songList.addEventListener('click', event => {
    if (event.target.nodeName === 'LI') {
        event.target.classList.toggle('selected');
    }
});

currentPlaylist.addEventListener('click', event => {
    if (event.target.nodeName === 'LI') {
        event.target.classList.toggle('selected');
    }
});

// Prev/Next song controls
function playNextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * shuffledSongs.length);
        playSong(shuffledSongs[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylistIndex].songs.length;
        playSong(playlists[currentPlaylistIndex].songs[currentSongIndex]);
    }
}

function playPrevSong() {
    if (isShuffled) {
        currentSongIndex = (currentSongIndex - 1 + shuffledSongs.length) % shuffledSongs.length;
        playSong(shuffledSongs[currentSongIndex]);
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlists[currentPlaylistIndex].songs.length) % playlists[currentPlaylistIndex].songs.length;
        playSong(playlists[currentPlaylistIndex].songs[currentSongIndex]);
    }
}

nextBtn.addEventListener('click', playNextSong);
prevBtn.addEventListener('click', playPrevSong);

// Play/Pause control
function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.children[0].classList.remove('fa-play');
        playPauseBtn.children[0].classList.add('fa-pause');
    } else {
        audioPlayer.pause();
        playPauseBtn.children[0].classList.remove('fa-pause');
        playPauseBtn.children[0].classList.add('fa-play');
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);
audioPlayer.addEventListener('timeupdate', updateProgress);

// Shuffle control
shuffleBtn.addEventListener('click', () => {
    isShuffled = !isShuffled;
    if (isShuffled) {
        shuffledSongs = [...playlists[currentPlaylistIndex].songs];
        shuffleSongs(shuffledSongs);
        currentSongIndex = 0;
        playSong(shuffledSongs[currentSongIndex]);
    } else {
        currentSongIndex = 0;
        playSong(playlists[currentPlaylistIndex].songs[currentSongIndex]);
    }
});

// Repeat control
repeatBtn.addEventListener('click', () => {
    isRepeated = !isRepeated;
    if (isRepeated) {
        audioPlayer.loop = true;
    } else {
        audioPlayer.loop = false;
    }
});

// Shuffle songs
function shuffleSongs(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Save playlists
savePlaylistsBtn.addEventListener('click', () => {
    const playlistsData = JSON.stringify(playlists);
    localStorage.setItem('playlists', playlistsData);
});

// Load playlists
loadPlaylistsBtn.addEventListener('click', () => {
    const playlistsData = localStorage.getItem('playlists');
    if (playlistsData) {
        playlists = JSON.parse(playlistsData);
        allPlaylists.innerHTML = '';
        playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.textContent = playlist.name;
            li.addEventListener('click', () => showPlaylist(playlists.indexOf(playlist)));
            allPlaylists.appendChild(li);
        });
    }
});

// Drag and Drop handlers
function dragStartHandler(index) {
    isDragging = true;
    draggedSong = playlists[currentPlaylistIndex].songs[index];
}

function dropHandler(index) {
    if (isDragging) {
        const playlist = playlists[currentPlaylistIndex];
        const draggedSongIndex = playlist.songs.indexOf(draggedSong);
        playlist.songs.splice(draggedSongIndex, 1);
        playlist.songs.splice(index, 0, draggedSong);
        showPlaylist(currentPlaylistIndex);
        isDragging = false;
        draggedSong = null;
    }
}

currentPlaylist.addEventListener('dragover', e => {
    e.preventDefault();
    const targetLi = e.target.closest('li');
    if (targetLi) {
        targetLi.classList.add('over');
    }
});

currentPlaylist.addEventListener('dragleave', e => {
    const targetLi = e.target.closest('li');
    if (targetLi) {
        targetLi.classList.remove('over');
    }
});
