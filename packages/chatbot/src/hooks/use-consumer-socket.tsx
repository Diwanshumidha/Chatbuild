import { Socket, io } from "socket.io-client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAgentStore, useVillageStore } from "../context/village-context";
import { SOCKET_SERVER_PATH } from "../lib/constants";
import useSound from "./use-sound";

interface SocketContextProps {
  socket: Socket | null;
  sendMessage: (message: string, roomId: string) => void;
  join: (username: string, email: string, message: string) => void;
  reset: () => void;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { addMessage, setAgentLeft, setRoom, resetMessages, setIsAgentTyping } =
    useAgentStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { playSound } = useSound();

  const { villageId } = useVillageStore();

  const reset = () => {
    resetMessages();
    setRoom(null, null);
  };

  useEffect(() => {
    if (!villageId) return;
    const newSocket = io(SOCKET_SERVER_PATH);

    newSocket.on("connect", () => {
      console.log("Connected");
    });

    newSocket.on("agent-joined", (payload) => {
      console.log("PAYLOAD", payload);
      const roomId = payload.roomId;
      const agent = {
        agentName: payload.agentName,
        socketId: payload.agentId,
      };
      if (!roomId || !payload.agentName || !payload.agentId) {
        console.error("Invalid Payload");
        return;
      }
      playSound();
      setRoom(roomId, agent);
    });

    newSocket.on("typing", (payload) => {
      if (payload.isTyping !== undefined) {
        setIsAgentTyping(payload.isTyping);
      }
    });

    newSocket.on("message", (payload) => {
      console.log("PAYLOAD", payload);
      playSound();
      addMessage(payload.message, "agent");
    });

    newSocket.on("disconnected", () => {
      setAgentLeft(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [villageId]);

  const sendMessage = (message: string, roomId: string) => {
    addMessage(message, "consumer");
    socket?.emit("message", { message, roomId, villageId });
  };

  const join = (userName: string, email: string, message: string) => {
    socket?.emit("join", {
      villageId: villageId,
      email,
      message,
      name: userName,
      role: "consumer",
    });
  };

  return (
    <SocketContext.Provider value={{ socket, sendMessage, join, reset }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
