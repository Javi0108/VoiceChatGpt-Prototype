import React, { useEffect, useRef, useState } from "react";
import "../../style/ConversationalAI/ConversationalAI.css";
import StopImg from "../../assets/stop.svg";
import { Conversation } from "@elevenlabs/client";
import SphereVisualizer from "../Sphere";

function ConversationalAi({ active, onClose }) {
  const [connected, setConnected] = useState(false);
  const [conversation, setConversation] = useState(null);
  const hasStarted = useRef(false);

  async function startConversation() {
    if (hasStarted.current) return;
    hasStarted.current = true;

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
          if (onClose) onClose();
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      });

      setConversation(newConversation);
      hasStarted.current = true;
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  }

  function stopConversation() {
    if (conversation) {
      conversation.endSession();
      setConversation(null);
      setConnected(false);
      hasStarted.current = false;
    }
  }

  useEffect(() => {
    startConversation();

    return () => {
      stopConversation();
    };
  }, []);

  const handleStopClick = () => {
    stopConversation();
    if (onClose) onClose();
  };

  if (!active) return null; 

  return (
    <div className="conversationContainer">
      <SphereVisualizer />
      <div className="controlerButtons">
        <button
          className="stopButton"
          onClick={handleStopClick}
          title={"Finalizar"}
        >
          <span className="icon">
            <img
              src={StopImg}
              className="icon"
              alt="Imagen de Stop"
              width={"100%"}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export default ConversationalAi;
