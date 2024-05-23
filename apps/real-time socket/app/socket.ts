import { Server, Socket } from "socket.io";

export const villages: Village[] = [];
// Fix this make a socketHandler
export const rooms:Room[] = []



export class Village {
    public villageId: string;
    public name: string;
    public consumer_waitlist:Consumer[]
    public available_Agents:Agent[]
    public rooms:Room[]
    public io:Server
    

    constructor(villageId: string, name: string, io:Server) {
        this.villageId = villageId;
        this.name = name;
        this.consumer_waitlist = []
        this.available_Agents = []
        this.rooms = []
        this.io = io

        villages.push(this);
        console.log("Yeah You entered the village");
    }

    getVillage(villageId: string): Village | undefined {
        return villages.find((village) => village.villageId === villageId);
    }

    joinConsumer(socketId:string, name:string){
        const consumer = new Consumer(socketId,name)
        this.consumer_waitlist.push(consumer)
    }

    joinAgent(socketId:string, name:string){
        const agent = new Agent(socketId,name)
        this.available_Agents.push(agent)
    }



    getAgents(){
        const agents = this.available_Agents
        return agents.map(agent => agent.socketId)
    }

    getWaitlistUsers(){
        const users = this.consumer_waitlist
        return users.map(user => ({name:user.consumerName, socketId:user.socketId}))
    }


    makeRoom(agentId:string,consumerId:string){
        const agent = this.available_Agents.find((agent) => agent.socketId === agentId)
        const consumer = this.consumer_waitlist.find((consumer)=>consumer.socketId === consumerId)

        if(!agent || !consumer){
            return
        }

        const room = new Room(agent,consumer, this)
        rooms.push(room)
    }

    



    deleteVillage(villageId: string): void {
        const index = villages.findIndex((village) => village.villageId === villageId);
        if (index !== -1) {
            villages.splice(index, 1);
            console.log("Village deleted successfully");
        } else {
            console.log("Village not found");
        }
    }
}

class Agent {
    public socketId:string;
    public agentName:string;

    constructor(socketId:string,agentName:string){
        this.socketId = socketId
        this.agentName = agentName
    }

}

class Consumer {
    public socketId:string;
    public consumerName:string;

    constructor(socketId:string,consumerName:string){
        this.socketId = socketId
        this.consumerName = consumerName
    }
}

class Room {
    public agent:Agent
    public consumer:Consumer
    private village:Village
    public roomId:string | null


    constructor(agent:Agent,consumer:Consumer, village:Village){
        this.agent = agent
        this.consumer = consumer
        this.village = village

        const io = village.io
        const socket = io.sockets.sockets.get(agent.socketId) 
        if(!socket){
            this.roomId = null
            return
        }
        const roomId = `room-${agent.socketId}-${consumer.socketId}`;

        console.log(roomId,this.agent,this.consumer)
        socket.join(roomId)
        io.to(consumer.socketId).socketsJoin(roomId);
        socket.to(consumer.socketId).emit("agent-joined", { roomId, agentId: agent.socketId });

        this.roomId = roomId
    }


    sendMessage(socket: Socket, roomId: string, message: string) {
        this.village.io.to(roomId).emit("message", { senderId: socket.id, message });
    }

    
}
