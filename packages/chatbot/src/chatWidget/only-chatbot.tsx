import React, { useEffect, useMemo } from "react";
import { TChatBoxDetails, WidgetProps } from "./types";
import { getContrast } from "../lib/utils";
import { BASE_PATH } from "../lib/constants";
import { useMessages } from "../hooks/use-messages";
import { useThread } from "../hooks/use-thread";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { useVillageStore } from "../context/village-context";
import Chatbot from "./chatbot";

const ChatbotOnly = ({ apiKey, textColor, themeColor }: WidgetProps) => {
  const [chatbotDetails, setChatbotDetails] = React.useState<null | TChatBoxDetails>(
    null
  );
  const { setMessages } = useMessages();
  const { resetThread } = useThread();
  const { setSuggestion } = useSuggestions();
  const { setVillageId } = useVillageStore();

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

  if (!chatbotDetails || !chatbotDetails.chatBotName) {
    return <></>;
  }

  const resetChat = () => {
    setMessages([]);
    resetThread();
    setSuggestion([]);
  };

  return (
    <div
      className="chatbot-widget cb-transition-all"
      style={widgetStyles as React.CSSProperties}
    >
      <Chatbot
      widgetStyles={widgetStyles}
        resetChat={resetChat}
        chatbotDetails={chatbotDetails}
        handleChatBoxClose={() => {}}
        isOnlyChatbot={true}
      />
    </div>
  );
};

export default ChatbotOnly;
