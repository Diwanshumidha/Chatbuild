"use client"
import { create } from "zustand";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("ws://localhost:8080");

type User = {
  consumerName:string;
  socketId:string;
}
interface AgentState {
  waitlist_users: User[];
  add_user: (user: User) => void;
  set_users:(users:User[]) => void;
}

const useAgentStore = create<AgentState>()((set) => ({
  waitlist_users: [],
  add_user: (user) => set((state) => ({waitlist_users:[...state.waitlist_users, user]})),
  set_users: (users) => {
    console.log("USERS", users)
    set(() => ({waitlist_users:users}))
  }
}));


export const useAgentSocket = () => {
  const {waitlist_users, set_users} = useAgentStore()

  useEffect(() => {
    const socket = io("http://localhost:8080");
    

    socket.on("connect", () => {
      console.log("Connected")
      socket.emit("join", {
        villageId:"hello",
        name:"Diwanshu",
        role:"agent"
      })
      console.log(socket.id);

      socket.on("update-waitlist", (payload)=>{
          console.log(payload)
          set_users(payload)
      })

    })

    return () => {
      socket.disconnect()
      socket.off("update-waitlist")
    }
  }, []);

  const connectToConsumer = (socketId:string) => {
    socket.emit("createRoom", {
      villageId:"hello",
      consumerId:socketId
    })
  }

  return {waitlist_users, connectToConsumer}
};
