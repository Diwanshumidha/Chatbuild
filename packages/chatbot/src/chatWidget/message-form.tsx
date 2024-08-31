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
    <div className="cb-space-y-3 chatbot-message-form">
      <div className="chatbot-message-form__suggestion-container chatbot_suggestion_container">
        <div className="chatbot-message-form__suggestion-container__layout chatbot_scrollbar">
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

      <form onSubmit={handleSubmit} className="chatbot-input chatbot-message-form__form">
        <input
          type={"text"}
          placeholder="Message..."
          aria-label="Type here"
          value={userMessage}
          disabled={!threadId || generationLoading || threadLoading}
          onChange={(e) => setUserMessage(e.target.value)}
          className="chatbot-message-form__form__input"
        />
        <button
          type="submit"
          className="chatbot-message-form__form__submit-button"
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
      className="chatbot-message-form__suggestion-container__layout__suggestion"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
