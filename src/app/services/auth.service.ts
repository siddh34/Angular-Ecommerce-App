import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, mergeMap, Observable, throwError } from 'rxjs';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'https://mockapi.io/auth';
  //private apiUrl = 'http://localhost:3000';
  private apiUrl =
    'https://ecommerce-sid.netlify.app/.netlify/functions/json-server';
  constructor(private http: HttpClient, private cartService: CartService) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?email=${credentials.email}`)
      .pipe(
        map((users) => {
          debugger;
          if (users.length > 0) {
            const user = users.find((u) => u.password === credentials.password);

            if (user) {
              let obj = { Status: 'SUCCESS', Data: user };
              return obj;
            } else {
              let message = 'Email or Password is Invalid. Please Try Again';
              let obj = { Status: message, Data: null };
              return obj;
            }
          } else {
            let message = 'User not found. Please check your email.';
            let obj = { Status: message, Data: null };
            return obj;
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    return throwError(error.message || 'Error');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    this.cartService.clearCart();
    localStorage.removeItem('token');
  }

  signup(user: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }): Observable<any> {
    // Check if the email already exists
    return this.http.get<any>(`${this.apiUrl}/users?email=${user.email}`).pipe(
      mergeMap((existingUser: any) => {
        if (existingUser.length > 0) {
          // Email already exists, return an error
          const errorMessage =
            'Email is already registered. Please use a different email.';
          return throwError(errorMessage);
        } else {
          // Email does not exist, proceed with signup
          return this.http.post<any>(`${this.apiUrl}/users`, user).pipe(
            catchError((error) => {
              // console.error('Error registering user:', error);
              let errorMessage =
                'Something went wrong; please try again later.';
              if (error.error && error.error.message) {
                errorMessage = error.error.message;
              }
              return throwError(error);
            })
          );
        }
      }),
      catchError((error) => {
        // console.error('Error checking email:', error);
        let errorMessage = 'Something went wrong; please try again later.';

        return throwError(error);
      })
    );
  }
}
