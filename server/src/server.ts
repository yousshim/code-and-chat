import express from "express";
import http from "http";
import { Socket, Server } from "socket.io";
import cors from "cors";
import RoomsManager from "./roomsManager";

const PORT = process.env.PORT || 8888;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const users: { [key: string]: { name: string; room: string } } = {};
io.on("connection", (socket: Socket) => {
  console.log("new user connedted");

  socket.on("join", ({ name, room }, cb) => {
    if (Object.values(users).find((user) => user.name === name)) {
      cb("User aleady exists");
      return;
    }
    users[socket.id] = { name, room };
    socket.join(room);
    socket
      .to(room)
      .broadcast.emit("announce", { txt: `${name} has just joined` });
  });

  socket.on("message", ({ user, txt }) => {
    socket.to(users[socket.id].room).broadcast.emit("message", { user, txt });
  });

  socket.on("code update", ({ code }) => {
    socket.to(users[socket.id].room).broadcast.emit("code update", { code });
  });

  socket.on("leave", () => {
    socket.to(users[socket.id].room).broadcast.emit("announce", {
      txt: `${users[socket.id].name} has just left`,
    });
    delete users[socket.id];
  });

  socket.on("disconnect", () => {
    console.log("user disconected");
  });
});

server.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
