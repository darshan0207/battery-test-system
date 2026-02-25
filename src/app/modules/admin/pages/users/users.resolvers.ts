import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from 'app/modules/admin/pages/users/users.service';
import { User } from 'app/modules/admin/pages/users/users.types';

@Injectable({
    providedIn: 'root',
})
export class UsersResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _usersService: UsersService) {}

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
    ): Observable<User[]> {
        return this._usersService.getUsers();
    }
}
