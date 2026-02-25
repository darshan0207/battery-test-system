import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanMatch {
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private _router: Router) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Can match
     *
     * @param route
     * @param segments
     */
    canMatch(
        route: Route,
        segments: UrlSegment[]
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        let roles = route.data.roles as Array<string>;
        //  const allowedRoles = next.data.roles as Array<string>;
        return this._check(segments, roles);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Check the authenticated status
     *
     * @param segments
     * @private
     */
    private _check(
        segments: UrlSegment[],
        roles
    ): Observable<boolean | UrlTree> {
        // Check the authentication status
        return this._authService.check().pipe(
            switchMap((authenticated) => {
                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page with a redirectUrl param
                    const redirectURL = `/${segments.join('/')}`;
                    const urlTree = this._router.parseUrl(
                        `sign-in?redirectURL=${redirectURL}`
                    );

                    return of(urlTree);
                }

                if (roles) {
                    const userRole = this._authService.gatUser();
                    if (roles && roles.indexOf(userRole.role) === -1) {
                        return of(false);
                    }
                    return of(true);
                }
                // Allow the access
                return of(true);
            })
        );
    }
}
