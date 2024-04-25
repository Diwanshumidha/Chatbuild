import ErrorBoundary from "../components/error-boundary";
import { AssistantContextProvider } from "../context/assistant-context";
import { MessagesContextProvider } from "../context/message-context";
import { SuggestionContextProvider } from "../context/suggestion-context";
import { isValidUUID } from "../lib/utils";
import Widget from "./chatbot";
import { WidgetProps } from "./types";
import "../../dist/output.css";
// import "../../global.css";

/**
 * A chatbot component that provides a user interface for interacting with a chatbot.
 * @param {Object} props - The props for the Chatbot component.
 * @param {string} props.apiKey - The API key used for authentication with the chatbot service.
 * @param {string} [props.themeColor] - The primary color theme for the chatbot UI.
 * @param {string} [props.textColor] - The text color used in the chatbot UI.
 * @param {boolean} [props.roundedButton] - Indicates whether to use rounded Open Button.
 * @param {IconType} [props.icon] - The icon to be displayed in the Open Button.
 * @returns {JSX.Element} The rendered Chatbot component.
 */
const Chatbot = (props: WidgetProps) => {
  if (!props.apiKey) {
    return <p className="cb-text-red-400">Please Provide the Api Key</p>;
  }
  if (!isValidUUID(props.apiKey)) {
    return <p className="cb-text-red-400">Please Provide An Valid Api Key</p>;
  }

  return (
    <ErrorBoundary fallback={<></>}>
      <MessagesContextProvider>
        <AssistantContextProvider>
          <SuggestionContextProvider>
            <Widget {...props} />
          </SuggestionContextProvider>
        </AssistantContextProvider>
      </MessagesContextProvider>
    </ErrorBoundary>
  );
};
export default Chatbot;
