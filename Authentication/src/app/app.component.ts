import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}

/*
The app component uses the authentication service to know the current logged in status and to implement logout.

The currentUser property is used to show/hide the nav when the user is logged in/out. 
The constructor() method subscribes to the this.authenticationService.currentUser observable and updates 
the currentUser when the user logs in/out.

The logout() method calls this.authenticationService.logout(); to log the user out, then redirects to the login page. 
*/