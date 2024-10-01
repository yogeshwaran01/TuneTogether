import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from "primeng/button";
import { RoomManagerComponent } from "../components/RoomManager/RoomManager.component";
import { SyncedPlayerComponent } from '../components/SyncedPlayer/SyncedPlayer.component';
import { YoutubeApiService } from '../services/youtube-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, SyncedPlayerComponent, RoomManagerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {

  // Note: Don't remove the YoutubeAPI Service from ctor
  constructor(private yts: YoutubeApiService) {

  }

  roomId: string = "";
}
