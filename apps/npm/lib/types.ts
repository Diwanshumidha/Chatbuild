export type WidgetProps = {
  apiKey: string;
  themeColor?: string;
  textColor?: string;
  rounded?: boolean;
  icon?: ({ className }: { className: string }) => JSX.Element;
  showWelcomeBox?: boolean;
  showWatermark?: boolean;
};

export type TChatBoxDetails = {
  chatBotName: string;
  chatBotDescription: string;
  colorScheme: string;
  welcomeMessage: string;
  apiKey: string;
  logoUrl: string;
  textColor: string;
  suggestionQuestions: string[];
  alertMessage: string;
};
