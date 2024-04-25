export interface IAppProps {
  api_key: string;
  text_color?: string;
  theme_color?: string;
}

export const checkProps = (props: IAppProps) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  if (!props.api_key || !uuidRegex.test(props.api_key)) {
    console.error(
      "CHATBOT ERROR: Invalid Api key. \nPlease Add The Provided Api Key to the Script as api_key="
    );
    return false;
  }

  if (
    (!!props.text_color && !props.text_color.includes("#")) ||
    (!!props.theme_color && !props.theme_color.includes("#"))
  ) {
    console.error(
      "CHATBOT ERROR: Only Hex Values Are Allowed in the theme_color or text_color."
    );
    return false;
  }

  return true;
};
