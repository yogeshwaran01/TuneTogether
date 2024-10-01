import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from "primeng/listbox";
import { OrderListModule } from "primeng/orderlist";
import { Video } from '../../../../common/socket';
import { PlaylistService } from '../../services/playlist.service';

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
    @Output() onReorder = new EventEmitter<Video[]>();

    youtubeUrl: string = '';
    videoList: Video[] = [];
    selectedVideo: Video | null = null;

    constructor(private playlistService: PlaylistService) {

    }

    ngOnInit(): void {
        this.playlistService.getVideos().subscribe((vs: Video[]) => {
            this.videoList = vs;
        });
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
    }

    removeVideo(video: Video) {
        this.onRemove.emit(video);

    }

    selectVideo(event: Video) {
        this.onSelect.emit(event);
    }

    handleReorder(_event: any) {
        this.onReorder.emit(this.videoList);
    }

    private getYoutubeVideoId(url: string): string | null {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }
}
