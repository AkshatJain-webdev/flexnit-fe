import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
  age: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(true);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<any> {
    return this.http
      .post(environment.apiUrl.concat('/api/v1/auth/login'), credentials, {
        withCredentials: true,
      })
      .pipe(tap(() => this.isAuthenticatedSubject.next(true)));
  }

  register(credentials: RegisterCredentials): Observable<any> {
    return this.http
      .post(environment.apiUrl.concat('/api/v1/auth/register'), credentials, {
        withCredentials: true,
      })
      .pipe(tap(() => this.isAuthenticatedSubject.next(true)));
  }

  logout(): void {
    this.http
      .post(
        environment.apiUrl.concat('/api/v1/auth/logout'),
        {},
        { withCredentials: true }
      )
      .subscribe(() => {
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/auth']);
      });
  }
}
