"use client"

import { useAgentSocket } from "@/hooks/useAgents";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


export default function Home() {
  const {waitlist_users} = useAgentSocket()

  return <>
  Waitlist
  {waitlist_users.map(user => (
    <p>{user.consumerName} : {user.socketId}</p>
  ))}</>
}