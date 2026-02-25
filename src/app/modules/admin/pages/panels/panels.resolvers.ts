import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PanelsService } from 'app/modules/admin/pages/panels/panels.service';
import { Panel } from 'app/modules/admin/pages/panels/panels.types';

@Injectable({
    providedIn: 'root',
})
export class PanelsResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _panelsService: PanelsService) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Panel[]> {
        return this._panelsService.getPanels();
    }
}
