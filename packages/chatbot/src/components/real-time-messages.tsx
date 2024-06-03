import { useEffect, useRef } from "react";
import { TAgent, useAgentStore } from "../context/village-context";
import { cn } from "../lib/utils";
import { ScrollArea } from "./ui/scroll-area";

const RealTimeMessages = () => {
  const { messages, agent } = useAgentStore();
  

  return (
    <div className="cb-flex-1">
      {messages.map((message, index) => (
        <Message message={message} agent={agent} key={`Message-${index}`} />
      ))}
    </div>
  );
};

export default RealTimeMessages;

type TMessage = {
  message: string;
  time: number;
  by: "agent" | "consumer";
};

const Message = ({ message, agent }: { message: TMessage, agent: TAgent | null }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      useEffect(() => {
        scrollToBottom();
      }, [message]);
      
  return (
    <div
      className={cn(
        "cb-flex cb-flex-1 cb-px-1 cb-gap-2",
        message.by === "consumer"
          ? "cb-justify-end cb-w-full chatbot-widget__user-message"
          : "cb-justify-start cb-w-full chatbot-widget__chatbot-message"
      )}
    >
      {message?.by === "agent" ? (
        <img
          src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${encodeURIComponent(agent?.agentName || "Agent")}`}
          alt="logo"
          width={12}
          height={12}
          loading="lazy"
          className="cb-size-4 cb-rounded-full cb-object-contain cb-mt-3"
        />
      ) : null}
      <div
        className={cn(
          "cb-flex cb-gap-y-1 ",
          message.by === "consumer"
            ? "cb-justify-end cb-p-1.5 cb-rounded-3xl cb-gap-2 cb-w-3/4"
            : "cb-justify-start cb-w-3/4"
        )}
      >
        <div
          className={cn(
            message.by === "consumer"
              ? "cb-w-fit cb-px-3 cb-py-2 cb-rounded-lg cb-bg-chatbot_primary cb-text-chatbot_primary-foreground cb-shadow-md cb-text-end cb-mb-2"
              : message.by === "agent"
                ? "cb-w-fit cb-px-3 cb-bg-chatbot_message cb-shadow-md cb-py-2 cb-text-start cb-text-chatbot_message-foreground cb-rounded-lg cb-mb-2"
                : "cb-w-fit cb-px-3 cb-bg-slate-50 cb-shadow-md cb-py-2 cb-text-start cb-text-red-600 cb-rounded-lg cb-mb-2"
          )}
        >
          {message.message}
        </div>
   
      </div>
      <div className="py-4" ref={messagesEndRef}></div>
    </div>
  );
};
