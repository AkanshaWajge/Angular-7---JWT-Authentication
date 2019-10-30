import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../_services/alert.service';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getAlert()
            .subscribe(message => {
                switch (message && message.type) {
                    case 'success':
                        message.cssClass = 'alert alert-success';
                        break;
                    case 'error':
                        message.cssClass = 'alert alert-danger';
                        break;
                }

                this.message = message;
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

/*
The alert component uses the alert service to subscribe to messages and display them in the UI.

The @Component decorator contains two parameters, the selector: 'alert' parameter tells Angular to 
inject an instance of this component wherever it finds the <alert></alert> HTML tag. 
The templateUrl: 'alert.component.html' parameter tells Angular where to find the HTML template for this component.

The constructor() method specifies the AlertService as a dependency which is automatically injected by 
the Angular Dependency Injection (DI) system.

The ngOnInit() method:

is an Angular lifecycle hook that runs once after the component is created.
subscribes to new alert messages from the alert service by calling alertService.getAlert().subscribe().
checks the message.type to determine which cssClass to set on the message. The css classes are provided by 
Bootstrap 4 and display success messages as green alerts and error messages as red alerts.
assigns the message to the this.message property of the component to make it accessible to the component template.

The ngOnDestroy() method:

is an Angular lifecycle hook that runs once just before Angular destroys the component. 
unsubscribes from the alert service by calling subscription.unsubscribe() to avoid memory leaks.
*/