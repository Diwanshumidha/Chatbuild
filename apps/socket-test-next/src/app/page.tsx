"use client";

import { useAgentSocket, useRoomStore } from "@/hooks/useAgents";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const { waitlist_users, connectToConsumer, sendMessage } = useAgentSocket();
  const { messages, consumer, currentRoomId } = useRoomStore();

  return (
    <>
      <div className="flex w-full">
        <div className=" w-[300px] border border-solid h-svh">
          Waitlist
          {waitlist_users.map((user) => (
            <div>
              <p>
                {user.consumerName} : {user.socketId}
              </p>
              <button onClick={() => connectToConsumer(user.socketId)}>
                connectToConsumer
              </button>
            </div>
          ))}
        </div>
        <div>
          {consumer?.consumerName} {currentRoomId}
          <form
            action={async (formData) => {
              const message = formData.get("message") as string;
              if (!message || !currentRoomId) {
                return;
              }
              sendMessage(message, currentRoomId);
            }}
          >
            <input type="text" placeholder="Message" name="message" />
            <button type="submit">Send</button>
          </form>
          -------------------------------------------------------------
          <div className="flex flex-col">
            {messages.map((message) => {
              return (
                <p>
                  {message.by}:{message.message}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
