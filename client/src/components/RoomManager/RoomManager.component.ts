import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Room } from '../../../../common/socket';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'room-manager',
    standalone: true,
    imports: [
        CommonModule, ButtonModule
        , InputTextModule, FormsModule,
    ],
    templateUrl: "./RoomManager.component.html",
    styleUrl: './RoomManager.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomManagerComponent { 

    /**
     *
     */
    constructor(private socketService: SocketService) {
        
    }
    roomId: string = "";

    /**
     * Helps to join a room
     * @returns 
     */
    join()
    {
        if (this.roomId == "") {return;}
        const r: Room = {
            id: this.roomId
        };
        this.socketService.emitJoinRoom(r);
    }

    
}
