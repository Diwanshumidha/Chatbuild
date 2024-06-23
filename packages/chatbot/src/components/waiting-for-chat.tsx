import { useEffect, useState } from "react";
import {AgentNotThere, WaitingIllustration }from "./waiting-svg";

const WaitingForChat = () => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 120000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="cb-bg-white cb-flex cb-flex-col cb-justify-center cb-items-center cb-gap-5">
      {isTimedOut && ( 
        <>
         <AgentNotThere />
        <p className="cb-p-2 cb-text-center">
          No agents available at the moment. We will email you shortly.
        </p>
        </>
      )}
      {!isTimedOut && (
        <>
          <WaitingIllustration />
          An Agent Will Join You Shortly
        </>
      )}
    </div>
  );
};

export default WaitingForChat;
