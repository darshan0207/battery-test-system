import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'panels',
    templateUrl: './panels.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelsComponent {
    /**
     * Constructor
     */
    constructor() {}
}
