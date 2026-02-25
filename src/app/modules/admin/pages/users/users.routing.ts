import { Route } from '@angular/router';
import { UsersResolver } from 'app/modules/admin/pages/users/users.resolvers';
import { UsersComponent } from 'app/modules/admin/pages/users/users.component';
import { UsersListComponent } from 'app/modules/admin/pages/users/list/list.component';

export const usersRoutes: Route[] = [
    {
        path: '',
        component: UsersComponent,
        children: [
            {
                path: '',
                component: UsersListComponent,
                resolve: {
                    users: UsersResolver,
                },
            },
        ],
    },
];
