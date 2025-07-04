import React, { useState } from "react";
import "../../style/ConversationalAI/ConversationalAiButton.css";
import AgentImg from "../../assets/agent.svg";
import ConversationalAI from "./ConversationalAI";

function ConversationalAiButton({ dark }) {
  const [wasStarted, setWasStarted] = useState(false);
  const [active, setActive] = useState(false);

  const handleButtonClick = () => {
    if (!wasStarted) setWasStarted(true)
    setActive((prev) => !prev);
  };

  const handleOnClose = () => {
    setActive(false);
    setWasStarted(false);
  }

  return (
    <>
      <button
        className={"conversationalAiButton"}
        onClick={handleButtonClick}
        title="Iniciar conversación con IA"
      >
        <span className="icon">
          <img
            src={AgentImg}
            className="icon"
            alt="Imagen del agente de IA"
            width={"100%"}
          />
        </span>
        <span className="conversationLabel">Iniciar Conversación</span>
      </button>
      {wasStarted && <ConversationalAI active={active} onClose={handleOnClose} dark={dark} />}
    </>
  );
}

export default ConversationalAiButton;
