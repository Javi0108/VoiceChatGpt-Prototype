import { useState, useRef } from "react";
import TextToSpeech from "./components/TextToSpeech";
import ConversationalAiButton from "./components/ConversationalAI/ConversationalAiButton";
import "./style/App.css";

function App() {
  const [text, setText] = useState("");


  return (
    <>
      <span className="title">¿Que tienes en mente hoy?</span>
      <div className="container">
        <textarea
          className="promptText"
          placeholder="Escribe algo..."
          onChange={(e) => setText(e.target.value)}
          cols={65}
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
