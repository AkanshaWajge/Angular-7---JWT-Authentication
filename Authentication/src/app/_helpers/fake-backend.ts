import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};

 /* 
    Angular providers tell the Angular Dependency Injection (DI) system how to get a value for a dependency.
     The fakeBackendProvider hooks into the HTTP request pipeline by using the Angular built in injection 
     token HTTP_INTERCEPTORS, Angular has several built in injection tokens that enable you to hook into different 
     parts of the framework and application lifecycle events. The multi: true option in the fakeBackendProvider tells 
     Angular to add the provider to the collection of HTTP_INTERCEPTORS rather than replace the collection with this 
     single provider,this allows you to add multiple HTTP interceptors to the request pipeline for handling different tasks
    */

/* 
To simulate the behaviour of a real api with a database, the users array will be saved in browser local
 storage and initialised from 
local storage when the app starts, so registered users will persist when the browser is refreshed or closed. 
The default hardcoded user 
has been removed because the user will now register before logging in to the application.

The register route (/users/register) has been added to the handleRoute() function, requests to the register 
route are handled by the new 
register() function.

The register() function: 
- checks if the username is already taken and returns an error if it is.
- calculates the next user.id by adding 1 to the current highest user id (Math.max(...users.map(x => x.id)) + 1) 
or defaults to 1 for the first user.
- pushes the new user to the users array and saves the updated array in local storage.
- returns an empty ok response to indicate that registration was successful.

*/

/*
The secure get users route (/users) has been added to the handleRoute() function to enable fetching all users, 
requests to the get users route are handled 
by the new getUsers() function.

The getUsers() function:

checks if the user is logged in by calling the new isLoggedIn() helper function. If the user is not logged in a 
401 Unauthorized response is returned by calling the new unauthorized() helper function.
returns an ok() response with the whole users array in the response body.
The secure delete user route (/users/{id}) has been added to the handleRoute() function to enable deleting a user, 
requests to the delete user route are handled by the new deleteUser() function. The route uses the regular expression 
/\/users\/\d+$/ to matches urls that end with /users/ followed by any number for the user id.

The deleteUser() function:

checks if the user is logged in by calling the new isLoggedIn() helper function. If the user is not logged in a 401 
Unauthorized response is returned by calling the new unauthorized() helper function.
filters the users array to remove the user with the id from the request url. The id from the url is returned from the 
new idFromUrl() helper function.
saves the updated users array to browser local storage.
returns an ok() response.
A few new helper functions have been added that are used by the new routes: unauthorized(), isLoggedIn() and idFromUrl().

The unauthorized() function returns a 401 Unauthorized response.

The isLoggedIn() function checks if the HTTP Authorization header contains the correct token (fake-jwt-token).

The idFromUrl() function splits the url into parts with url.split('/') and converts the last part (the user id) from a 
string to an integer with parseInt(urlParts[urlParts.length - 1]).
*/