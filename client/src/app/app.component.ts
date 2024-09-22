import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button, ButtonModule} from "primeng/button"
import { YoutubeApiService } from '../services/youtube-api.service';
import { YoutubePlayerComponent } from '../components/Player/YoutubePlayer.component';
import { YoutubePlayerService } from '../services/youtube-player.service';
import { VideoState } from '../enum/VideoState';
import { SyncedPlayerComponent } from '../components/SyncedPlayer/SyncedPlayer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, SyncedPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {

  constructor (private yts: YoutubeApiService, private player: YoutubePlayerService)
  {

  }

  title = 'web';

  ngOnInit(): void {
    
  }

  
}
