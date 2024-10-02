import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Video } from "../../../common/socket";

@Injectable({
  providedIn: "root"
})
export class PlaylistService {

  private playlistSubject: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);
  private playlist$: Observable<Video[]> = this.playlistSubject.asObservable();

  constructor() {

  }

  getVideos(): Observable<Video[]> {
    return this.playlist$;
  }

  addVideo(video: Video): void {
    const updatedPlaylist = [...this.playlistSubject.getValue(), video];
    this.playlistSubject.next(updatedPlaylist);
  }

  removeVideo(video: Video): void {
    const updatedPlaylist = this.playlistSubject.getValue().filter(v => v.id !== video.id);
    this.playlistSubject.next(updatedPlaylist);
  }

  loadPlaylist(videos: Video[]): void {
    this.playlistSubject.next(videos);
  }

  clearPlaylist(): void { 
    this.playlistSubject.next([]);
  }
}
