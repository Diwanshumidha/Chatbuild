import { Socket } from "socket.io";
import { Agent, Consumer } from "./participants";
import { Village } from "./village";

export class Room {
  public roomId: string;

  constructor(
    public agent: Agent,
    public consumer: Consumer,
    private village: Village
  ) {
    this.roomId = `room-${agent.socketId}-${consumer.socketId}`;
    this.joinRoom();
    this.village.removeConsumerFromWaitlist(consumer.socketId);
    village.updateWaitlist();
  }

  private joinRoom() {
    const { io, villageId } = this.village;
    const agentSocket = io.sockets.sockets.get(this.agent.socketId);
    const consumerSocket = io.sockets.sockets.get(this.consumer.socketId);

    if (agentSocket && consumerSocket) {
      agentSocket.join(this.roomId);
      consumerSocket.join(this.roomId);

      agentSocket.to(this.consumer.socketId).emit("agent-joined", {
        roomId: this.roomId,
        agentId: this.agent.socketId,
      });

      console.log(
        `${this.agent.socketId} and ${this.consumer.socketId} joined room ${this.roomId}`
      );
    }
  }

  sendMessage(socket: Socket, message: string) {
    socket
      .to(this.roomId)
      .except(socket.id)
      .emit("message", { senderId: socket.id, message });
  }

  notifyDisconnection() {
    this.village.io
      .to(this.roomId)
      .emit("disconnected", { roomId: this.roomId });
    this.village.updateWaitlist();
  }
}
