import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  checkUser(email: string): Observable<{ exists: boolean; user?: User }> {
    return this.http.post<{ exists: boolean; user?: User }>(`${this.apiUrl}/check`, { email })
      .pipe(
        catchError(error => {
          console.error('Error checking user:', error);
          return throwError(() => new Error('Error al verificar el usuario'));
        })
      );
  }

  createUser(email: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { email })
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
        }),
        catchError(error => {
          console.error('Error creating user:', error);
          return throwError(() => new Error('Error al crear el usuario'));
        })
      );
  }

  login(user: User): Observable<User> {
    this.setCurrentUser(user);
    return new Observable<User>(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}