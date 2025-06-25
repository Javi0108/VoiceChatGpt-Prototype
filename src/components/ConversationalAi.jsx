import React, { useState } from "react";
import { Conversation } from "@elevenlabs/client";
import "../style/ConversationalAi.css";
import AgentImg from "../assets/agent.svg";
import StopImg from "../assets/stop.svg";

function ConversationalAi() {
  const [connected, setConnected] = useState(false);
  const [conversation, setConversation] = useState(null);

  async function startConversation() {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation
      const newConversation = await Conversation.startSession({
        agentId: "agent_01jykndy1fe7bsjqyh8d6dq9j8", // Replace with your agent ID
        onConnect: () => {
          setConnected(true);
        },
        onDisconnect: () => {
          setConnected(false);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      });

      setConversation(newConversation);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }

  function stopConversation() {
    if (conversation) {
      conversation.endSession();
      setConversation(null);
      setConnected(false);
    }
  }

  const hadleButtonClick = () => {
    if (conversation) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  return (
    <>
      <button
        className={
          conversation
            ? "clickedConversationalAiButton"
            : "conversationalAiButton"
        }
        id="conversationButton"
        onClick={hadleButtonClick}
        title={conversation ? "Detener conversación" : "Iniciar conversación"}
      >
        <span className="icon">
          {conversation ? (
            <img src={StopImg} className="icon" alt="Imagen de Stop" width={"100%"} />
          ) : (
            <img src={AgentImg} className="icon" alt="Imagen del agente de IA" width={"100%"} />
          )}
        </span>
      </button>
    </>
  );
}

export default ConversationalAi;
