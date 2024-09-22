import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { YoutubePlayerService } from '../../services/youtube-player.service';
import { VideoState } from '../../enum/VideoState';

@Component({
  selector: 'youtube-player',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div #youtubeContainer></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubePlayerComponent implements OnInit {

  constructor(private playerService: YoutubePlayerService)
  {

  }

  @ViewChild('youtubeContainer', { static: true }) youtubeContainer!: ElementRef;

  @Output() onPlayerReady = new EventEmitter<any>();
  @Output() onPlayerStateChange = new EventEmitter<VideoState>();

  @Input() showControls: Boolean = true;
  @Input() autoPlay: Boolean = true;

  ngOnInit() {
    if ((window as any).YT && (window as any).YT.Player) {
      this.createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    }
  }

  createPlayer() {
    const player = new (window as any).YT.Player(this.youtubeContainer.nativeElement, {
      height: '390',
      width: '640',
      playerVars: {
        enablejsapi: 1,
        controls: this.showControls ? 1: 0,
        autoplay: this.autoPlay ? 1 : 0,
        rel: 0
      },
      events: {
        'onReady': (event: any) => {
          this.onPlayerReady.emit(event);
          this.playerService.initializePlayer(player); 
        },
        'onStateChange': (event: any) => this.onPlayerStateChange.emit(this._getPlayerState(event.data))
      }
    });
  }

  private _getPlayerState(state: any): VideoState
  {
    const stateNumber: number = state as number;
    switch (stateNumber) {
      case -1:
        return VideoState.UNSTARTED;
      case 0:
        return VideoState.ENDED;
      case 1:
        return VideoState.PLAYING;
        case 2:
          return VideoState.PAUSED;
      case 3:
        return VideoState.BUFFERING;
      case 5:
        return VideoState.CUED
      default:
        return VideoState.UNSTARTED;
    }
  }
}