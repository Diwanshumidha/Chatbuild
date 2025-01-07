"use client";
import React from "react";
import Chatbot, { ChatbotNoWidget } from "@chatbuild/chatbot";
const page = () => {
  return (
    <div style={{ width: "500px", height: "800px" }}>
      <Chatbot
        rounded={false}
        showWatermark
        apiKey="83fa4fc2-340c-4f82-a153-c6235060b843"
      />
    </div>
  );
};

export default page;

// production chatbot API key is 3067535d-56be-4fc2-a868-3e6488bd250c
// development chatbot API key is 83fa4fc2-340c-4f82-a153-c6235060b843
