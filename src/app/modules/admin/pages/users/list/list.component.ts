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

import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { User } from 'app/modules/admin/pages/users/users.types';
import { UsersService } from 'app/modules/admin/pages/users/users.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    Validators,
} from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'users-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [
        `
            .inventory-grid {
                grid-template-columns: 48px auto auto auto 100px 100px 100px;

                @screen sm {
                    grid-template-columns: auto auto auto auto auto;
                }

                @screen md {
                    grid-template-columns: auto auto auto auto auto;
                }

                @screen lg {
                    grid-template-columns: 48px auto auto auto 100px 100px 100px;
                }
            }
        `,
    ],
})
export class UsersListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    @ViewChild('userNgForm') userNgForm: NgForm;
    @ViewChild('recentTransactionsTable')
    recentTransactionsTableMatSort: MatSort;
    searchInputControl: FormControl = new FormControl();
    horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    drawerMode: 'side' | 'over';
    users: User[];
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userForm: FormGroup;
    isEdit: boolean = false;
    documentId: string;
    recentTransactionsDataSource: MatTableDataSource<any> =
        new MatTableDataSource();
    recentTransactionsTableColumns: string[] = [
        'first_name',
        'last_name',
        'email',
        'role',
        'status',
        'action',
    ];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _usersService: UsersService,
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
        this._usersService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((resp: User[]) => {
                this.users = resp;
                this.recentTransactionsDataSource.data = resp;
                this._changeDetectorRef.markForCheck();
            });

        this.userForm = this._formBuilder.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            role: ['operator', Validators.required],
            active: [true],
        });
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

        // Listen for shortcuts
        // fromEvent(this._document, 'keydown')
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         filter<KeyboardEvent>(
        //             (event) =>
        //                 (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
        //                 event.key === '/' // '/' or '.' key
        //         )
        //     )
        //     .subscribe((event: KeyboardEvent) => {
        //         // If the '/' pressed
        //         if (event.key === '/') {
        //             this.openDrawer();
        //         }
        //     });
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        this.userForm.enable();
        this.userNgForm.resetForm();
        this.userForm.reset({
            role: 'user',
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
        if (this.userForm.invalid) {
            return;
        }

        // Disable the form
        this.userForm.disable();

        if (this.isEdit) {
            this._usersService
                .updateUser(this.documentId, this.userForm.value)
                .subscribe(
                    (response: any) => {
                        if (response.status) {
                            this._snackBar.open(
                                'User updated successfully ',
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
            this._usersService.createUser(this.userForm.value).subscribe(
                (response: any) => {
                    if (response.status) {
                        this._snackBar.open('User added successfully ', '', {
                            duration: 2000,
                            horizontalPosition: 'end',
                            verticalPosition: 'top',
                            panelClass: ['success'],
                        });
                        this.onBackdropClicked();
                    }
                },
                (response) => {
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
    async onEdit(data: User) {
        this.isEdit = true;
        this.documentId = data._id;
        this.userForm.patchValue({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            active: data.active,
            role: data.role,
        });
        this.openDrawer();
    }

    async onDelete(data: User) {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Remove user',
            message:
                'Are you sure you want to remove this user permanently? <span class="font-medium">This action cannot be undone!</span>',
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
                this._usersService.deleteUser(data._id).subscribe(
                    (response: any) => {
                        this.isLoading = false;
                        this._snackBar.open('User Delete successfully ', '', {
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
