import { useState, useRef } from "react";
import TextToSpeech from "./components/TextToSpeech";
import ConversationalAiButton from "./components/ConversationalAI/ConversationalAiButton";
import "./style/App.css";

function App() {
  const [text, setText] = useState("");
  const textAreaRef = useRef(null);
  const [dark, setDark] = useState(false);
  document.documentElement.classList.remove("light");

  const handleInput = (e) => {
    const textarea = textAreaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setText(e.target.value);
  };

  const handleColorScheme = () => {
    if (dark == true) {
      setDark(false);
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setDark(true);
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <>
      <span className="title">¿Que tienes en mente hoy?</span>
      <div className={dark ? "container" : "container light"}>
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
          <div className="left">
            <button
              className="theme"
              onClick={handleColorScheme}
            >
              {dark == true ? (
                <i className="bi bi-brightness-high-fill"></i>
              ) : (
                <i className="bi bi-moon-stars-fill"></i>
              )}
            </button>
          </div>
          <div className="right">
            <TextToSpeech text={text} />
            <ConversationalAiButton dark={dark} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
