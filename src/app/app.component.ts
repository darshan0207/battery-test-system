import { Component } from '@angular/core';
import { SocketService } from 'app/shared/services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    /**
     * Constructor
     */
    constructor(private _socketService: SocketService) {
        if (localStorage.getItem('accessToken'))
            this._socketService.socketInit();
    }
}
