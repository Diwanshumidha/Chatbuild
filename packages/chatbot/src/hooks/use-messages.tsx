import {  MessagesContext } from "../context/message-context";
import React from "react";

export const useMessages = () => {
  const context = React.useContext(MessagesContext);

  if (context === null) {
    throw new Error("useMessages must be used within a MessagesContextProvider");
  }

  return context;
};