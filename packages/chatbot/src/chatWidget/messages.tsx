import { GoDotFill } from "react-icons/go";
import { useMessages } from "../hooks/use-messages";
import { TMessage } from "../context/message-context";
import Markdown from "react-markdown";
import { IoClose } from "react-icons/io5";
import { LuArrowUpRight } from "react-icons/lu";
import React, { useState } from "react";
import { useThread } from "../hooks/use-thread";
import { BASE_PATH } from "../lib/constants";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

const Messages = ({ logoUrl }: { logoUrl: string }) => {
  const { messages, generationLoading } = useMessages();
  const [showEmailCapture, setShowEmailCapture] = React.useState(true);
  const [email, setEmail] = useState("");
  const { threadId } = useThread();

  const captureEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const response = await fetch(BASE_PATH + "/capture-email", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          threadId: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setEmail("");
      setShowEmailCapture(false);
    }
  };

  return (
    <div className="chatbot-messages">
      {messages.map((message, index) => (
        <Message logoUrl={logoUrl} message={message} key={`Message-${index}`} />
      ))}

      {showEmailCapture && messages.length === 3 && (
        <div className="chatbot-messages__email-capture">
          <form
            onSubmit={captureEmail}
            className="chatbot-messages__email-capture__form cb-space-y-2"
          >
            <button
              type="button"
              className="chatbot-messages__email-capture__form__close"
              onClick={() => setShowEmailCapture(false)}
            >
              {" "}
              <IoClose size={15} />
            </button>{" "}
            <label className="chatbot-messages__email-capture__form--label">
              Enter Your Email (optional)
            </label>
            <div className="chatbot-messages__email-capture__form__input-wrapper">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Type here"
                className="cb-transition-colors chatbot-input"
              />
              <button
                type="submit"
                aria-label="Enter Your Name"
                className="chatbot-messages__email-capture__form__input-wrapper__submit"
              >
                <LuArrowUpRight size={20} />
              </button>
            </div>
            <p className="chatbot-messages__email-capture__form__form-message">
              If you would like us to contact you
            </p>
          </form>
        </div>
      )}

      {generationLoading && (
        <div className="chatbot-messages__generation-loader">
          <p>
            {Array.from({ length: 3 }).map((_, index) => (
              <GoDotFill
                key={`LoadingPointsWidget-${index}`}
                style={{
                  animationDelay: `${index * 300}ms`,
                  animationDuration: "900ms",
                }}
                className={`cb-animate-pulse `}
                size={18}
              />
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;

const Message = ({
  message,
  logoUrl,
}: {
  message: TMessage;
  logoUrl: string;
}) => {
  return (
    <motion.div
      animate={{ x: 0, opacity: 1 }}
      initial={message.from === "user" ? { x: 30, opacity: 0 }: { x: -30, opacity: 0 }}
      className={cn(
        "chatbot-messages__message",
        message.from === "user"
          ? "chatbot-messages__message__user-message"
          : "chatbot-messages__message__bot-message"
      )}
    >
      {message?.from === "chatbot" ? (
        <img
          src={logoUrl || "https://via.placeholder.com/50"}
          alt="logo"
          width={12}
          height={12}
          loading="lazy"
          className="chatbot-messages__message__bot-message__chatbot-image"
        />
      ) : null}
      <div className={cn("chatbot-messages__message__message-container")}>
        <div
          className={cn(
            message.from === "user"
              ? "chatbot-messages__message__message-container__text cb-shadow-md"
              : message.from === "chatbot"
                ? "cb-shadow-md chatbot-messages__message__message-container__text"
                : "chatbot-messages__message__message-container__error cb-shadow-md"
          )}
        >
          <Markdown>{message.message}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};
