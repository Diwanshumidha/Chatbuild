import { Namespace, Server, Socket } from "socket.io";
import { removeEntityFromArray } from "./lib/utils";
import { Agent, Consumer } from "./participants";
import { Room } from "./room";

export const villages: Village[] = [];

export class Village {
  public consumerWaitlist: Consumer[];
  public availableAgents: Agent[];
  public rooms: Room[];

  constructor(
    public villageId: string,
    public name: string,
    public io: Server
  ) {
    this.consumerWaitlist = [];
    this.availableAgents = [];
    this.rooms = [];

    villages.push(this);
    console.log(`A New Village Created Village Id:${this.villageId}`);
  }

  joinConsumer(socketId: string, name: string, email:string) {
    const consumer = new Consumer(socketId, name,email);
    this.consumerWaitlist.push(consumer);
    this.updateWaitlist();
  }

  joinAgent(socket: Socket, name: string) {
    const agent = new Agent(socket.id, name, socket);
    this.availableAgents.push(agent);
  }

  removeAgent(socketId: string) {
    removeEntityFromArray(this.availableAgents, socketId, "Agent");
  }

  removeConsumerFromWaitlist(socketId: string) {
    removeEntityFromArray(this.consumerWaitlist, socketId, "Consumer");
  }

  // --------------------- Getters -------------------------

  static getVillage(villageId: string): Village | undefined {
    return villages.find((village) => village.villageId === villageId);
  }

  getAgents() {
    return this.availableAgents.map((agent) => agent.socketId);
  }

  getAgentById(socketId: string) {
    return this.availableAgents.find((agent) => agent.socketId === socketId);
  }

  getWaitlistUsers() {
    return this.consumerWaitlist.map((user) => user.getConsumerDetails());
  }

  getWaitlistUserById(socketId: string) {
    return this.consumerWaitlist.find((user) => user.socketId === socketId);
  }

  // --------------------- Helpers ---------------------------

  makeRoom(agentId: string, consumerId: string): string | null {
    const agent = this.getAgentById(agentId);
    const consumer = this.getWaitlistUserById(consumerId);

    if (!agent || !consumer) {
      return null;
    }

    const room = new Room(agent, consumer, this);
    console.log(`Room Has Been Created`);

    this.rooms.push(room);
    return room.roomId;
  }

  updateWaitlist() {
    console.log("Updated Waitlist to the agents");
    this.sendMessageToAllAgents("update-waitlist", this.consumerWaitlist);
  }

  private updateAllAgents(event: string, data: any) {
    this.io
      .to(this.availableAgents.map((agent) => agent.socketId))
      .emit(event, data);
  }

  sendMessageToAllAgents(event: string, data: any) {
    console.log(this.availableAgents);
    this.availableAgents.forEach((agent) => {
      agent.socket.emit(event, data);
    });
  }

  //-------------------- Deletions ------------------------------

  deleteRoom(roomId: string) {
    const roomIndex = this.rooms.findIndex((room) => room.roomId === roomId);
    if (roomIndex !== -1) {
      const room = this.rooms[roomIndex];
      room.notifyDisconnection();
      this.rooms.splice(roomIndex, 1);
      console.log(`Room ${roomId} deleted successfully`);
    }
  }
}
