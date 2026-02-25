import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';

const API_URL: string = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class BatteriesService {
    // Private
    private _batteries: BehaviorSubject<any[] | null> = new BehaviorSubject(
        null
    );

    private _panel: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for batteries
     */
    get batteries$(): Observable<any[]> {
        return this._batteries.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get panel
     */

    getPanel(): Observable<any> {
        return this._httpClient.get(API_URL + 'api/panel').pipe(
            tap((response: any) => {
                if (response.status) {
                    this._panel.next(response.data);
                }
            })
        );
    }

    /**
     * Get batteries
     */
    getBatteries(payload: any): Observable<any[]> {
        return this._httpClient
            .get<any[]>(
                API_URL +
                    `api/report?panelno=${payload.station}&select_date=${payload.select_date}`
            )
            .pipe(
                tap((response: any) => {
                    if (response.status) {
                        this._batteries.next(response.data);
                    }
                })
            );
    }

    /**
     * Crate batch
     *
     * @param batch
     */
    createBatch(data: any): Observable<any> {
        return this._httpClient
            .post<any>(API_URL + 'api/report', { ...data })
            .pipe(
                map((newData: any) => {
                    if (newData.status) {
                        this._batteries.next(newData.data);
                    }
                    return newData;
                })
            );
    }
}
