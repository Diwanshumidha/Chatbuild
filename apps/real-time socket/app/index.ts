import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { Village, villages } from './socket';
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

  socket.on('join', (data) => {
    const {villageId, role} = data
    // Check if the village exists
    const village = villages.find(v => v.villageId === villageId);
    if (village) {
      console.log(`User joined village: ${village.name}`);
      socket.emit(`User joined village: ${village.name}`)

    } else {
      const village = new Village(villageId, "Village ABC")
      console.log(village.villageId)
      socket.emit(`User created & joined village: ${village.name}`)
    }


  });

  


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`[SERVER] Server running at http://localhost:${PORT}`);
});