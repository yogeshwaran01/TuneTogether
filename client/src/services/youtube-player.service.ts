import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class YoutubePlayerService {

    private player: any; 

    public isPlayerReady : BehaviorSubject<boolean> = new BehaviorSubject(false);

    loadVideoById(videoId: string) {
        console.log(this.player);
        this.isPlayerReady.subscribe((isReady: boolean) => {
            if (this.player) {
              this.player.loadVideoById(videoId);
            }
        })
      }

    initializePlayer(player: any) {
        this.player = player;
        this.isPlayerReady.next(true);
    }

    play() {
        if (this.player) {
            this.player.playVideo();
        }
    }

    pause() {
        if (this.player) {
            this.player.pauseVideo();
        }
    }

    stop() {
        if (this.player) {
            this.player.stopVideo();
        }
    }

    seekTo(seconds: number, allowSeekAhead: boolean = true) {
        if (this.player) {
            this.player.seekTo(seconds, allowSeekAhead);
        }
    }

    mute() {
        if (this.player) {
            this.player.mute();
        }
    }

    unmute() {
        if (this.player) {
            this.player.unMute();
        }
    }

    setVolume(volume: number) {
        if (this.player && volume >= 0 && volume <= 100) {
            this.player.setVolume(volume);
        }
    }

    getCurrentTime(): number {
        return this.player ? this.player.getCurrentTime() : 0;
    }

    getDuration(): number {
        return this.player ? this.player.getDuration() : 0;
    }

    isMuted(): boolean {
        return this.player ? this.player.isMuted() : false;
    }
}
