import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`http://localhost:4200/users`);
    }

    register(user) {
        return this.http.post(`http://localhost:4200/users/register`, user);
    }

    delete(id) {
        return this.http.delete(`http://localhost:4200/users/${id}`);
    }
}

/*
The user service handles all HTTP communication with the backend for CRUD (create, read, update, delete) operations on 
user data.

Each of the methods sends an HTTP request to the backend api and returns the response, initially we'll only be using the 
register() method, the getAll() and delete() methods will be used in the next part of the tutorial series.

The register() method accepts a user object parameter containing the user details from the registration form, 
it sends a POST request to the register route on the backend (`${config.apiUrl}/users/register`), passing the 
user object in the request body.
*/