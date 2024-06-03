import { Server, Socket } from "socket.io";
import { handleDisconnection } from "./lib/utils";
import { Village } from "./village";

type JoinPayload = {
  name: string;
  email:string;
  villageId: string;
  role: "agent" | "consumer";
};

type CreateRoomPayload = {
  villageId: string;
  consumerId: string;
};

type MessagePayload = {
  villageId: string;
  roomId: string;
  message: string;
};

export class SocketHandler {
  constructor(private io: Server) {
    io.on("connection", (socket: Socket) => {
      console.log("New client connected");

      socket.on("join", ({ name, email, role, villageId }: JoinPayload) => {
        if (!role || !villageId) {
          console.log({ role, villageId });
          socket.emit("error", "Missing role or villageId");
          return;
        }

        console.log({ name, villageId });

        let village = Village.getVillage(villageId);
        if (!village) {
          // TODO: Add Logic for checking the villageId

          village = new Village(villageId, "Village ABC", io);
        }

        if (role === "consumer") {
        
          const consumer = village.getWaitlistUserById(socket.id);
          if (consumer) {
            return socket.emit("error", { message: "Consumer Already Exist" });
          }
          if(!email){
            return socket.emit("error", { message: "Consumer Email is also required" });
          }
          village.joinConsumer(socket.id, name, email);
        } else if (role === "agent") {
          village.joinAgent(socket, name);
          socket.emit("consumers:get", { consumers: village.consumerWaitlist });
        }

        socket.emit("joinedVillage", { villageId, name, role });
      });

      socket.on(
        "createRoom",
        ({ villageId, consumerId }: CreateRoomPayload, cb) => {
          console.log({ villageId, consumerId, cb });

          const village = Village.getVillage(villageId);
          const agent = village?.getAgentById(socket.id);
          const consumer = village?.getWaitlistUserById(consumerId);

          if (!agent) {
            return socket.emit("error", {
              message: "No Agent Found",
            });
          }

          const existingRoom = village?.rooms.find(room => room.agent.socketId === socket.id)
          if(!!existingRoom){
            village?.deleteRoom(existingRoom.roomId)
            village?.joinConsumer(existingRoom.consumer.socketId,existingRoom.consumer.consumerName, existingRoom.consumer.email )
          }

          if (village) {
            const roomId = village.makeRoom(socket.id, consumerId);
            if (roomId) {
              socket.emit("roomCreated", { roomId });
              cb(roomId, consumer);
            } else {
              socket.emit("error", {
                message: "Unable to create room",
              });
            }
          }
        }
      );

      socket.on("message", ({ villageId, roomId, message }: MessagePayload) => {
        const village = Village.getVillage(villageId);
        console.log(message, villageId);
        if (village) {
          console.log(village.villageId);
          const room = village.rooms.find((room) => room.roomId === roomId);
          
          if (room) {
            console.log(room.roomId);
            room.sendMessage(socket, message);
          }
        }
      });

      socket.on("endChat", ({villageId, roomId}:{villageId:string,roomId:string})=>{
        const village = Village.getVillage(villageId);
        if (village) {
          console.log(village.villageId);
          const room = village.rooms.find((room) => room.roomId === roomId);
          
          if (room) {
            console.log(room.roomId);
            village.deleteRoom(room.roomId)
          }
        }
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        handleDisconnection(socket.id);
      });
    });
  }
}