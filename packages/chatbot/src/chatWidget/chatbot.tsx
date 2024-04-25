import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { IoClose } from "react-icons/io5";
import { TChatBoxDetails, WidgetProps } from "./types";
import { cn, getContrast } from "../lib/utils";
import Widget from "./widget";
import { BASE_PATH } from "../lib/constants";
import WelcomeBox from "./welcomeBox";
import { useMessages } from "../hooks/use-messages";
import { useThread } from "../hooks/use-thread";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { SiChatbot } from "react-icons/si";

const Chatbot = ({
  apiKey,
  showWelcomeBox = true,
  icon,
  rounded,
  textColor,
  themeColor,
  showWatermark = false,
}: WidgetProps) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isWelcomeBoxOpen, setIsWelcomeBoxOpen] = useState(true);
  const [chatbotDetails, setChatbotDetails] = useState<null | TChatBoxDetails>(
    null
  );
  const { setMessages } = useMessages();
  const { resetThread } = useThread();
  const { setSuggestion } = useSuggestions();

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
      className="cb-fixed cb-bottom-5 cb-right-5 cb-p-3 cb-z-[150] cb-text-chatbot_foreground chatbot-widget "
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
        className={cn(
          "chatbot-widget__button cb-group active:cb-scale-75 cb-transition-all cb-duration-300 hover:cb-scale-105 cb-w-20 cb-h-14 cb-p-0 cb-justify-center cb-bg-chatbot_primary hover:cb-opacity-80 cb-text-chatbot_primary-foreground cb-flex cb-items-center cb-rounded-full",
          rounded && "cb-aspect-square cb-w-14 cb-h-14"
        )}
      >
        {isChatbotOpen ? (
          <IoClose className="cb-size-[50%]  cb-text-chatbot_primary-foreground cb-cursor-pointer chatbot-widget__icon chatbot-widget__icon--close" />
        ) : (
          <Icon className="cb-size-[50%]  cb-text-chatbot_primary-foreground cb-cursor-pointer chatbot-widget__icon chatbot-widget__icon--open" />
        )}
      </Button>
      {isChatbotOpen ? (
        <Widget
          resetChat={resetChat}
          chatbotDetails={chatbotDetails}
          handleChatBoxClose={handleChatBoxClose}
          showWatermark={showWatermark}
        />
      ) : null}
    </div>
  );
};

export default Chatbot;
