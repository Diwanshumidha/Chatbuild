import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import React from "react";

type Props = {
  setIsWelcomeBoxOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatbotOpen: Dispatch<SetStateAction<boolean>>;
  alertMessage?: string;
  chatbotName: string;
};

const WelcomeBox: React.FC<Props> = ({
  setIsWelcomeBoxOpen,
  setIsChatbotOpen,
  alertMessage,
  chatbotName,
}) => {
  if (!alertMessage?.trim()) {
    return null;
  }
  return (
    <div role="button" className="chatbot-widget__welcome cb-shadow-lg">
      <div className="chatbot-widget__welcome__close">
        <button
          aria-label="close welcome box"
          onClick={() => setIsWelcomeBoxOpen(false)}
        >
          <IoClose />
        </button>
      </div>
      <div
        onClick={() => {
          setIsChatbotOpen(true);
        }}
        className="cb-space-y-2 chatbot-widget__welcome__content"
      >
        <p className="chatbot-widget__welcome__content__title">
          Hello from {chatbotName}!
        </p>
        <p className="chatbot-widget__welcome__content__description">
          {alertMessage}
        </p>
      </div>
    </div>
  );
};

export default WelcomeBox;
