import { Injectable } from "@angular/core";
import { Video } from "../../../common/socket";


@Injectable({
    "providedIn": "root"
})
export class PlaylistService
{
    constructor()
    {

    }

    private playlist: Video[] = [];

    getVideos() : Video[]
    {
        return this.playlist;
    }
    
    addVideo(video: Video)
    {
        this.playlist?.push(video);
    }

    removeVideo(video: Video)
    {
        var i = this.playlist?.filter(v => v.id !== video.id);
        if (i) {
            this.playlist = i;
        }
    }
}