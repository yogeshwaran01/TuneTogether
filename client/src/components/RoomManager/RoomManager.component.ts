import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Room } from '../../../../common/socket';
import { PlaylistService } from '../../services/playlist.service';
import { RoomService } from '../../services/room.service';
import { SocketService } from '../../services/socket.service';
import { SyncedPlayerComponent } from '../SyncedPlayer/SyncedPlayer.component';

@Component({
    selector: 'room-manager',
    standalone: true,
    imports: [
        CommonModule, ButtonModule
        , InputTextModule, FormsModule, SyncedPlayerComponent
    ],
    templateUrl: "./RoomManager.component.html",
    styleUrl: './RoomManager.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class RoomManagerComponent implements OnInit {

    constructor(private socketService: SocketService, 
        private roomService: RoomService, 
        private playlistService: PlaylistService) {


    }
    roomId: string = "";
    userName: string = "";
    members: string[] = [];
    isJoined: boolean = false;

    ngOnInit(): void {
        const room: Room | null = this.roomService.getRoom();
        if (room) {
            this.isJoined = true;
            this.roomId = room.id;
            this.userName = room.currentUser ?? "";
            this.socketService.emitJoinRoom(room);
        }
        this.roomService.roomMembers$.subscribe((members: string[]) => { 
            if (members) {
                this.members = members;
            }   
        });
    }
    /**
     * Helps to join a room
     * @returns 
     */
    join() {
        if (this.roomId == "") { return; }
        const r: Room = {
            id: this.roomId,
            currentUser: this.userName,
            members: []
        };
        this.socketService.emitJoinRoom(r);
        this.roomService.setRoom(r);
        this.isJoined = true;
    }

    leave() {
        const room: Room | null = this.roomService.getRoom();
        if (!room) { return; }
        this.socketService.emitLeaveRoom(room);
        this.roomService.clearRoom();
        this.isJoined = false;
        this.playlistService.clearPlaylist();
        // this.PlayerService.clearPlayer();
    }


}
