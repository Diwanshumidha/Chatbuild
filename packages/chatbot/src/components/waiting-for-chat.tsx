import React, { useEffect } from "react";
import {AgentNotThere, WaitingIllustration }from "./waiting-svg";

const WaitingForChat = () => {
  const [isTimedOut, setIsTimedOut] = React.useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, 120000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="wait-room">
      {isTimedOut && ( 
        <>
         <AgentNotThere />
        <p>
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
