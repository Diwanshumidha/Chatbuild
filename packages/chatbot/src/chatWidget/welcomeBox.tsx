import { Dispatch, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";

const WelcomeBox = ({
  setIsWelcomeBoxOpen,
  setIsChatbotOpen,
  alertMessage,
  chatbotName,
}: {
  setIsWelcomeBoxOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatbotOpen: Dispatch<SetStateAction<boolean>>;
  alertMessage?: string;
  chatbotName: string;
}) => {
  if (!alertMessage?.trim()) {
    return null;
  }
  return (
    <div
      role="button"
      className=" cb-w-[60svw] cb-text-left  sm:cb-w-[340px]  cb-rounded-xl cb-bg-chatbot_background cb-shadow-lg cb-absolute cb-right-[40%]  cb-bottom-full cb-py-3 cb-px-4  "
    >
      <div className=" cb-right-2 cb-top-3 cb-absolute">
        <button
          className="hover:cb-text-chatbot_foreground/40 "
          onClick={() => setIsWelcomeBoxOpen(false)}
        >
          <IoClose />
        </button>
      </div>
      <div
        onClick={() => {
          setIsChatbotOpen(true);
        }}
        className="cb-space-y-1 cb-text-chatbot_foreground"
      >
        <p className="cb-text-chatbot_foreground/40 cb-font-semibold cb-flex-1">
          Hello from {chatbotName}!
        </p>
        <p className=" cb-text-chatbot_foreground">{alertMessage}</p>
      </div>
    </div>
  );
};

export default WelcomeBox;
