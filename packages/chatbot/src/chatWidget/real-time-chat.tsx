import { useState } from "react"
import { useAgentStore, useVillageStore } from "../context/village-context"
import { useSocket } from "../hooks/use-consumer-socket"
import { Icons } from "../components/ui/Icons"
import RealTimeMessages from "../components/real-time-messages"
import { ScrollArea } from "../components/ui/scroll-area"
import WaitingForChat from "../components/waiting-for-chat"
import { Button } from "../components/ui/button"


const RealTimeChat = () => {
  const {user, setUser, villageId} = useVillageStore()
  const {currentRoomId, hasAgentLeft, isAgentTyping} = useAgentStore()
  const {join,sendMessage} = useSocket()
 
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [userMessage,setUserMessage] = useState("")




  const onSubmit = () => {
    if(!name || !email || !message){
        return 
    }

    join(name, email, message)
    setUser({email,name})
  }

  const sendMessageForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!userMessage || !currentRoomId){
        return
    }
    sendMessage(userMessage,currentRoomId)
    setUserMessage("")
  }



  if(!villageId){
    return null
  }

  if(!user){
    return (
        <div className="cb-flex cb-items-center cb-flex-1 cb-w-full cb-h-full cb-justify-center">
             <form
        onSubmit={onSubmit}
        className=" chatbot-widget__username cb-p-4 cb-w-full cb-space-y-2 cb-text-left"
      >
        <label className="cb-text-chatbot_foreground cb-font-semibold cb-px-1">
          Talk To A Live Person
        </label>
        <div className="cb-flex cb-flex-col cb-items-center cb-w-full cb-gap-3 ">
          <input
            type={"text"}
            placeholder="Your Name..."
            aria-label="Type here"
            className="chatbot-widget__username-input cb-h-9 cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-text-chatbot_foreground cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-flex cb-justify-end cb-items-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-rounded-r-none cb-text-sm"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type={"email"}
            placeholder="Your Email Address..."
            aria-label="Type here"
            className="chatbot-widget__username-input cb-h-9 cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-text-chatbot_foreground cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-flex cb-justify-end cb-items-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-rounded-r-none cb-text-sm"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <textarea
          rows={4}
            placeholder="Your message..."
            aria-label="Type here"
            className="chatbot-widget__username-input cb-py-2 cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-text-chatbot_foreground cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-flex cb-justify-end cb-items-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-rounded-r-none cb-text-sm"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            type="submit"
            className="cb-border-s-0 cb-w-full cb-h-9 chatbot-widget__username-submit"
          >
            Start Chat
          </Button>
        </div>
      </form>
        </div>
       
    )
  }



  if(!currentRoomId){
    return (
        <WaitingForChat/>
    ) 
  }

  return (
     <>
     
    <ScrollArea className="cb-px-4 cb-space-y-3 cb-h-full cb-flex cb-flex-col chatbot-widget__message-form cb-mb-4" >
      <RealTimeMessages/>
      </ScrollArea>
      {isAgentTyping && <div className="cb-flex cb-items-center cb-text-left cb-w-full cb-gap-2 cb-p-2">
        <p className="cb-text-chatbot_foreground cb-text-xs">Agent typing</p>
        <div className="cb-loader" >
          <div className="cb-loader__dot"></div>
          <div className="cb-loader__dot"></div>
          <div className="cb-loader__dot"></div>
        </div>
        </div>}
      <form
        onSubmit={sendMessageForm}
        className="cb-flex cb-flex-row cb-items-center cb-h-11 cb-text-chatbot_foreground focus-within:cb-ring-1 focus-within:cb-ring-chatbot_primary cb-rounded-md cb-border cb-border-input cb-bg-transparent cb-shadow-sm cb-transition-colors file:cb-border-0 file:cb-bg-transparent file:cb-text-sm file:cb-font-medium placeholder:cb-text-muted-foreground focus-visible:cb-outline-none focus-visible:cb-ring-1 cb- disabled:cb-cursor-not-allowed disabled:cb-opacity-50 cb-w-full cb-justify-end focus-visible:cb-ring-transparent focus:cb-ring-0 cb-focus cb-px-4 cb-text-sm"
      >
        
        <input
          type={"text"}
          placeholder="Message..."
          aria-label="Type here"
          value={userMessage}
          disabled={hasAgentLeft}
          onChange={(e) => setUserMessage(e.target.value)}
          className="chatbot-widget__message-form--input cb-flex-1 cb-py-2 focus:cb-outline-none   "
        />
        <button
          type="submit"
          disabled={hasAgentLeft}
          className="cb-border-s-0 chatbot-widget__message-form--submit cb-bg-transparent cb-text-chatbot_primary disabled:cb-opacity-55 "
         
        >
          <Icons.messageIcon />
        </button>
      </form>




    
   </>
  )
}

export default RealTimeChat