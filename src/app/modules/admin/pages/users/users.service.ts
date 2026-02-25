import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'app/modules/admin/pages/users/users.types';
import { environment } from 'environments/environment';

const API_URL: string = environment.API_URL;

@Injectable({
    providedIn: 'root',
})
export class UsersService {
    // Private
    private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for users
     */
    get users$(): Observable<User[]> {
        return this._users.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get users
     */
    getUsers(): Observable<User[]> {
        return this._httpClient.get<User[]>(API_URL + 'api/user').pipe(
            tap((response: any) => {
                if (response.status) {
                    this._users.next(response.data);
                }
            })
        );
    }

    /**
     * Crate user
     *
     * @param user
     */
    createUser(user: User): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .post<User>(API_URL + 'api/auth/sign-up', { ...user })
                    .pipe(
                        map((newUser: any) => {
                            // Update the tags with the new user
                            if (newUser.status) {
                                this._users.next([...users, newUser.data]);
                            }

                            // Return new user from observable
                            return newUser;
                        })
                    )
            )
        );
    }

    /**
     * Update the user
     *
     * @param id
     * @param user
     */
    updateUser(id: string, user: User): Observable<User> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient
                    .put<User>(API_URL + 'api/user/' + id, { ...user })
                    .pipe(
                        map((updatedUser: any) => {
                            // Find the index of the updated tag
                            const index = users.findIndex(
                                (item) => item._id === id
                            );
                            if (updatedUser.status) {
                                // Update the tag
                                users[index] = updatedUser.data;
                            }
                            // Update the tags
                            this._users.next(users);

                            // Return the updated tag
                            return updatedUser;
                        })
                    )
            )
        );
    }

    /**
     * Delete the user
     *
     * @param id
     */

    deleteUser(id: string): Observable<boolean> {
        return this.users$.pipe(
            take(1),
            switchMap((users) =>
                this._httpClient.delete(API_URL + 'api/user/' + id).pipe(
                    map((deletedUser: any) => {
                        // Find the index of the deleted task
                        const index = users.findIndex(
                            (item) => item._id === id
                        );

                        // Delete the user
                        if (deletedUser.status) {
                            users.splice(index, 1);
                        }
                        // Update the users
                        this._users.next(users);
                        // Return the deleted status
                        return deletedUser;
                    })
                )
            )
        );
    }
}
