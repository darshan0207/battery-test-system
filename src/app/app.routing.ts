import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards',
    },

    // Auth routes for guests
    {
        path: '',
        canMatch: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.module'
                    ).then((m) => m.AuthConfirmationRequiredModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.module'
                    ).then((m) => m.AuthForgotPasswordModule),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.module'
                    ).then((m) => m.AuthResetPasswordModule),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.module').then(
                        (m) => m.AuthSignInModule
                    ),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.module').then(
                        (m) => m.AuthSignUpModule
                    ),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canMatch: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.module').then(
                        (m) => m.AuthSignOutModule
                    ),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.module'
                    ).then((m) => m.AuthUnlockSessionModule),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canMatch: [AuthGuard],
        data: { roles: ['operator', 'manager', 'admin', 'super-admin'] },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.module'
                            ).then((m) => m.AnalyticsModule),
                    },
                ],
            },

            // Pages
            // {
            //     path: 'pages',
            //     data: {
            //         type: 'admin',
            //     },
            //     children: [
            //         {
            //             path: 'users',
            //             data: {
            //                 type: 'admin',
            //             },
            //             loadChildren: () =>
            //                 import(
            //                     'app/modules/admin/pages/users/users.module'
            //                 ).then((m) => m.UsersModule),
            //         },
            //         {
            //             path: 'panels',
            //             data: {
            //                 type: 'admin',
            //             },
            //             loadChildren: () =>
            //                 import(
            //                     'app/modules/admin/pages/panels/panels.module'
            //                 ).then((m) => m.PanelsModule),
            //         },

            //         // Profile
            //         {
            //             path: 'profile',
            //             loadChildren: () =>
            //                 import(
            //                     'app/modules/admin/pages/profile/profile.module'
            //                 ).then((m) => m.ProfileModule),
            //         },
            //     ],
            // },

            {
                path: 'users',
                canMatch: [AuthGuard],
                data: {
                    roles: ['admin', 'super-admin'],
                },
                loadChildren: () =>
                    import('app/modules/admin/pages/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
            {
                path: 'panels',
                canMatch: [AuthGuard],
                data: {
                    roles: ['super-admin'],
                },
                loadChildren: () =>
                    import('app/modules/admin/pages/panels/panels.module').then(
                        (m) => m.PanelsModule
                    ),
            },

            // Reports
            {
                path: 'reports',
                canMatch: [AuthGuard],
                data: {
                    roles: ['manager', 'admin', 'super-admin'],
                },
                children: [
                    {
                        path: '',
                        data: {
                            type: 'admin',
                        },
                        loadChildren: () =>
                            import(
                                'app/modules/admin/reports/batteries/batteries.module'
                            ).then((m) => m.BatteriesModule),
                    },
                ],
            },

            // 404 & Catch all
            {
                path: '404-not-found',
                pathMatch: 'full',
                loadChildren: () =>
                    import(
                        'app/modules/admin/pages/error/error-404/error-404.module'
                    ).then((m) => m.Error404Module),
            },
            { path: '**', redirectTo: '404-not-found' },
        ],
    },
];
