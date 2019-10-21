import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_helpers';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);

/* 
To control access to a route with the auth guard you add it to the canActivate array in the route's configuration.
 The route guards in the canActivate array are run by Angular to decide if the route can be "activated", if all of
  the route guards return true navigation is allowed to continue, but if any of them return false navigation is cancelled.

We'll be adding the auth guard to home page route so users so users will have to be logged in to see the home page.

Open the app routing module file (/src/app/app.routing.ts) and add canActivate: [AuthGuard] to the home page (HomeComponent) 
route.
*/
