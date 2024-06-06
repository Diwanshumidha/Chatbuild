"use client";
import React from "react";
import Chatbot from "@chatbuild/chatbot";
const page = () => {
  return (
    <div>
      <Chatbot rounded={true} showWatermark apiKey='bde796a0-34a3-4c44-80c1-ac1f75288752' />
    </div>
  );
};

export default page;
