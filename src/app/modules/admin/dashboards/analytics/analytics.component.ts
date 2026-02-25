import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';

@Component({
    selector: 'analytics',
    templateUrl: './analytics.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    data: any;
    selectedPanel: any;
    selectedPanelData: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _analyticsService: AnalyticsService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this._analyticsService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp) => {
                this.data = resp;
                if (this.data.length) {
                    const obj = {};
                    this.selectedPanel = this.data[0];
                    this._analyticsService.socketdata$.subscribe(
                        (item: any) => {
                            const val: any = item['panelno'];
                            obj[val] = item;
                            // if (this.selectedPanel.ip_address[0].ip === val) {
                            this.selectedPanelData = obj;
                            // }
                            // else {
                            //     this.selectedPanelData = null;
                            // }
                            this._changeDetectorRef.markForCheck();
                        }
                    );
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onChangeIP(val): any {
        this.selectedPanel = val;
    }

    decimalPipeValue(val: any): any {
        if (!isNaN(Number(val))) {
            return Number(val).toFixed(2);
        } else {
            return val;
        }
    }

    getBackgroundColorcycle1(index: any) {
        return index === 1 || index === '1' ? 'rgb(59 130 246)' : 'rgba(255, 255, 255,0.6)';
    }

    getBackgroundColorcycle2(index: any) {
        return index === 2 || index === '2' ? 'rgb(245 158 11)' : 'rgba(255, 255, 255,0.6)';
    }

    getBackgroundColorcycle3(index: any) {
        return index === 3 || index === '3' ? 'rgb(34 197 94)' :'rgba(255, 255, 255,0.6)';
    }

    getBackgroundColor(index: any) {
        // if (index === 0 || index === '0') {
        //     return 'rgb(59 130 246)';
        // } else
            if (index === 1 || index === '1') {
            return 'rgb(59 130 246)';
        } else if (index === 2 || index === '2') {
            return 'rgb(245 158 11)';
        } else if (index === 3 || index === '3') {
            return 'rgb(34 197 94)';
        } else {
            return 'rgba(255, 255, 255,0.6)';
        }
    }

    getColor(val1, val2) {
        if (val1 < val2 || val1 >= 16) {
            return 'rgb(239 68 68)';
        }
        return 'white';
    }
}
