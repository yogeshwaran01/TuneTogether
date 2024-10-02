import { PlayerState } from "./PlayerState";

interface Error {
    error: string;
    errorDetails?: {
        message: string;
        path: Array<string | number>;
        type: string;
    }[];
}

interface Success<T> {
    data: T;
}

export type Response<T> = Error | Success<T>;


export interface ClientEvents {
    // Track Events
    "track:set": (playerState: Omit<PlayerState, "isPlaying" | "time">, room: Room, callback: (res: Response<PlayerState>) => void) => void;
    "track:play": (playerState: Omit<PlayerState, "track">, room: Room, callback: (res: Response<PlayerState>) => void) => void;
    "track:pause": (playerState: Omit<PlayerState, "track">, room: Room, callback: (res: Response<PlayerState>) => void) => void;

    // PlaylistEvents
    "playlist:add": (video: Video, room: Room, callback: (res: Response<Video>) => void) => void;
    "playlist:remove": (video: Video, room: Room, callback: (res: Response<Video>) => void) => void;
    "playlist:load": (Videos: Video[], room: Room, callback: (res: Response<Video>) => void) => void;

    // Room
    "room:create": (room: Room, callback: (res: Response<Room>) => void) => void;
    "room:exit": (room: Room, callback: (res: Response<Room>) => void) => void; 

}

export interface SeverEvents {
    "track:setted": (playerState: PlayerState) => void;
    "track:paused": (playerState: PlayerState) => void;
    "track:played": (playerState: PlayerState) => void;

    "playlist:added": (video: Video) => void;
    "playlist:removed": (Video: Video) => void;
    "playlist:loaded": (Videos: Video[]) => void;

    "room:created": (room: Room) => void;
    "room:exited": (room: Room) => void;
    "room:added": (room: Room) => void;

    "notification": (notification: Notification) => void;
}

export interface Room {
    id: string;
    members: string[];
    currentUser?: string;
}

export interface Video {
    title: string;
    thumbnail: string;
    url: string;
    id: string;
}

export interface Notification {
    message: string;
}

export interface RVideo extends Video {
    room: Room;
}

export interface RPlayerState extends PlayerState
{
    room: Room;
}

export interface AppState
{
    playerState: PlayerState;
    videos: Video[],
    room: Room
}