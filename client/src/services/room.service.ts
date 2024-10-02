import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Room } from '../../../common/socket';


@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private roomSubject: BehaviorSubject<string[]>;
    public roomMembers$: Observable<string[]>;

    constructor() {
        this.roomSubject = new BehaviorSubject<string[]>([]);
        this.roomMembers$ = this.roomSubject.asObservable();
    }

    setRoom(room: Room): void {
        localStorage.setItem("room", JSON.stringify(room));
    }

    clearRoom(): void {
        localStorage.removeItem("room");
    }

    getRoom(): Room | null {
        const r: Room = JSON.parse(localStorage.getItem("room") ?? "null");
        return r;
    }

    updateMembers(members: string[]): void { 
        this.roomSubject.next(members);
    }
}