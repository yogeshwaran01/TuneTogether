import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client"
import { SeverEvents as ServerEvents, ClientEvents, Video } from "../../../common/socket"
import { YoutubePlayerService } from "./youtube-player.service";
import { PlayerState } from "../../../common/PlayerState";
import { PlaylistService } from "./playlist.service";

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket<ServerEvents, ClientEvents>;

    constructor(private playerService: YoutubePlayerService,
        private playlistService: PlaylistService,
    ) {
        this.socket = io("http://localhost:3000");
        this._addTrackEvents();
        this._addPlaylistEvents();
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

    private _addPlaylistEvents()
    {
        this.socket.on("playlist:added", ((video: Video) => {
            this.playlistService.addVideo(video);
        }));

        this.socket.on("playlist:removed", ((video: Video) => {
            this.playlistService.removeVideo(video);
        }));
    }

    EmitPlay() {
        this.socket.emit("track:play", { isPlaying: true, time: this.playerService.getCurrentTime() }, (res) => { });
    }

    EmitPause() {
        this.socket.emit("track:pause", { isPlaying: false, time: this.playerService.getCurrentTime() }, (res) => { });
    }

    EmitTrack(id: string) {
        this.socket.emit("track:set", { track: id }, (res) => { });
    }

    EmitPlaylistAdd(video: Video) {
        this.socket.emit("playlist:add", video, (res) => { });

    }

    EmitPlaylistRemove(video: Video) {
        this.socket.emit("playlist:remove", video, (res) => { });
    }
}