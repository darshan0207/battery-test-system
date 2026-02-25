import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Panel } from 'app/modules/admin/pages/panels/panels.types';
import { environment } from 'environments/environment';

const API_URL: string = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class PanelsService {
    // Private
    private _panels: BehaviorSubject<Panel[] | null> = new BehaviorSubject(
        null
    );

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for panels
     */
    get panels$(): Observable<Panel[]> {
        return this._panels.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get panels
     */
    getPanels(): Observable<Panel[]> {
        return this._httpClient.get<Panel[]>(API_URL + 'api/panel').pipe(
            tap((response: any) => {
                if (response.status) {
                    this._panels.next(response.data);
                }
            })
        );
    }

    /**
     * Crate panel
     *
     * @param panel
     */
    createPanel(panel: Panel): Observable<Panel> {
        return this.panels$.pipe(
            take(1),
            switchMap((panels) =>
                this._httpClient
                    .post<Panel>(API_URL + 'api/panel', { ...panel })
                    .pipe(
                        map((newPanel: any) => {
                            // Update the tags with the new panel
                            if (newPanel.status) {
                                this._panels.next([...panels, newPanel.data]);
                            }

                            // Return new panel from observable
                            return newPanel;
                        })
                    )
            )
        );
    }

    /**
     * Update the panel
     *
     * @param id
     * @param panel
     */
    updatePanel(id: string, panel: Panel): Observable<Panel> {
        return this.panels$.pipe(
            take(1),
            switchMap((panels) =>
                this._httpClient
                    .put<Panel>(API_URL + 'api/panel/' + id, { ...panel })
                    .pipe(
                        map((updatedPanel: any) => {
                            const index = panels.findIndex(
                                (item) => item._id === id
                            );
                            if (updatedPanel.status) {
                                panels[index] = updatedPanel.data;
                            }
                            this._panels.next(panels);

                            return updatedPanel;
                        })
                    )
            )
        );
    }

    /**
     * Delete the panel
     *
     * @param id
     */

    deletePanel(id: string): Observable<boolean> {
        return this.panels$.pipe(
            take(1),
            switchMap((panels) =>
                this._httpClient.delete(API_URL + 'api/panel/' + id).pipe(
                    map((deletedPanel: any) => {
                        // Find the index of the deleted task
                        const index = panels.findIndex(
                            (item) => item._id === id
                        );

                        // Delete the panel
                        if (deletedPanel.status) {
                            panels.splice(index, 1);
                        }
                        // Update the panels
                        this._panels.next(panels);
                        // Return the deleted status
                        return deletedPanel;
                    })
                )
            )
        );
    }
}
