"use client";
import React from "react";
import Chatbot from "@chatbuild/chatbot";
const page = () => {
  return (
    <div>
      <Chatbot rounded={true} showWatermark apiKey='3067535d-56be-4fc2-a868-3e6488bd250c' />
    </div>
  );
};

export default page;
