import { Route } from '@angular/router';
import { BatteriesComponent } from 'app/modules/admin/reports/batteries/batteries.component';

export const batteriesRoutes: Route[] = [
    {
        path: '',
        component: BatteriesComponent,
    },
];
