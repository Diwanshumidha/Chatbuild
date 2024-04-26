import { GoDotFill } from "react-icons/go";
import { useMessages } from "../hooks/use-messages";
import { TMessage } from "../context/message-context";
import Markdown from "react-markdown";
import { IoClose } from "react-icons/io5";
import { Button } from "../components/ui/button";
import { LuArrowUpRight } from "react-icons/lu";
import { useState } from "react";
import { useThread } from "../hooks/use-thread";
import { BASE_PATH } from "../lib/constants";
import { cn } from "../lib/utils";
const Messages = ({ logoUrl }: { logoUrl: string }) => {
  const { messages, generationLoading } = useMessages();
  const [showEmailCapture, setShowEmailCapture] = useState(true);
  const [email, setEmail] = useState("");
  const { threadId } = useThread();

  const captureEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const response = await fetch(BASE_PATH + "/capture-email", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          threadId: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setEmail("");
      setShowEmailCapture(false);
    }
  };

  return (
    <div className="cb-pb-5">
      {messages.map((message, index) => (
        <Message logoUrl={logoUrl} message={message} key={`Message-${index}`} />
      ))}

      {showEmailCapture && messages.length === 3 && (
        <div className="cb-px-4 cb-mt-4 ">
          <form
            onSubmit={captureEmail}
            className=" chatbot-widget__username cb-p-4 cb-relative cb-rounded-lg cb-space-y-2 cb-bg-chatbot_secondary"
          >
            <button
              type="button"
              className="cb-text-chatbot_secondary-foreground cb-absolute cb-right-2 cb-top-2"
              onClick={() => setShowEmailCapture(false)}
            >
              {" "}
              <IoClose size={15} />
            </button>{" "}
            <label className="cb-text-chatbot_foreground cb-font-semibold cb-px-1">
              Enter Your Email
            </label>
            <div className="cb-flex cb-flex-row cb-items-center cb-w-full cb-gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Type here"
                className="chatbot-widget__username-input cb-flex cb-flex-row cb-items-center cb-h-11 cb-text-chatbot_foreground focus-within:cb-ring-1 focus-within:cb-ring-chatbot_primary cb-rounded-md cb-border cb-border-input  cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 cb- disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-justify-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-text-sm"
              />
              <Button
                type="submit"
                aria-label="Enter Your Name"
                className="cb-border-s-0 cb-h-9 chatbot-widget__username-submit"
              >
                <LuArrowUpRight size={20} />
              </Button>
            </div>
            <p className="cb-text-chatbot_secondary-foreground/70 cb-font-semibold cb-px-2">
              If you would like us to contact you
            </p>
          </form>
        </div>
      )}

      {generationLoading && (
        <div className="cb-px-4">
          <p className="text-sm cb-flex cb-break-words cb-py-1 cb-text-start cb-rounded-lg cb-mb-2 cb-w-1/3 cb-text-chatbot_message-foreground">
            {Array.from({ length: 3 }).map((_, index) => (
              <GoDotFill
                key={`LoadingPointsWidget-${index}`}
                style={{
                  animationDelay: `${index * 300}ms`,
                  animationDuration: "900ms",
                }}
                className={` cb-text-chatbot_foreground cb-animate-pulse `}
                size={18}
              />
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;

const Message = ({
  message,
  logoUrl,
}: {
  message: TMessage;
  logoUrl: string;
}) => {
  return (
    <div
      className={cn(
        "cb-flex cb-flex-1 cb-px-4 cb-gap-2",
        message.from === "user"
          ? "cb-justify-end cb-w-full chatbot-widget__user-message"
          : "cb-justify-start cb-w-full chatbot-widget__chatbot-message"
      )}
    >
      {message?.from === "chatbot" ? (
        <img
          src={logoUrl || "https://via.placeholder.com/50"}
          alt="logo"
          width={12}
          height={12}
          loading="lazy"
          className="cb-size-4 cb-rounded-full cb-object-contain cb-mt-3"
        />
      ) : null}
      <div
        className={cn(
          "cb-flex cb-gap-y-1",
          message.from === "user"
            ? "cb-justify-end cb-p-1.5 cb-rounded-3xl cb-w-3/4"
            : "cb-justify-start cb-w-3/4"
        )}
      >
        <div
          className={cn(
            message.from === "user"
              ? "cb-w-fit cb-px-3 cb-py-2 cb-rounded-lg cb-bg-chatbot_primary cb-text-chatbot_primary-foreground cb-shadow-md cb-text-end cb-mb-2"
              : message.from === "chatbot"
                ? "cb-w-fit cb-px-3 cb-bg-chatbot_message cb-shadow-md cb-py-2 cb-text-start cb-text-chatbot_message-foreground cb-rounded-lg cb-mb-2"
                : "cb-w-fit cb-px-3 cb-bg-slate-50 cb-shadow-md cb-py-2 cb-text-start cb-text-red-600 cb-rounded-lg cb-mb-2"
          )}
        >
          <Markdown>{message.message}</Markdown>
        </div>
      </div>
    </div>
  );
};
