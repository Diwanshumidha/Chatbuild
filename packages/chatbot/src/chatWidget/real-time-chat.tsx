import React, { useState } from "react";
import { useAgentStore, useVillageStore } from "../context/village-context";
import { useSocket } from "../hooks/use-consumer-socket";
import { Icons } from "../components/ui/Icons";
import RealTimeMessages from "../components/real-time-messages";
import WaitingForChat from "../components/waiting-for-chat";
import { TChatBoxDetails } from "./types";
import { motion } from "framer-motion";

const RealTimeChat = ({
  chatbotDetails,
}: {
  chatbotDetails: TChatBoxDetails;
}) => {
  const { user, setUser, villageId } = useVillageStore();
  const { currentRoomId, hasAgentLeft, agent, isAgentTyping } = useAgentStore();
  const { join, sendMessage } = useSocket();

  const [name, setName] = React.useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const onSubmit = () => {
    if (!name || !email || !message) {
      return;
    }

    join(name, email, message);
    setUser({ email, name });
  };

  const sendMessageForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userMessage || !currentRoomId) {
      return;
    }
    sendMessage(userMessage, currentRoomId);
    setUserMessage("");
  };

  if (!villageId) {
    return null;
  }

  if (!user) {
    return (
      <div className="real-time">
        <div className="chatbot-details__wrapper">
          <img
            src={chatbotDetails?.logoUrl || "https://via.placeholder.com/50"}
            loading="eager"
            rel="preload"
            alt="logo"
            width={80}
            height={80}
            className="chatbot-details__wrapper__profile"
          />
          <h2 className="chatbot-details__wrapper__heading">
            {chatbotDetails?.chatBotName}
          </h2>
          <p className="chatbot-details__wrapper__description">
            {chatbotDetails.chatBotDescription ||
              "We are here to help you with any questions in regards to our company and our services"}
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="real-time__user-details-form cb-space-y-2"
        >
          <label>Talk To A Live Person</label>
          <div className="real-time__user-details-form__input-wrapper">
            <input
              type={"text"}
              placeholder="Your Name..."
              aria-label="Type here"
              className="chatbot-input"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <input
              type={"email"}
              placeholder="Your Email Address..."
              aria-label="Type here"
              className="chatbot-input"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <textarea
              rows={4}
              placeholder="Your message..."
              aria-label="Type here"
              className="chatbot-input real-time__user-details-form__input-wrapper__text-area"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              type="submit"
              className="real-time__user-details-form__input-wrapper__submit-button chatbot-button"
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!currentRoomId) {
    return <WaitingForChat />;
  }

  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        animate={{ height: "auto", opacity: 1 }}
        className="agent-details"
      >
        <motion.div
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          animate={{ opacity: 1 }}
          className="agent-details__image-wrapper"
        >
          <img
            src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(agent?.agentName || "Agent")}`}
            alt="logo"
            width={18}
            height={18}
            loading="lazy"
          />
          <div className="agent-details__image-wrapper__status cb-animate-pulse"></div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          animate={{ opacity: 1 }}
        >
          {agent?.agentName} from {chatbotDetails.chatBotName}
        </motion.h2>
      </motion.div>
      <div className="real-time-message-container chatbot_scrollbar chatbot_scrollbar--always cb-space-y-3">
        <RealTimeMessages />
      </div>
      {isAgentTyping && (
        <div className="agent-typing">
          <p>Agent typing</p>
          <div className="cb-loader">
            <div className="cb-loader__dot"></div>
            <div className="cb-loader__dot"></div>
            <div className="cb-loader__dot"></div>
          </div>
        </div>
      )}
      <form
        onSubmit={sendMessageForm}
        className="chatbot-input real-time-message-form"
      >
        <input
          type={"text"}
          placeholder="Message..."
          aria-label="Type here"
          value={userMessage}
          disabled={hasAgentLeft}
          onChange={(e) => setUserMessage(e.target.value)}
          className="real-time-message-form__input"
        />
        <button
          type="submit"
          disabled={hasAgentLeft}
          className="real-time-message-form__submit-button"
        >
          <Icons.messageIcon />
        </button>
      </form>
    </>
  );
};

export default RealTimeChat;
