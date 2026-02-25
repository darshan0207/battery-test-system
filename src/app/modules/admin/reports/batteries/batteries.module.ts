import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/shared/shared.module';
import { batteriesRoutes } from 'app/modules/admin/reports/batteries/batteries.routing';

import { BatteriesComponent } from './batteries.component';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';

@NgModule({
    declarations: [BatteriesComponent],
    imports: [
        RouterModule.forChild(batteriesRoutes),
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatLuxonDateModule,
        SharedModule,
    ],
})
export class BatteriesModule {}
