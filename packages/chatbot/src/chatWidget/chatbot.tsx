import { LuArrowRight, LuLoader } from "react-icons/lu";
import { TChatBoxDetails } from "./types";

import { IoClose } from "react-icons/io5";
import { useMessages } from "../hooks/use-messages";
import { useThread } from "../hooks/use-thread";
import { FormEvent, useEffect, useRef, useState } from "react";
import Messages from "./messages";
import MessageForm from "./message-form";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import RealTimeChat from "./real-time-chat";
import { BsChatRightText, BsQuestionCircleFill } from "react-icons/bs";
import { GoQuestion } from "react-icons/go";
import { BsChatRightTextFill } from "react-icons/bs";
import { useVillageStore } from "../context/village-context";
import { cn } from "../lib/utils";

type WidgetProps = {
  chatbotDetails: TChatBoxDetails;
  handleChatBoxClose: () => void;
  resetChat: () => void;
  isOnlyChatbot: boolean;
};
const Chatbot = ({
  chatbotDetails,
  handleChatBoxClose,
  resetChat,
  isOnlyChatbot,
}: WidgetProps) => {
  const { setMessages, messages, generationLoading } = useMessages();
  const { fetchThread, threadError, threadId, threadLoading } = useThread();
  const { setSuggestion } = useSuggestions();
  const [userNameInput, setUserNameInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the element to scroll to
  const [currentTab, setCurrentTab] = useState(0);
  const { villageId } = useVillageStore();

  const handleUserNameFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userNameInput) {
      setMessages((prev) => [
        ...prev,
        {
          from: "chatbot",
          message:
            chatbotDetails?.welcomeMessage || "Hello! How can I help you?",
        },
      ]);

      fetchThread(userNameInput, chatbotDetails.apiKey);
      setSuggestion(chatbotDetails.suggestionQuestions);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generationLoading]);

  return (
    <div
      className={cn(
       !isOnlyChatbot ? "chatbot-body--fixed-position" : null,
        "chatbot-body cb-shadow-lg"
      )}
    >
      {/* Header Of The Chatbot Widget */}
      <div className="chatbot-body__header">
        <div className="chatbot-body__header__content">
          <img
            src={chatbotDetails?.logoUrl || "https://via.placeholder.com/50"}
            loading="eager"
            rel="preload"
            alt="logo"
            width={50}
            height={50}
            className="chatbot-body__header__content__logo"
          />
          <div>
            <h2>{chatbotDetails.chatBotName || "Assistant"}</h2>
            <p className="chatbot-body__header__content__status">Online</p>
          </div>
        </div>
        <div className="chatbot-body__header__action cb-space-x-3">
          <button
            aria-label="Close Chatbot Widget"
            className="chatbot-body__header__action__reset"
          >
            <PiArrowsCounterClockwiseBold onClick={() => resetChat()} />
          </button>
          <button
            aria-label="Close Chatbot Widget"
            className="chatbot-body__header__action__close"
          >
            <IoClose onClick={() => handleChatBoxClose()} />
          </button>
        </div>
      </div>

      {currentTab === 0 ? (
        <>
          {Boolean(threadError) && (
            <div className="chatbot-body__error">
              <p>{threadError}</p>
            </div>
          )}

          {!Boolean(threadError) && (
            <div className="chatbot-details cb-space-y-2 chatbot_scrollbar chatbot_scrollbar--always">
              {/* Logo and The Name of the business */}
              <div className="chatbot-details__wrapper">
                <img
                  src={
                    chatbotDetails?.logoUrl || "https://via.placeholder.com/50"
                  }
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

              {!threadId && (
                <form
                  onSubmit={handleUserNameFormSubmit}
                  className="chatbot-form cb-space-y-2"
                >
                  {/* <label className="chatbot-form--label">Enter Your Name</label> */}
                  <div className="chatbot-form__input-wrapper">
                    <button
                      type="submit"
                      aria-label="Enter Your Name"
                      className="chatbot-form__input-wrapper__submit"
                    >
                      {threadLoading ? (
                        <LuLoader size={20} className=" cb-animate-spin" />
                      ) : (
                        <LuArrowRight size={20} />
                      )}
                    </button>
                    <input
                      type={"text"}
                      placeholder="👋 Enter Your Name To Begin..."
                      aria-label="Type here"
                      className="cb-transition-colors chatbot-input"
                      onChange={(e) => setUserNameInput(e.target.value)}
                      value={userNameInput}
                    />
                  </div>
                </form>
              )}

              {Boolean(threadId) && !threadLoading ? (
                <Messages logoUrl={chatbotDetails.logoUrl} />
              ) : null}
              <div ref={messagesEndRef}></div>
            </div>
          )}

          <MessageForm
            scrollToBottom={scrollToBottom}
            apiKey={chatbotDetails.apiKey}
          />
        </>
      ) : null}

      {currentTab === 1 ? (
        <RealTimeChat chatbotDetails={chatbotDetails} />
      ) : null}
      {/* Tab Buttons for Lice Chat and AI chat */}
      {villageId ? (
        <div className="chatbot-switcher cb-shadow-md">
          <button
            onClick={() => setCurrentTab(0)}
            className={cn(
              "chatbot-switcher__button",
              currentTab === 0 ? "chatbot-switcher__button--active" : ""
            )}
          >
            {currentTab === 0 ? (
              <BsQuestionCircleFill size={23} />
            ) : (
              <GoQuestion size={23} />
            )}
            Ask AI
          </button>
          <button
            onClick={() => setCurrentTab(1)}
            className={cn(
              "chatbot-switcher__button",
              currentTab === 1 ? "chatbot-switcher__button--active" : ""
            )}
          >
            {currentTab === 1 ? (
              <BsChatRightTextFill size={23} />
            ) : (
              <BsChatRightText size={23} />
            )}
            Live Chat
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Chatbot;
