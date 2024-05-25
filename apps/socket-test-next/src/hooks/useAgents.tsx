"use client";
import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

type User = {
  consumerName: string;
  socketId: string;
};

type Message = {
  message: string;
  by: "agent" | "consumer";
};
interface AgentState {
  waitlist_users: User[];
  add_user: (user: User) => void;
  set_users: (users: User[]) => void;
}

interface RoomState {
  messages: Message[];
  currentRoomId: string | null;
  consumer: User | null;
  set_room: (roomId: string, consumer: User) => void;
  add_message: (message: string, by: "agent" | "consumer") => void;
}

const useAgentStore = create<AgentState>()((set) => ({
  waitlist_users: [],
  add_user: (user) =>
    set((state) => ({ waitlist_users: [...state.waitlist_users, user] })),
  set_users: (users) => {
    console.log("USERS", users);
    set(() => ({ waitlist_users: users }));
  },
}));

export const useRoomStore = create<RoomState>()((set) => ({
  messages: [],
  currentRoomId: null,
  consumer: null,
  set_room: (roomId, consumer) =>
    set(() => ({ currentRoomId: roomId, consumer: consumer })),
  add_message: (message, by) =>
    set((state) => ({
      messages: [...state.messages, { message, by }],
    })),
}));

export const useAgentSocket = () => {
  const { waitlist_users, set_users } = useAgentStore();
  const { currentRoomId, add_message, set_room } = useRoomStore();
  const [socket, setsocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("Connected");
      setsocket(socket);

      socket.emit("join", {
        villageId: "hello",
        name: "Diwanshu",
        role: "agent",
      });

      console.log(socket.id);
      socket.on("consumers:get", (payload) => {
        console.log("PAYLOAD", payload);
        set_users(payload.consumers);
      });

      socket.on("update-waitlist", (payload) => {
        console.log(payload);
        set_users(payload);
      });
      socket.on("message", (payload) => {
        console.log("PAYLOAD", payload);
        add_message(payload.message, "consumer");
      });
    });

    return () => {
      socket.disconnect();
      socket.off("update-waitlist");
      socket.off("message");
    };
  }, []);

  const connectToConsumer = (socketId: string) => {
    socket?.emit(
      "createRoom",
      {
        villageId: "hello",
        consumerId: socketId,
      },
      (roomId: string, consumer: User) => {
        console.log(roomId);
        set_room(roomId, consumer);
      }
    );
  };

  const sendMessage = (message: string, roomId: string) => {
    add_message(message, "agent");

    socket?.emit("message", { message, roomId, villageId: "hello" });
  };

  return { waitlist_users, connectToConsumer, sendMessage };
};
