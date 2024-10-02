import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import { createServer, Server } from "http";
import { Server as IO } from "socket.io";
import { PlayerState } from "../../common/PlayerState";
import { ClientEvents, Room, SeverEvents, Video } from "../../common/socket";
import { teamRouter } from "./team/team.router";

dotenv.config();
const port = process.env.PORT;

export const app: Express = express();
export const server: Server = createServer(app);
const io = new IO<ClientEvents, SeverEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.socket.io https://www.youtube.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; frame-src 'self' https://www.youtube.com");
  next();
});


app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use("/team", teamRouter);


interface Storage {
  playerState: PlayerState;
  playList: Video[];
  room: Room;
}

interface StorageBucket {
  [key: string]: Storage;
}

const storage: StorageBucket = {};

io.on("connection", (socket) => {

  socket.on("room:create", (data: Room) => {

    socket.join(data.id);

    // Create a new room if it doesn't exist
    if (!storage[data.id]) {
      storage[data.id] = {
        playerState: {
          time: 0,
          isPlaying: false,
          track: ""
        }, playList: [],
        room: {
          id: data.id,
          members: [],
        }
      };
      io.in(data.id).emit("room:created", storage[data.id].room);
    }

    if (data.currentUser) {
      if (!storage[data.id].room.members.includes(data.currentUser)) {
        storage[data.id].room.members.push(data.currentUser);
      }
      io.in(data.id).emit("room:added", storage[data.id].room);
    }


    if (storage[data.id].playerState.track != "") {
      io.in(data.id).emit("track:setted", storage[data.id].playerState);
    }

    if (storage[data.id].playList.length != 0) {
      io.in(data.id).emit("playlist:loaded", storage[data.id].playList);
    }

  })

  socket.on("room:exit", (data: Room) => {
    socket.leave(data.id);
    storage[data.id].room.members = storage[data.id].room.members.filter(m => m !== data.currentUser);
    io.in(data.id).emit("room:exited", storage[data.id].room);
  });

  socket.on("track:set", (data, room: Room) => {
    storage[room.id].playerState.track = data.track;
    io.in(room.id).emit("track:setted", storage[room.id].playerState);
  });

  socket.on("track:play", (data, room: Room) => {
    storage[room.id].playerState.isPlaying = true;
    storage[room.id].playerState.time = data.time;
    io.in(room.id).emit("track:played", storage[room.id].playerState);
  });

  socket.on("track:pause", (data, room: Room) => {
    storage[room.id].playerState.isPlaying = false;
    storage[room.id].playerState.time = data.time;
    io.in(room.id).emit("track:paused", storage[room.id].playerState);
  });

  socket.on("playlist:add", (data: Video, room: Room) => {

    storage[room.id].playList.push(data);
    console.log(storage);
    io.in(room.id).emit("playlist:added", data);
  })

  socket.on("playlist:remove", (data: Video, room: Room) => {
    storage[room.id].playList = storage[room.id].playList.filter(v => v.id !== data.id);
    io.in(room.id).emit("playlist:removed", data);
  });

  socket.on("playlist:load", (data: Video[], room: Room) => {
    storage[room.id].playList = data;
    io.in(room.id).emit("playlist:loaded", data);
  });

})


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
