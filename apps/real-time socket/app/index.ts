import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { Village, rooms, villages } from './socket';
dotenv.config();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.send("Hello")
});

io.on('connection', (socket) => {
  console.log(`A User Connected`, socket.id);

  socket.on('join', (data:{villageId:string, role:"consumer" | "agent",userName:string}) => {
    const {villageId, role, userName} = data
    // Check if the village exists
    let village = villages.find(v => v.villageId === villageId);
    if (village) {
      console.log(`User joined village: ${village.name}`);
      socket.emit(`User joined village: ${village.name}`)

    } else {
      village = new Village(villageId, "Village ABC", io)
      console.log(village.villageId)
      socket.emit(`User created & joined village: ${village.name}`)
    }

    if(role === "consumer"){
      village?.joinConsumer(socket.id, userName)


      const waitlist = village?.getWaitlistUsers()
      const agents = village?.getAgents()

      console.log({waitlist,agents});


      if(agents){
        io.to(agents).emit("consumer-joined", {users:waitlist})
      }
     
    }
    if(role === "agent"){
      village.joinAgent(socket.id, userName)
    }
    

  });

  socket.on('make-room', (data:{villageId:string,consumerSocketId:string})=>{
    const village = villages.find(v => v.villageId === data.villageId);
    if(!village){
      return
    }
    village.makeRoom(socket.id, data.consumerSocketId)

  })

  socket.on('send-message', (data:{roomId:string,message:string})=>{
    console.log(data)
    const room = rooms.find(room => room.roomId === data.roomId)
    if(!room || !room.roomId ){
      return
    }
    room?.sendMessage(socket,data.roomId, data.message)

  })

  


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`[SERVER] Server running at http://localhost:${PORT}`);
});