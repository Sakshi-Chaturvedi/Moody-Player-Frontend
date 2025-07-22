import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function MoodDetector({ onMoodDetected, setSongs }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const [mood, setMood] = useState("Not started");
  const [emoji, setEmoji] = useState("🕹️");
  const [isDetecting, setDetect] = useState(false);

  const moodEmoji = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    neutral: "😐",
    fearful: "😨",
    disgusted: "🤢",
  };

  useEffect(() => {
    const loadModels = async () => {
      const URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(URL),
        faceapi.nets.faceExpressionNet.loadFromUri(URL),
      ]);
      console.log("✅ Models loaded");
    };

    loadModels();
  }, []);

  const startDetection = async () => {
    setDetect(true);
    setMood("Detecting...");
    setEmoji("🤔");

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: 480, height: 360 };
    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections.length) return;

      const expressions = detections[0].expressions;
      const moodDetected = Object.entries(expressions).sort(
        (a, b) => b[1] - a[1]
      )[0][0];

      console.log("🎯 Mood Detected:", moodDetected);
      setMood(moodDetected);
      setEmoji(moodEmoji[moodDetected] || "🙂");
      setDetect(false);

      // 🧠 Call your backend here using axios
      try {
        const res = await axios.get(
          `http://localhost:3000/songs?mood=${moodDetected}`
        );

        setSongs(res.data.songs || []);
      } catch (err) {
        console.error("❌ Error fetching songs:", err);
      }

      clearInterval(intervalRef.current);
      stream.getTracks().forEach((track) => track.stop());
    };

    video.addEventListener(
      "playing",
      () => {
        intervalRef.current = setInterval(detect, 600);
      },
      { once: true }
    );
  };

  return (
    <div
      style={{
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 40,
        paddingBottom: 20,
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 600, marginBottom: 20 }}>
        🧠 Welcome to <span style={{ color: "#3f51b5" }}>Moody Player</span>
      </h1>

      <div
        style={{
          position: "relative",
          width: 480,
          height: 360,
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
        }}
      >
        <video
          ref={videoRef}
          width={480}
          height={360}
          autoPlay
          muted
          playsInline
          style={{ display: "block" }}
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      {!isDetecting && (
        <button
          onClick={startDetection}
          style={{
            marginTop: 20,
            padding: "10px 22px",
            fontSize: 16,
            background: "#3f51b5",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          🎬 Detect Mood
        </button>
      )}

      <div
        style={{
          marginTop: 25,
          background: "#fff",
          padding: "10px 22px",
          borderRadius: 8,
          fontSize: 18,
        }}
      >
        {emoji} <strong>Mood:</strong> {mood}
      </div>
    </div>
  );
}
