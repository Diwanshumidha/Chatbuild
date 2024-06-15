import { useState } from "react";
import { useThread } from "../hooks/use-thread";
import { useMessages } from "../hooks/use-messages";
import { BASE_PATH } from "../lib/constants";
import { useSuggestions } from "../hooks/use-suggestion-context";
import { Icons } from "../components/ui/Icons";

type MessageFormProps = {
  apiKey: string;
  scrollToBottom: () => void;
};

const MessageForm = ({ apiKey, scrollToBottom }: MessageFormProps) => {
  const [userMessage, setUserMessage] = useState("");
  const { setSuggestion, suggestion } = useSuggestions();
  const { setMessages, setGenerationLoading, generationLoading } =
    useMessages();
  const { threadId, threadLoading } = useThread();

  const handleUserMessage = async (message: string) => {
    try {
      if (!apiKey || !threadId || !message.trim()) return;
      setUserMessage("");
      setGenerationLoading(true);
      setMessages((prev) => [...prev, { from: "user", message: message }]);
      scrollToBottom();
      const response = await fetch(BASE_PATH + "/answer-user", {
        method: "POST",
        body: JSON.stringify({
          threadId,
          message: message,
          apiKey: apiKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Response not ok");
        throw new Error("Something Went Wrong");
      }
      if (typeof data !== "string") {
        console.log("Response Has Errors");
        throw new Error(data.error);
      }
      setMessages((prev) => [...prev, { from: "chatbot", message: data }]);
      scrollToBottom();
    } catch (error) {
      console.log({ error });
      setMessages((prev) => [
        ...prev,
        {
          from: "error",
          message: "There Was an Issue While Generating Message",
        },
      ]);
    } finally {
      setGenerationLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleUserMessage(userMessage);
  };

  return (
    <div className=" cb-px-4 cb-space-y-3 chatbot-widget__message-form cb-mb-4">
      <div className="chatbot_suggestion_container cb-relative">
        <div className="cb-py-1 cb-flex cb-gap-3 cb-w-full cb-overflow-x-auto chatbot_scrollbar ">
          {suggestion.map((item, index) => (
            <SuggestionButton
              key={index}
              text={item}
              disabled={!threadId || generationLoading || threadLoading}
              onClick={() => {
                setSuggestion((prev) => {
                  let newQuestions = [...prev];
                  newQuestions.splice(index, 1);
                  return newQuestions;
                });

                handleUserMessage(item);
              }}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="cb-flex cb-flex-row cb-items-center cb-h-11 cb-text-chatbot_foreground focus-within:cb-ring-1 focus-within:cb-ring-chatbot_primary cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 cb- disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-justify-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-text-sm"
      >
        <input
          type={"text"}
          placeholder="Message..."
          aria-label="Type here"
          value={userMessage}
          disabled={!threadId || generationLoading || threadLoading}
          onChange={(e) => setUserMessage(e.target.value)}
          className="chatbot-widget__message-form--input cb-flex-1 cb-py-2 focus:cb-outline-none !cb-bg-transparent"
        />
        <button
          type="submit"
          className="cb-border-s-0 chatbot-widget__message-form--submit cb-bg-transparent cb-text-chatbot_primary disabled:cb-opacity-55 "
          disabled={
            !threadId || generationLoading || userMessage.trim().length <= 0
          }
        >
          <Icons.messageIcon />
        </button>
      </form>
    </div>
  );
};

export default MessageForm;

const SuggestionButton = ({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      disabled={disabled}
      className=" cb-text-nowrap cb-bg-chatbot_primary disabled:cb-opacity-65 cb-text-chatbot_primary-foreground hover:cb-opacity-90 cb-px-2 cb-py-1 cb-rounded-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
