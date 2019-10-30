import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    currentUser: any;
    users = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}

/*
The home component contains logic for displaying the current user, a list of all users and enables the deletion of users.

The constructor() method:

specifies the dependencies that are required by the component as parameters, these are automatically injected
 by the Angular Dependency Injection (DI) system when the component is created.
assigns the currentUser property with the value authenticationService.currentUserValue so the current 
user can be displayed in the home component template.
The ngOnInit() method:

is an Angular lifecycle hook that runs once after the component is created. 
calls the this.loadAllUsers() method to load users so they can be displayed in the home component template.
The deleteUser() method:

calls the userService.delete() method with the user id to delete. The user service returns an Observable that 
we .subscribe() to for the results of the deletion. On success the users list is refreshed by calling this.loadAllUsers().
The call to .pipe(first()) unsubscribes from the observable immediately after the first value is emitted.

The loadAllUsers() method:

calls the userService.getAll() method and assigns the result to the this.users property so the users can be 
displayed in the home component template.
*/