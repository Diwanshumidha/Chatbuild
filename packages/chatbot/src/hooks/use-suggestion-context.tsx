import { SuggestionContext } from "../context/suggestion-context";
import React from "react";

export const useSuggestions = () => {
  const context = React.useContext(SuggestionContext);

  if (context === null) {
    throw new Error(
      "useSuggestion must be used within a SuggestionContextProvider"
    );
  }

  return context;
};
