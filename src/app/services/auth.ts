import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private router: Router) { }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      name: user.name,
      lastname: user.lastName,
      email: user.email,
      password: user.password,
      // role no se envía, se asigna en el backend
    },
      { headers: this.getHeaders() }
    );
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/login`, 
      { email, password },
      { headers }
    ).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      finalize(() => {
        // Limpieza después de la solicitud, independientemente del resultado
        this.clearAuthData();
        this.redirectToLogin();
      }),
      catchError(error => {
        // Manejo de errores opcional
        console.error('Error during logout:', error);
        return throwError(() => error);
      })
    );
  }

  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  private redirectToLogin(): void {
    this.router.navigate(['/login'], {
      queryParams: { 
        sessionEnded: true,
        redirectFrom: this.router.url 
      }
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getTokenExpiration(): Date | null {
    const token = this.getToken();
    return token ? this.jwtHelper.getTokenExpirationDate(token) : null;
  }
}
