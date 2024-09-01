"use client";
import React from "react";
import Chatbot, { ChatbotNoWidget } from "@chatbuild/chatbot";
const page = () => {
  return (
    <div style={{ width: "500px", height: "800px" }}>
      <ChatbotNoWidget
        rounded={false}
        showWatermark
        apiKey="3067535d-56be-4fc2-a868-3e6488bd250c"
      />
    </div>
  );
};

export default page;

// production chatbot API key is 3067535d-56be-4fc2-a868-3e6488bd250c
// development chatbot API key is f9cc16b8-8021-4d10-a713-f7a45717cd89
