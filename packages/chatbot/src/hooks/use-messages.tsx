import {  MessagesContext } from "../context/message-context";
import { useContext } from "react";

export const useMessages = () => {
  const context = useContext(MessagesContext);

  if (context === null) {
    throw new Error("useMessages must be used within a MessagesContextProvider");
  }

  return context;
};