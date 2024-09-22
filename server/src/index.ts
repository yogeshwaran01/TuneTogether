import { join } from "path";
import { Server as IO } from "socket.io";
import express, { Express } from "express";
import { createServer, Server } from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import { teamRouter } from "./team/team.router";
import { ClientEvents, SeverEvents } from "../../common/socket"
import { PlayerState } from "../../common/PlayerState";

dotenv.config();
const port = process.env.PORT;

export const app: Express = express();
export const server: Server = createServer(app);
const io = new IO<ClientEvents, SeverEvents>(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://cdn.socket.io https://www.youtube.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; frame-src 'self' https://www.youtube.com");
  next();
});


app.use(cors({
  origin: 'http://localhost:4200' 
}));
app.use(express.json());
app.use("/team", teamRouter);



const playerState: PlayerState = {
  time: 0,
  isPlaying: false,
  track: ""
};

io.on("connection", (socket) => {

  if (playerState.track != "") {
    socket.emit("track:setted", playerState);
  }

  socket.on("track:set", (data) => {
    playerState.track = data.track;
    io.emit("track:setted", playerState);
  });

  socket.on("track:play", (data) => {
    playerState.isPlaying = true;
    playerState.time = data.time;
    io.emit("track:played", playerState);
  });

  socket.on("track:pause", (data) => {
    playerState.isPlaying = false;
    playerState.time = data.time;
    io.emit("track:paused", playerState);
  });

  socket.on("playlist:add", (data) => {
    io.emit('playlist:added', data);
  })

  socket.on("playlist:remove", (data) => {
    io.emit("playlist:removed", data);
  })
})


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
