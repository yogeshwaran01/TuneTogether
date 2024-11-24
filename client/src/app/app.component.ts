import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { RoomManagerComponent } from "../components/RoomManager/RoomManager.component";
import { SyncedPlayerComponent } from '../components/SyncedPlayer/SyncedPlayer.component';
import { YoutubeApiService } from '../services/youtube-api.service';
import { GlobalHeaderComponent } from '../components/global-header/global-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, SyncedPlayerComponent, RoomManagerComponent, GlobalHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {

  // Note: Don't remove the YoutubeAPI Service from ctor
  constructor(private yts: YoutubeApiService) {

  }

  roomId: string = "";
}
