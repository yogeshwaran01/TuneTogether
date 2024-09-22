import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from "primeng/listbox"
import { Video } from '../../../../common/socket';
import { PlaylistService } from '../../services/playlist.service';
import { OrderList, OrderListModule } from "primeng/orderlist"



@Component({
    selector: 'playlist',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        ButtonModule,
        OrderListModule,
        ListboxModule,
    ],
    templateUrl: "./Playlist.component.html",
    styleUrl: './Playlist.component.css',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class PlaylistComponent implements OnInit {

    @Input() allowAdd = true;
    @Input() allowRemove = true;
    @Input() allowSelect = true;

    @Output() onAdd = new EventEmitter<Video>();
    @Output() onRemove = new EventEmitter<Video>();
    @Output() onSelect = new EventEmitter<Video>();

    youtubeUrl: string = '';
    videoList: Video[] = [];
    selectedVideo: Video | null = null;

    constructor(private playlistService: PlaylistService, private cd: ChangeDetectorRef)
    {

    }

    ngOnInit(): void {
        this.videoList = this.playlistService.getVideos();
    }

    addVideo() {
        if (!this.youtubeUrl) { return; }
        const id: string | null = this.getYoutubeVideoId(this.youtubeUrl);
        if (!id) { return; }
        const video: Video = {
            url: this.youtubeUrl,
            title: `Vido ${id}`,
            id: id,
            thumbnail: `https://img.youtube.com/vi/${id}/0.jpg`
        }
        this.onAdd.emit(video);
        this.youtubeUrl = '';
        this.videoList = this.playlistService.getVideos();
        this.cd.detectChanges();
    }

    removeVideo(video: Video) {
        this.onRemove.emit(video);
        this.videoList = this.playlistService.getVideos();
        this.cd.detectChanges();

    }

    selectVideo(event: any) {
        //const selectedVideo: Video = event.value as Video;
        this.onSelect.emit(event);
    }

    private getYoutubeVideoId(url: string): string | null {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
}
