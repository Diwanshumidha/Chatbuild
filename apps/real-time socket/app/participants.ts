export class Agent {
  public socketId: string;
  public agentName: string;

  constructor(socketId: string, agentName: string) {
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

  constructor(socketId: string, consumerName: string) {
    this.socketId = socketId;
    this.consumerName = consumerName;
  }

  getConsumerDetails() {
    return {
      agentName: this.consumerName,
      socketId: this.socketId,
    };
  }
}
