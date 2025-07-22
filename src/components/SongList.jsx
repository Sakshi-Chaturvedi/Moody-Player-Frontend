import React, { useRef, useState } from 'react';


const SongList = ({ songs }) => {
  const audioRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);

  const handleToggle = (index) => {
    const currentAudio = audioRefs.current[index];

    if (playingIndex === index) {
      currentAudio.pause();
      setPlayingIndex(null);
    } else {
      // Pause the previous one
      if (playingIndex !== null && audioRefs.current[playingIndex]) {
        audioRefs.current[playingIndex].pause();
        audioRefs.current[playingIndex].currentTime = 0;
      }

      currentAudio.play();
      setPlayingIndex(index);
    }
  };

  return (
    <div className="song-list-ui">
      <h2 className="ui-heading">🎶 Mood-Based Song List</h2>
      <ul className="ui-ul">
        {songs.map((song, index) => (
          <li key={index} className="ui-song-card">
            <div className="ui-info">
              <div className="ui-title">{song.title}</div>
              <div className="ui-artist">{song.artist}</div>
            </div>

            <audio
              ref={(el) => (audioRefs.current[index] = el)}
              src={song.audio}
              onEnded={() => setPlayingIndex(null)} // Reset on song end
            />

            <div className="ui-controls">
              <button
                className="ui-btn"
                onClick={() => handleToggle(index)}
              >
                {playingIndex === index ? '⏸ Pause' : '▶️ Play'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongList;
