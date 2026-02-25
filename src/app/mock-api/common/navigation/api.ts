import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
    defaultOperatorNavigation,
    defaultManagerNavigation,
    defaultAdminNavigation,
    defaultSuperAdminNavigation,
    // compactNavigation,
    // defaultNavigation,
    // futuristicNavigation,
    // horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class NavigationMockApi {
    // private readonly _compactNavigation: FuseNavigationItem[] =
    //     compactNavigation;
    // private readonly _defaultNavigation: FuseNavigationItem[] =
    //     defaultNavigation;
    // private readonly _futuristicNavigation: FuseNavigationItem[] =
    //     futuristicNavigation;
    // private readonly _horizontalNavigation: FuseNavigationItem[] =
    //     horizontalNavigation;

    private readonly _operatorNavigation: FuseNavigationItem[] =
        defaultOperatorNavigation;
    private readonly _adminNavigation: FuseNavigationItem[] =
        defaultAdminNavigation;
    private readonly _managerNavigation: FuseNavigationItem[] =
        defaultManagerNavigation;
    private readonly _superAdminNavigation: FuseNavigationItem[] =
        defaultSuperAdminNavigation;

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _authService: AuthService
    ) {
        // Register Mock API handlers

        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
            // Fill compact navigation children using the default navigation
            const user = this._authService.gatUser();
            if (user.role === 'super-admin') {
                return [
                    200,
                    {
                        default: cloneDeep(this._superAdminNavigation),
                        horizontal: cloneDeep(this._superAdminNavigation),
                    },
                ];
            } else if (user.role === 'admin') {
                return [
                    200,
                    {
                        default: cloneDeep(this._adminNavigation),
                        horizontal: cloneDeep(this._adminNavigation),
                    },
                ];
            } else if (user.role === 'manager') {
                return [
                    200,
                    {
                        default: cloneDeep(this._managerNavigation),
                        horizontal: cloneDeep(this._managerNavigation),
                    },
                ];
            } else {
                return [
                    200,
                    {
                        default: cloneDeep(this._operatorNavigation),
                        horizontal: cloneDeep(this._operatorNavigation),
                    },
                ];
            }

            // Return the response
        });
    }
}
