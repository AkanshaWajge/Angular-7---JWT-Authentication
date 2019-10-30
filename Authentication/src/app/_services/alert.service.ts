import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert message
                    this.clear();
                }
            }
        });
    }

    getAlert(): Observable<any> {
        return this.subject.asObservable();
    }

    success(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterRouteChange = false) {
        this.keepAfterRouteChange = keepAfterRouteChange;
        this.subject.next({ type: 'error', text: message });
    }

    clear() {
        // clear by calling subject.next() without parameters
        this.subject.next();
    }
}


/*
Create a folder named _components in the /src/app folder.

The _components folder contains shared Angular components that can be used by different parts of the application. 
The underscore "_" prefix is used to easily differentiate between shared code (e.g. _services, _components, _helpers etc) 
and feature specific code (e.g. home, login, register), the prefix also groups shared code folders together at the top of 
the folder structure in VS Code.
*/

/* 
The alert service provides a centralized / global way to display alert notifications from anywhere in the Angular 7
 application.

The constructor() method clears the alert message on route change, unless the keepAfterRouteChange property is true, 
in which case the keepAfterRouteChange property is reset to false so the alert will be cleared on the following route 
change. The service subscribes to Angular router events by calling router.events.subscribe() and checks the event is a
 route change by checking event instanceof NavigationStart.

The getAlert() method returns an Observable that any component can subscribe to to be notified when there is a new alert 

message. The alert component in the next step will subscribe to getAlert() so it can display the alert message.

The success() method:

has a parameter for the message text (message: string), and an optional parameter to continue displaying the message
 after one route change (keepAfterRouteChange) which defaults to false. This parameter is useful when you want to display
  an alert message after a redirect, like when a new user registers and is redirected to the login page.
publishes a new alert message to all subscribers by calling subject.next(). It wraps the message text in an object so it 
can include the type: 'success' property which will be used by the alert component to display a green success message.
The error() method does the same as the success() method, except it sets the message type to 'error' to tell the alert 
component to display it as a red error message.

The clear() method publishes an empty (undefined) value to all subscribers by calling subject.next() without parameters, 
which tells the alert component to remove the alert message from the UI.
*/