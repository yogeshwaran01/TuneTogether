// interface Error {
//     error: string;
//     errorDetails?: {
//         message: string;
//         path: Array<string | number>;
//         type: string;
//     }[];
// }

// interface Success<T> {
//     data: T;
// }

// export type Response<T> = Error | Success<T>;

// export interface PlayerState {
//     isPlaying: boolean;
//     track: string;
//     time: number;
// }

// export interface ClientEvents {
//     "track:set": (playerState: Omit<PlayerState, "isPlaying" | "time">, callback: (res: Response<PlayerState>) => void) => void;
//     "track:play": (playerState: Omit<PlayerState, "track">, callback: (res: Response<PlayerState>) => void) => void;
//     "track:pause": (playerState: Omit<PlayerState, "track">, callback: (res: Response<PlayerState>) => void) => void;
// }

// export interface SeverEvents {
//     "track:setted": (playerState: PlayerState) => void;
//     "track:paused": (playerState: PlayerState) => void;
//     "track:played": (playerState: PlayerState) => void;
// }