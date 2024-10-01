import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Video } from '../../../../common/socket';
import { VideoState } from '../../enum/VideoState';
import { SocketService } from '../../services/socket.service';
import { YoutubePlayerService } from '../../services/youtube-player.service';
import { PlaylistComponent } from "../Playlist/Playlist.component";
import { YoutubePlayerComponent } from '../YoutubePlayer/YoutubePlayer.component';

@Component({
  selector: 'synced-player',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    YoutubePlayerComponent,
    PlaylistComponent
],
  styleUrl: './SyncedPlayer.component.css',
  templateUrl: "./SyncedPlayer.component.html",
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SyncedPlayerComponent implements OnInit {

  constructor(private playerService: YoutubePlayerService, 
    private socketService: SocketService) {

  }

  public showControls: boolean = false;
  private lastAction = "";

  ngOnInit(): void {
    
  }

  HandleVideoStateChanges(state: VideoState): void
  {
    switch (state) {
      case VideoState.PLAYING:
        if (this.lastAction !== 'play') {
          this.socketService.emitPlaying();
          this.lastAction = "play";
        }
        break;
      case VideoState.PAUSED:
        if (this.lastAction !== 'pause') {
          this.socketService.emitPaused();
          this.lastAction = "pause";
        }
        break;
      default:
        break;
    }
  }

  OnAdd(video: Video)
  {
    console.log("Added", video);
    this.socketService.emitPlaylistAdd(video);
  }

  OnRemove(video: Video)
  {
    console.log("Removed", video);
    this.socketService.emitPlaylistRemove(video);
  }

  OnSelect(video: Video)
  {
    if (!video.id) {return;}
    this.playerService.isPlayerReady.subscribe((isReady: boolean) => {
      if (!isReady) { return; }
      this.playerService.loadVideoById(video.id);
      this.socketService.emitTrack(video.id);
    }) 
  }

  OnReorder(videos: Video[])
  {
    this.socketService.emitPlaylistLoaded(videos);
  }
}
