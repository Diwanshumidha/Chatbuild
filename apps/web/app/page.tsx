"use client";
import React from "react";
import Chatbot from "@chatbuild/chatbot";
const page = () => {
  return (
    <div>
      <Chatbot rounded={true} showWatermark apiKey='5634fdb2-faf8-45c1-8427-53de0a91212b' />
    </div>
  );
};

export default page;
