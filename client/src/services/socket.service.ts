import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { PlayerState } from "../../../common/PlayerState";
import { ClientEvents, Room, SeverEvents as ServerEvents, Video } from "../../../common/socket";
import { PlaylistService } from "./playlist.service";
import { RoomService } from "./room.service";
import { YoutubePlayerService } from "./youtube-player.service";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket<ServerEvents, ClientEvents>;

    constructor(private playerService: YoutubePlayerService,
        private playlistService: PlaylistService,
        private roomService: RoomService,
    ) {
        this.socket = io("http://localhost:3000");
        this._addTrackEvents();
        this._addPlaylistEvents();
        this._addRoomEvents();
    }

    private _addTrackEvents() {
        this.socket.on("track:setted", (playerState: PlayerState) => {
            this.playerService.loadVideoById(playerState.track);
        })

        this.socket.on("track:played", (playerState: PlayerState) => {
            this.playerService.seekTo(playerState.time, true);
            this.playerService.play();
        });

        this.socket.on("track:paused", (playerState: PlayerState) => {
            this.playerService.seekTo(playerState.time, true);
            this.playerService.pause();
        });
    }

    private _addPlaylistEvents() {
        this.socket.on("playlist:added", ((video: Video) => {
            this.playlistService.addVideo(video);
        }));

        this.socket.on("playlist:removed", ((video: Video) => {
            this.playlistService.removeVideo(video);
        }));

        this.socket.on("playlist:loaded", ((videos: Video[]) => {
            this.playlistService.loadPlaylist(videos);
        }));
    }

    private _addRoomEvents() {
        this.socket.on("room:added", (room: Room) => {
            this.roomService.updateMembers(room.members);
        });

        this.socket.on("room:exited", (room: Room) => { 
            this.roomService.updateMembers(room.members);
        });
    }

    emitPlaying() {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("track:play", { isPlaying: true, time: this.playerService.getCurrentTime() }, room, () => { });
    }

    emitPaused() {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("track:pause", { isPlaying: false, time: this.playerService.getCurrentTime() }, room, () => { });
    }

    emitTrack(id: string) {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("track:set", { track: id }, room, () => { });
    }

    emitPlaylistAdd(video: Video) {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("playlist:add", video, room, () => { });
    }

    emitPlaylistRemove(video: Video) {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("playlist:remove", video, room, () => { });
    }

    emitPlaylistLoaded(videos: Video[]) {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socket.emit("playlist:load", videos, room, () => { });
    }

    emitJoinRoom(room: Room) {
        this.socket.emit("room:create", room, () => { });
    }

    emitLeaveRoom(room: Room) {
        this.socket.emit("room:exit", room, () => { });
    }
}