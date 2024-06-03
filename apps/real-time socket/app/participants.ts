import { Socket } from "socket.io";

export class Agent {
  public socketId: string;
  public agentName: string;

  constructor(
    socketId: string,
    agentName: string,
    public socket: Socket
  ) {
    this.socketId = socketId;
    this.agentName = agentName;
  }

  getAgentDetails() {
    return {
      agentName: this.agentName,
      socketId: this.socketId,
    };
  }
}

export class Consumer {
  public socketId: string;
  public consumerName: string;
  public email:string
  

  constructor(socketId: string, consumerName: string, email:string) {
    this.socketId = socketId;
    this.consumerName = consumerName;
    this.email = email
  }

  getConsumerDetails() {
    return {
      agentName: this.consumerName,
      email:this.email,
      socketId: this.socketId,
    };
  }
}
