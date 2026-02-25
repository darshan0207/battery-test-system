import { Route } from '@angular/router';
import { PanelsResolver } from 'app/modules/admin/pages/panels/panels.resolvers';
import { PanelsComponent } from 'app/modules/admin/pages/panels/panels.component';
import { PanelsListComponent } from 'app/modules/admin/pages/panels/list/list.component';

export const panelsRoutes: Route[] = [
    {
        path: '',
        component: PanelsComponent,
        children: [
            {
                path: '',
                component: PanelsListComponent,
                resolve: {
                    panels: PanelsResolver,
                },
            },
        ],
    },
];
