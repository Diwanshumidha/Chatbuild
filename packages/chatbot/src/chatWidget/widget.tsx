import { LuArrowUpRight, LuDot, LuLoader } from "react-icons/lu";
import { TChatBoxDetails } from "./types";

import { IoClose } from "react-icons/io5";
import { useMessages } from "../hooks/use-messages";
import { useThread } from "../hooks/use-thread";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../components/ui/scroll-area";
import Messages from "./messages";
import { Button } from "../components/ui/button";
import MessageForm from "./message-form";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { PiArrowsCounterClockwiseBold } from "react-icons/pi";
import RealTimeChat from "./real-time-chat";
import { BsChatRightText, BsQuestionCircleFill } from "react-icons/bs";
import { GoQuestion } from "react-icons/go";
import { BsChatRightTextFill } from "react-icons/bs";
import { useAgentStore, useVillageStore } from "../context/village-context";

type WidgetProps = {
  chatbotDetails: TChatBoxDetails;
  handleChatBoxClose: () => void;
  resetChat: () => void;
};
const Widget = ({
  chatbotDetails,
  handleChatBoxClose,
  resetChat,
}: WidgetProps) => {
  const { setMessages, messages, generationLoading } = useMessages();
  const { fetchThread, threadError, threadId, threadLoading } = useThread();
  const { setSuggestion } = useSuggestions();
  const [userNameInput, setUserNameInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for the element to scroll to
  const [currentTab, setCurrentTab] = useState(0);
  const { villageId } = useVillageStore();
  const { agent } = useAgentStore();

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, generationLoading]);

  return (
    <div className="chatbot-widget__body cb-bg-chatbot_background cb-text-chatbot_foreground sm:cb-mb-4 cb-break-words cb-flex cb-flex-col cb-justify-between cb-shadow-lg cb-right-0 cb-rounded-2xl cb-fixed sm:cb-absolute sm:cb-bottom-full cb-bottom-0 cb-w-screen cb-h-[100dvh] sm:cb-w-96 sm:cb-h-[min(80dvh,550px)]">

      {/* Header Of The Chatbot Widget */}
      <div className="chatbot-widget__header cb-justify-between cb-p-3 cb-flex cb-items-center cb-bg-chatbot_primary cb-text-chatbot_primary-foreground sm:cb-rounded-t-2xl cb-rounded-b-none">
        <div className="cb-flex cb-gap-3 cb-items-center">
          <LuDot className="cb-text-green-500" size={40} />
          <h2 className="chatbot-widget__header-heading cb-text-lg cb-font-bold cb-text-center cb-text-chatbot_primary-foreground">
            {currentTab === 1 && agent?.agentName ? `${agent.agentName} - Agent`: chatbotDetails.chatBotName || "Chatty Assistant"}
          </h2>
        </div>
        <div className="cb-flex cb-space-x-3 cb-items-center">
          <PiArrowsCounterClockwiseBold
            onClick={() => resetChat()}
            role="button"
            aria-label="Close Chatbot Widget"
            className="hover:cb-opacity-60 cb-size-6"
          />
          <IoClose
            onClick={() => handleChatBoxClose()}
            role="button"
            aria-label="Close Chatbot Widget"
            className="hover:cb-opacity-60 cb-size-6"
          />
        </div>
      </div>

      {currentTab === 0 ? (
        <>
          {Boolean(threadError) && (
            <div className=" cb-px-4 cb-py-2">
              <p>{threadError}</p>
            </div>
          )}

          {!Boolean(threadError) && (
            <ScrollArea className="cb-h-full cb-w-full cb-space-y-2 cb-text-sm cb-text-chatbot_primary-foreground">
              {/* Logo and The Name of the business */}
              <div className="cb-flex cb-flex-col cb-w-full cb-items-center cb-mb-6 chatbot-widget__details-wrapper">
                <img
                  src={
                    chatbotDetails?.logoUrl || "https://via.placeholder.com/50"
                  }
                  loading="eager"
                  rel="preload"
                  alt="logo"
                  width={80}
                  height={80}
                  className="mt-3 cb-w-20 cb-h-20 cb-rounded-full cb-object-contain chatbot-widget__details-logo"
                />
                <h2 className="cb-text-lg cb-font-bold cb-text-center cb-text-chatbot_foreground chatbot-widget__details-heading">
                  {chatbotDetails?.chatBotName}
                </h2>
                <p className="cb-text-chatbot_muted-foreground cb-px-10 cb-text-center chatbot-widget__header-description">
                  {chatbotDetails.chatBotDescription ||
                    "We are here to help you with any questions in regards to our company and our services"}
                </p>
              </div>

              {!threadId && (
                <form
                  onSubmit={handleUserNameFormSubmit}
                  className=" chatbot-widget__username cb-p-4 cb-space-y-2 cb-text-left"
                >
                  <label className="cb-text-chatbot_foreground cb-font-semibold cb-px-1">
                    Enter Your Name
                  </label>
                  <div className="cb-flex cb-flex-row cb-items-center cb-w-full cb-gap-3 ">
                    <input
                      type={"text"}
                      placeholder="👋 Let's be friends, okay?"
                      aria-label="Type here"
                      className="chatbot-widget__username-input cb-h-9 cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-text-chatbot_foreground cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-flex cb-justify-end cb-items-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-rounded-r-none cb-text-sm"
                      onChange={(e) => setUserNameInput(e.target.value)}
                      value={userNameInput}
                    />
                    <Button
                      type="submit"
                      aria-label="Enter Your Name"
                      className="cb-border-s-0 cb-h-9 chatbot-widget__username-submit"
                    >
                      {threadLoading ? (
                        <LuLoader size={20} className=" cb-animate-spin" />
                      ) : (
                        <LuArrowUpRight size={20} />
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {Boolean(threadId) && !threadLoading ? (
                <Messages logoUrl={chatbotDetails.logoUrl} />
              ) : null}
              <div ref={messagesEndRef}></div>
            </ScrollArea>
          )}

          <MessageForm
            scrollToBottom={scrollToBottom}
            apiKey={chatbotDetails.apiKey}
          />
        </>
      ) : null}

      {currentTab === 1 ? <RealTimeChat /> : null}
      {/* Tab Buttons for Lice Chat and AI chat */}
      {villageId ? (
        <div className="cb-w-full cb-flex cb-p-3 cb-shadow-md  cb-border-t">
          <button
            onClick={() => setCurrentTab(0)}
            className="cb-flex-1 cb-flex cb-gap-1 cb-flex-col cb-items-center cb-text-sm"
          >
            {currentTab === 0 ? (
              <BsQuestionCircleFill size={17} />
            ) : (
              <GoQuestion size={17} />
            )}
            Ask AI
          </button>
          <button
            onClick={() => setCurrentTab(1)}
            className="cb-flex-1 cb-flex cb-gap-1 cb-flex-col cb-items-center"
          >
            {currentTab === 1 ? (
              <BsChatRightTextFill size={17} />
            ) : (
              <BsChatRightText size={17} />
            )}
            Live Chat
          </button>
        </div>
      ) : (
        null
      )}
      {/* {showWatermark && (
        <div className="watermark cb-text-xs cb-text-center cb-my-1">
          <p>
            Made with ❤️ by{" "}
            <a
              target="_blank"
              className="cb-underline"
              href="https://chatbuild.io/"
            >
              Chatbuild Ai 
            </a>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default Widget;
