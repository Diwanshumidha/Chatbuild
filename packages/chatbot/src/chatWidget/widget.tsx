import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { IoClose } from "react-icons/io5";
import { TChatBoxDetails, WidgetProps } from "./types";
import { cn, getContrast } from "../lib/utils";
import Chatbot from "./chatbot";
import { BASE_PATH } from "../lib/constants";
import WelcomeBox from "./welcomeBox";
import { useMessages } from "../hooks/use-messages";
import { useThread } from "../hooks/use-thread";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { SiChatbot } from "react-icons/si";
import { useVillageStore } from "../context/village-context";

const Widget = ({
  apiKey,
  showWelcomeBox = true,
  icon,
  rounded,
  textColor,
  themeColor,
}: WidgetProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
  const [isWelcomeBoxOpen, setIsWelcomeBoxOpen] = useState(true);
  const [chatbotDetails, setChatbotDetails] = useState<null | TChatBoxDetails>(
    null
  );
  const { setMessages } = useMessages();
  const { resetThread } = useThread();
  const { setSuggestion } = useSuggestions();
  const { setVillageId } = useVillageStore();
  console.log(chatbotDetails);
  useEffect(() => {
    const fetchBot = async function () {
      console.log(BASE_PATH + "/chatbot");
      const response = await fetch(BASE_PATH + `/chatbot/${apiKey}`);
      if (!response.ok) {
        console.error(
          "[CHATBUILD_AI] There Was an Error While Loading The Chatbot"
        );
        return;
      }

      const data = await response.json();
      if (!data.data) {
        console.error(
          "[CHATBUILD_AI] There Was an Error While Loading The Chatbot"
        );
        return;
      }

      if (data.village) {
        console.log(data.village.id);
        setVillageId(data.village.id);
      }
      const Details = data.data;
      const textColor = getContrast(themeColor || Details.colorScheme);
      setChatbotDetails({ ...Details, textColor });
    };

    fetchBot();
  }, []);

  const widgetStyles = useMemo(() => {
    return {
      "--chatbot-text-color":
        textColor || getContrast(chatbotDetails?.colorScheme || ""),
      "--chatbot-theme-color":
        themeColor || chatbotDetails?.colorScheme || "orange",
    };
  }, [chatbotDetails]);

  const handleChatBoxClose = () => {
    setIsChatbotOpen(false);
  };

  if (!chatbotDetails || !chatbotDetails.chatBotName) {
    return <></>;
  }

  const resetChat = () => {
    setMessages([]);
    resetThread();
    setSuggestion([]);
    setIsChatbotOpen(false);
  };

  const Icon = icon ? icon : SiChatbot;

  return (
    <div
      className="chatbot-widget chatbot-widget--fixed-position cb-transition-all"
      style={widgetStyles as React.CSSProperties}
    >
      {isWelcomeBoxOpen && !isChatbotOpen && showWelcomeBox ? (
        <WelcomeBox
          setIsChatbotOpen={setIsChatbotOpen}
          setIsWelcomeBoxOpen={setIsWelcomeBoxOpen}
          alertMessage={chatbotDetails?.alertMessage}
          chatbotName={chatbotDetails?.chatBotName}
        />
      ) : null}

      <Button
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        aria-label={isChatbotOpen ? "Close Chatbot" : "Open Chatbot"}
        className={cn(
          "chatbot-widget__button cb-transition-all",
          rounded && "chatbot-widget__button--rounded"
        )}
      >
        {isChatbotOpen ? (
          <IoClose className="chatbot-widget__icon chatbot-widget__icon--close" />
        ) : (
          <Icon className="chatbot-widget__icon chatbot-widget__icon--open" />
        )}
      </Button>
      {isChatbotOpen ? (
        <Chatbot
          widgetStyles={widgetStyles}
          resetChat={resetChat}
          chatbotDetails={chatbotDetails}
          handleChatBoxClose={handleChatBoxClose}
          isOnlyChatbot={false}
        />
      ) : null}
    </div>
  );
};

export default Widget;
