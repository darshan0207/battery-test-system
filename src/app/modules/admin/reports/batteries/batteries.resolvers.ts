import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BatteriesService } from 'app/modules/admin/reports/batteries/batteries.service';

@Injectable({
    providedIn: 'root',
})
export class BatteriesResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _batteriesService: BatteriesService) {}

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
    ): Observable<any[]> {
        // return this._batteriesService.getBatteries();
        return;
    }
}
