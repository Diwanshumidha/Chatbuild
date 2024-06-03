import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { Village, villages } from "./village";
import { SocketHandler } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/waitlist", (req, res) => {
  res.send(villages);
});
app.get("/waitlist/:villageId", (req, res) => {
  const villageId = req.params.villageId;
  if (!villageId || typeof villageId !== "string") {
    return res.send("Not Found");
  }
  const village = Village.getVillage(villageId);

  if (!village) {
    return res.send("Not Found");
  }
  const waitlist = village.consumerWaitlist;
  res.json({ waitlist });
});

app.get("/agents/:villageId", (req, res) => {
  const villageId = req.params.villageId;
  if (!villageId || typeof villageId !== "string") {
    return res.send("Not Found");
  }
  const village = Village.getVillage(villageId);

  if (!village) {
    return res.send("Not Found");
  }
  const agents = village.availableAgents;
  res.json({ agents });
});

new SocketHandler(io);

server.listen(PORT, () => {
  console.log(`[SERVER] Server running at http://localhost:${PORT}`);
});
