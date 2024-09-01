
import { WidgetProps } from "./types";
import { default as ChatbotComponent, ChatbotNoWidget as ChatbotNoWidgetComponent } from "@chatbuild/chatbot";


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
  return <ChatbotComponent {...props} />;
};
export default Chatbot;

export const ChatbotNoWidget = (props: WidgetProps) => {
  return <ChatbotNoWidgetComponent {...props} />;
}
