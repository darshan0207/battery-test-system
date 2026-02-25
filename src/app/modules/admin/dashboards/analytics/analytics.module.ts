import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AnalyticsComponent } from 'app/modules/admin/dashboards/analytics/analytics.component';
import { analyticsRoutes } from 'app/modules/admin/dashboards/analytics/analytics.routing';
import { FuseCardModule } from '@fuse/components/card';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [AnalyticsComponent],
    imports: [
        RouterModule.forChild(analyticsRoutes),
        FuseCardModule,
        SharedModule,
        MatIconModule,
    ],
})
export class AnalyticsModule {}
