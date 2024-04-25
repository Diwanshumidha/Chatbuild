"use client";
import React from "react";
import Chatbot from "@chatbuild/chatbot";
const page = () => {
  return (
    <div>
      <Chatbot
        showWatermark
        rounded={true}
        apiKey="c4100fc3-700b-4cf1-a3eb-209b772b1795"
      />
    </div>
  );
};

export default page;
