import { Injectable } from '@angular/core';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';
import { environment } from 'environments/environment.prod';
import { io } from 'socket.io-client';
// import { ToastrService } from 'ngx-toastr';
AnalyticsService;
@Injectable()
export class SocketService {
    public socket: any;
    constructor(
        private _analyticsService: AnalyticsService // private toastr: ToastrService
    ) {}

    socketInit() {
        if (localStorage.getItem('accessToken')) {
            console.log('connect');
            if (this.socket) this.socket.close();
            this.socket = io(environment.API_URL, {
                transports: ['websocket'],
                query: {
                    token: localStorage.getItem('accessToken'),
                },
            });
            this.socket.on('connect', (data: any) => {
                console.log('connect');
            });
            this.socket.on('disconnect', () => {
                console.log('disconnect');
            });
            this.socket.on('error', (error: any) => {
                console.log(error);
            });
            this.socket.on('result', (data: any) => {
                console.log('result');
                this._analyticsService.add(data.data);
            });
            this.socket.on('notification', (data: any) => {
                console.log('notification');
                // this.toastr.info(data.data, 'Notification', {
                //     disableTimeOut: true,
                //     tapToDismiss: false,
                //     closeButton: true,
                // });
            });
        }
    }

    emit(name: any, data: any) {
        if (this.socket)
            this.socket.emit(
                name,
                data ? JSON.parse(data) : '',
                (response: any) => {
                    console.log(response); // "got it"
                }
            );
    }

    disconnectSocket() {
        if (this.socket) this.socket.close();
    }
}
