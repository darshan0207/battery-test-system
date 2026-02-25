import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

const API_URL: string = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private observableRequests = new Subject<any>();
    // private _socketdata: BehaviorSubject<any> = new BehaviorSubject(null);

    get socketdata$() {
        return this.observableRequests.asObservable();
    }

    add(request: any) {
        this.observableRequests.next(request);
    }
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    // get socketdata$(): Observable<any> {
    //     return this._socketdata.asObservable();
    // }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get(API_URL + 'api/panel').pipe(
            tap((response: any) => {
                if (response.status) {
                    this._data.next(response.data);
                }
            })
        );
    }
}
