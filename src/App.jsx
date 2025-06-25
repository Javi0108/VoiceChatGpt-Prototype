import { useState, useRef } from "react";
import TextToSpeech from "./components/TextToSpeech";
import ConversationalAi from "./components/ConversationalAi";
import "./style/App.css";

function App() {
  const [text, setText] = useState("");


  return (
    <>
      <h1>¿Que tienes en mente hoy?</h1>
      <div className="container">
        <textarea
          className="promptText"
          placeholder="Escribe algo..."
          onChange={(e) => setText(e.target.value)}
          cols={65}
        ></textarea>
        <div className="optionButtons">
          <TextToSpeech text={text} />
          <ConversationalAi />
        </div>
      </div>
    </>
  );
}

export default App;
