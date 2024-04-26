"use client";
import React from "react";
import Chatbot from "@chatbuild/chatbot";
const page = () => {
  return (
    <div>
      <Chatbot rounded={true} apiKey={process.env.API_KEY} />
    </div>
  );
};

export default page;
