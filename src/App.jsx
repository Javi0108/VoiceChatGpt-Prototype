import { useState, useRef } from "react";
import TextToSpeech from "./components/TextToSpeech";
import ConversationalAiButton from "./components/ConversationalAI/ConversationalAiButton";
import "./style/App.css";
import { set } from "@elevenlabs/elevenlabs-js/core/schemas";

function App() {
  const [text, setText] = useState("");
  const textAreaRef = useRef(null);

  const handleInput = (e) => {
    const textarea = textAreaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(e.target.value);
  }

  return (
    <>
      <span className="title">¿Que tienes en mente hoy?</span>
      <div className="container">
        <textarea
          ref={textAreaRef}
          className="promptText"
          placeholder="Escribe algo..."
          onChange={(e) => setText(e.target.value)}
          onInput={handleInput}
          cols={65}
          value={text}
        ></textarea>
        <div className="optionButtons">
          <TextToSpeech text={text} />
          <ConversationalAiButton />
        </div>
      </div>
    </>
  );
}

export default App;
