import Chatbot from "@chatbuild/chatbot";
import { checkProps } from "./utils.js";
import ReactDOM from "react-dom/client";

export interface IAppProps {
  api_key: string;
  text_color?: string;
  theme_color?: string;
}

declare global {
  interface Window {
    Chatbot: {
      mount: (el: Element, props: IAppProps) => void;
      loadCss: (cssUrl: string) => void;
    };
  }
}

window.Chatbot = {
  mount: function (el: Element, props: IAppProps) {
    let root: ReactDOM.Root | null = null;

    root = ReactDOM.createRoot(el);

    if (!checkProps(props)) {
      root.render(
        <ErrorComponent message="Invalid props. Please check the console for details." />
      );
      return;
    } else {
      root.render(
        <Chatbot
          apiKey={props.api_key}
          textColor={props.text_color}
          themeColor={props.theme_color}
        />
      );
    }
  },
  loadCss: function (cssUrl: string) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = cssUrl;
    document.head.appendChild(link);
  },
};

if (import.meta.env.DEV) {
  window.Chatbot.mount(document.getElementById("root")!, {
    api_key: import.meta.env.VITE_DEMO_ENV_KEY!,
  });
}

function ErrorComponent({ message }: { message?: string }) {
  return (
    <div style={{ color: "red" }}>
      {message
        ? message
        : "Please provide a valid apiKey to use the Chatbot. For More Information"}
    </div>
  );
}
