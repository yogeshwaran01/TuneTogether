import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class YoutubeApiService {

    private apiLoaded = false;

    constructor() {
        this.loadYouTubeAPI();
    }

    private loadYouTubeAPI() {
        if (this.apiLoaded) {
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        script.onload = () => {
            this.apiLoaded = true;
        };
    }
}
