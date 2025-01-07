import React, { useEffect } from "react";
import { TAgent, useAgentStore } from "../context/village-context";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const RealTimeMessages = () => {
  const { messages, agent, hasAgentLeft } = useAgentStore();

  return (
    <div className="real-time-messages">
      {messages.map((message, index) => (
        <Message message={message} agent={agent} key={`Message-${index}`} />
      ))}
      {hasAgentLeft && (
        <p className="real-time-messages__agent-left">
          Agent has left the chat
        </p>
      )}
    </div>
  );
};

export default RealTimeMessages;

type TMessage = {
  message: string;
  time: number;
  by: "agent" | "consumer";
};

const Message = ({
  message,
  agent,
}: {
  message: TMessage;
  agent: TAgent | null;
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      initial={
        message.by === "consumer"
          ? { x: 30, opacity: 0 }
          : { x: -30, opacity: 0 }
      }
      className={cn(
        "real-time-message",
        message.by === "consumer"
          ? "real-time-message__consumer-wrapper"
          : "real-time-message__agent-wrapper"
      )}
    >
      {message?.by === "agent" ? (
        <img
          src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(agent?.agentName || "Agent")}`}
          alt="logo"
          width={12}
          height={12}
          loading="lazy"
          className="real-time-message__agent-logo"
        />
      ) : null}
      <div
        className={cn(
          "real-time-message__message-container",
          message.by === "consumer"
            ? "real-time-message__message-container--consumer"
            : "real-time-message__message-container--agent"
        )}
      >
        <div>
          <div
            className={cn(
              message.by === "consumer"
                ? "real-time-message__message-container--consumer__text cb-shadow-md"
                : message.by === "agent"
                  ? "real-time-message__message-container--agent__text cb-shadow-md "
                  : "real-time-message__message-container__error cb-shadow-md"
            )}
          >
            {message.message}
          </div>
          <p className="real-time-message__message-container__timestamp">
            {new Date(message.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="real-time-message__ref" ref={messagesEndRef}></div>
    </motion.div>
  );
};
