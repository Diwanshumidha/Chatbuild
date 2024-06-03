import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type TUser = {
    name: string;
    email: string;
}

type TVillageContext = {
  villageId: string | null;
    setVillageId: Dispatch<SetStateAction<string | null>>;
    user: TUser | null
    setUser: Dispatch<SetStateAction<TUser | null>>;
};

export const VillageContext = createContext<TVillageContext | null>(null);

export function VillageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [messages, setMessages] = useState<TMessage[]>([]);
  const [ villageId, setVillageId ] = useState<string | null>(null)
  const [user, setUser] = useState<TUser | null>(null);
  return (
    <VillageContext.Provider
      value={{ villageId, setVillageId, user, setUser }}
    >
      {children}
    </VillageContext.Provider>
  );
}

export const useVillageStore = () => {
  const context = useContext(VillageContext)
  if(!context){
    throw Error("Wrap The Layout in Village Provider")
  }
  return context
}


// ----------------------------- Room -----------------------------------------
type TMessage = {
  message: string;
  time:number;
  by: "agent" | "consumer";
};

export type TAgent = {
  agentName: string;
  socketId: string;
};

interface TRoomState {
  messages: TMessage[];
  currentRoomId: string | null;
  agent: TAgent | null;
  hasAgentLeft:boolean;

  setAgentLeft:(b:boolean) => void
  setRoom: (roomId: string | null, agent: TAgent | null) => void;
  addMessage: (message: string, by: "agent" | "consumer") => void;
  resetMessages:()=>void
}





export const AgentContext = createContext<TRoomState | null>(null);

export function AgentContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ messages, setMessages ] = useState<TMessage[]>([])
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
  const [agent, setAgent] = useState<TAgent | null>(null);
  const [hasAgentLeft,setAgentLeft] = useState<boolean>(false)

  const addMessage = (message:string, by:"agent" | "consumer") => {
    setMessages(prev => ([...prev,{ message, by, time:Date.now() }]))
  }
  const resetMessages = () => {
    setMessages([])
    setAgentLeft(false)
  }

  const setRoom = (roomId:string | null ,agent:TAgent | null) => {
    setCurrentRoomId(roomId)
    setAgent(agent)
    addMessage(`${agent?.agentName || "Agent"} Joined The Chat`, "agent")
  }

  return (
    <AgentContext.Provider
      value={{ messages, currentRoomId,setRoom, hasAgentLeft,addMessage,resetMessages, agent,setAgentLeft  }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export const useAgentStore = () => {
  const context = useContext(AgentContext)
  if(!context){
    throw Error("Wrap The Layout in Agent Provider")
  }
  return context
}
