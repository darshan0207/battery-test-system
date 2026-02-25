import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Panel } from 'app/modules/admin/pages/panels/panels.types';
import { PanelsService } from 'app/modules/admin/pages/panels/panels.service';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'panels-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .inventory-grid {
                grid-template-columns: 48px auto auto 100px 100px;

                @screen sm {
                    grid-template-columns: 48px auto auto auto auto;
                }

                @screen md {
                    grid-template-columns: 48px auto auto auto auto;
                }

                @screen lg {
                    grid-template-columns: 48px auto auto 100px 100px;
                }
            }
        `,
    ],
})
export class PanelsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('panelNgForm') panelNgForm: NgForm;
    @ViewChild('panelsTable')
    searchInputControl: FormControl = new FormControl();
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    drawerMode: 'side' | 'over';
    panels: any;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    panelForm: FormGroup;
    isEdit: boolean = false;
    documentId: string;
    panelsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    panelsTableColumns: string[] = [
        'panel_name',
        'ip_address',
        'active',
        'action',
    ];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _panelsService: PanelsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _snackBar: MatSnackBar
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._panelsService.panels$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: Panel[]) => {
                this.panels = resp;
                this.panelsDataSource.data = resp;
                this._changeDetectorRef.markForCheck();
            });

        this.panelForm = this._formBuilder.group({
            panel_name: ['', Validators.required],
            ip_address: this._formBuilder.array([]),
            active: [true],
        });
        const ipaddressFormGroup = this._formBuilder.group({
            ip: ['', Validators.required],
            port: ['', Validators.required],
        });

        (this.panelForm.get('ip_address') as FormArray).push(
            ipaddressFormGroup
        );
        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
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

    /**
     * Add an empty ip address field
     */
    addIPAddressField(): void {
        // Create an empty ip address form group
        const ipAddressFormGroup = this._formBuilder.group({
            ip: ['', Validators.required],
            port: ['', Validators.required],
        });

        // Add the ip address form group to the ip address form array
        (this.panelForm.get('ip_address') as FormArray).push(
            ipAddressFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the ip address field
     *
     * @param index
     */
    removeIPAddressField(index: number): void {
        const ipAddressFormArray = this.panelForm.get(
            'ip_address'
        ) as FormArray;

        ipAddressFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        this.panelForm.enable();
        (this.panelForm.get('ip_address') as FormArray).clear();
        const ipAddressFormGroups = [];
        ipAddressFormGroups.push(
            this._formBuilder.group({
                ip: ['', Validators.required],
                port: ['', Validators.required],
            })
        );
        ipAddressFormGroups.forEach((formGroup) => {
            (this.panelForm.get('ip_address') as FormArray).push(formGroup);
        });
        this.panelNgForm.resetForm();

        this.panelForm.reset({
            panel_name: '',
            active: true,
        });
        this.matDrawer.close();
        this.isEdit = false;
        this.documentId = '';
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * open Drawer
     */
    openDrawer(): void {
        this.matDrawer.open();
        this._changeDetectorRef.markForCheck();
    }

    /**
     * On submit
     */
    onSubmit(): void {
        // Return if the form is invalid
        if (this.panelForm.invalid) {
            return;
        }

        // Disable the form
        this.panelForm.disable();

        if (this.isEdit) {
            this._panelsService
                .updatePanel(this.documentId, this.panelForm.value)
                .subscribe(
                    (response: any) => {
                        if (response.status) {
                            this._snackBar.open(
                                'Panel updated successfully ',
                                '',
                                {
                                    duration: 2000,
                                    horizontalPosition: 'end',
                                    verticalPosition: 'top',
                                    panelClass: ['success'],
                                }
                            );
                            this.onBackdropClicked();
                        }
                    },
                    (response) => {
                        this.panelForm.enable();
                        this._snackBar.open(
                            response && response.error && response.error.error,
                            '',
                            {
                                duration: 2000,
                                horizontalPosition: 'end',
                                verticalPosition: 'top',
                                panelClass: ['error'],
                            }
                        );
                    }
                );
        } else {
            this._panelsService.createPanel(this.panelForm.value).subscribe(
                (response: any) => {
                    if (response.status) {
                        this._snackBar.open('Panel added successfully ', '', {
                            duration: 2000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            panelClass: ['success'],
                        });
                        this.onBackdropClicked();
                    }
                },
                (response) => {
                    this.panelForm.enable();
                    this._snackBar.open(
                        response && response.error && response.error.error,
                        '',
                        {
                            duration: 2000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            panelClass: ['error'],
                        }
                    );
                }
            );
        }
    }
    /**
     * On submit
     */
    async onEdit(data: Panel) {
        this.isEdit = true;
        this.documentId = data._id;

        (this.panelForm.get('ip_address') as FormArray).clear();

        // Setup the ipAddress form array
        const ipAddressFormGroups = [];

        if (data.ip_address.length > 0) {
            // Iterate through them
            data.ip_address.forEach((item) => {
                ipAddressFormGroups.push(
                    this._formBuilder.group({
                        ip: [item.ip],
                        port: [item.port],
                    })
                );
            });
        } else {
            ipAddressFormGroups.push(
                this._formBuilder.group({
                    ip: ['', Validators.required],
                    port: ['', Validators.required],
                })
            );
        }

        ipAddressFormGroups.forEach((formGroup) => {
            (this.panelForm.get('ip_address') as FormArray).push(formGroup);
        });

        this.panelForm.patchValue({
            panel_name: data.panel_name,
            active: data.active,
        });
        this.openDrawer();
    }

    async onDelete(data: Panel) {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Remove panel',
            message:
                'Are you sure you want to remove this panel permanently? <span class="font-medium">This action cannot be undone!</span>',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Remove',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'Cancel',
                },
            },

            dismissible: true,
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.isLoading = true;
                this._panelsService.deletePanel(data._id).subscribe(
                    (response: any) => {
                        this.isLoading = false;
                        this._snackBar.open('Panel Delete successfully ', '', {
                            duration: 2000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            panelClass: ['success'],
                        });
                        this._changeDetectorRef.markForCheck();
                    },
                    (response) => {
                        this.isLoading = false;
                        this._snackBar.open(
                            response && response.error && response.error.error,
                            '',
                            {
                                duration: 2000,
                                horizontalPosition: 'end',
                                verticalPosition: 'top',
                                panelClass: ['error'],
                            }
                        );
                        this._changeDetectorRef.markForCheck();
                    }
                );
            }
        });
    }
}
