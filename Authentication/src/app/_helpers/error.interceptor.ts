import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}

/* 
The Error Interceptor handles when an HTTP request from the Angular app returns a error response. 
If the error status is 401 Unauthorized the user is automatically logged out, otherwise the error 
message is extracted from the HTTP error response and thrown so it can be caught and displayed by 
the component that initiated the request.

The constructor() method specifies the AuthenticationService as a dependency which is automatically 
injected by the Angular Dependency Injection (DI) system.

The intercept() method:

passes the request to the next handler in the chain by calling next.handle(request) and handles errors by 
piping the observable response through the catchError operator by calling .pipe(catchError()).
checks if the status code is 401 and automatically logs the user out by calling this.authenticationService.logout(). 
After logout the application is reloaded by calling location.reload(true) which redirects the user to the login page.
extracts the error message from the error response object or defaults to the response status text if there isn't 
an error message (err.error.message || err.statusText).
throws an error with the error message so it can be handled by the component that initiated the request by calling 
throwError(error).
*/