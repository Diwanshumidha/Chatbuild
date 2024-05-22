export const villages: Village[] = [];



export class Village {
    public villageId: string;
    public name: string;
    public consumer_waitlist:Consumer[]
    public available_Agents:Agent[]
    public rooms:Room[]
    

    constructor(villageId: string, name: string) {
        this.villageId = villageId;
        this.name = name;
        this.consumer_waitlist = []
        this.available_Agents = []
        this.rooms = []

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
    // public agent:Agent
    // public consumer:Consumer

    // constructor(agentId,consumerId){
    //     this.agent = socketId
    //     this.consumerName = consumerName

    // }

}
