import React, { useState } from "react";
import MoodDetector from "./components/MoodDetector";
import SongList from "./components/SongList";

function App() {
  const [songs, setSongs] = useState([]);
  const [mood, setMood] = useState("");

  console.log(songs);
  

  // 🧠 When mood is detected by camera
  const handleMoodDetected = async (detectedMood) => {
    setMood(detectedMood);

    // try {
    //   const response = await fetch(`http://localhost:3000/api/songs?mood=${detectedMood}`);
    //   const data = await response.json();
    //   console.log("Fetched songs:", data.songs); 
    //   setSongs(data.songs || []);
    // } catch (err) {
    //   console.error("❌ Failed to fetch songs:", err);
    // }
  };

  return (
    <div className="App">
      <MoodDetector onMoodDetected={handleMoodDetected} setSongs={setSongs} />
      <SongList songs={songs} />
    </div>
  );
}

export default App;
