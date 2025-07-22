import React, { useState } from "react";
import "../style/TextToSpeech.css";

function TextToSpeech(text) {
  const [reading, setReading] = useState(false);

  async function SpeechText() {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId = "JBFqnCBsd6RMkjVDRZzb";
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: text.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    });

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      setReading(false);
    };
  }

  const handeClick = () => {
    if (reading) {
      setReading(false);
    } else {
      setReading(true);
      SpeechText();
    }
  };

  return (
    <button
      className={reading ? "clickedTextToSpeechButton" : "textToSpeechButton"}
      onClick={handeClick}
      disabled = {reading ? "disabled" : ""}
      title="Read aloud"
    >
      <span className="icon">
        <i className="bi bi-volume-up-fill"></i>
      </span>
    </button>
  );
}

export default TextToSpeech;
