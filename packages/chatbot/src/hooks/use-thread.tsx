import { AssistantContext } from "../context/assistant-context";
import React from "react";

export const useThread = () => {
  const context = React.useContext(AssistantContext);

  // if the context isn't defined, throw an error
  if (context === null) {
    throw new Error("useThread must be used within a AssistantContextProvider");
  }
 

  return context;
};