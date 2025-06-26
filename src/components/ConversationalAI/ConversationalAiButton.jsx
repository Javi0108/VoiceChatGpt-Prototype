import React, { useState } from "react";
import "../../style/ConversationalAI/ConversationalAiButton.css";
import AgentImg from "../../assets/agent.svg";
import ConversationalAi from "./ConversationalAI";

function ConversationalAiButton() {
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
        title="Iniciar conversación"
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
      {wasStarted && <ConversationalAi active={active} onClose={handleOnClose} />}
    </>
  );
}

export default ConversationalAiButton;
