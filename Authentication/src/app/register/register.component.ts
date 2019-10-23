import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    error: string;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/login'], { queryParams: { registered: true }});
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }
}

/*
The register component contains all of the logic for validating the register form and handling form submission.

The constructor() method:

specifies the dependencies that are required by the component as parameters, these are automatically injected by the Angular Dependency Injection (DI) system when the component is created.
checks if the user is already logged in by checking authenticationService.currentUserValue and redirects to the home page if they are.
The ngOnInit() method:

is an Angular lifecycle hook that runs once after the component is created. For more info on Angular lifecycle hooks see https://angular.io/guide/lifecycle-hooks.
creates a new FormGroup by calling this.formBuilder.group() and assigns it to the this.registerForm property. The parameters passed to the FormBuilder tell it to create four form controls - firstName, lastName, username and password, the form controls are all initialised with empty strings ('') as values and set to required with the Validators.required Angular validator. The password field is also required to have at least 6 characters with the use of the minLength validator (Validators.minLength(6)).
The f() getter is a convenience property to enable shorthand access to the register form controls via this.f in the login component and f in the login component template that we'll create in the next step.

The onSubmit() method:

sets the this.submitted property to true to indicate that an attempt has been made to submit the form, this property is used in the register component template to display validation errors only after the first submission has been attempted.
checks if the form is valid by checking this.registerForm.invalid and prevents submission if it is invalid.
sets the this.loading property to true before submitting the registration details via the user service, this property is used in the register component template to display a loading spinner and disable the register button.
registers the user by calling the this.userService.register() method and passing it the form data (this.registerForm.value). The user service returns an Observable that we .subscribe() to for the results of the registration. On success the user is redirected to the /login route by calling this.router.navigate(), passing registered=true as a query parameter so the login page can display a success message. On fail the error message is assigned to the this.error property to be displayed by the template and the this.loading property is reset back to false.
The call to .pipe(first()) unsubscribes from the observable immediately after the first value is emitted.
*/
