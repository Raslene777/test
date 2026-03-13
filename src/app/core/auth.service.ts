import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  role: 'trader' | 'admin';
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal(false);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: '1',
          email,
          role: email.includes('admin') ? 'admin' : 'trader',
          name: email.split('@')[0]
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  register(email: string, password: string, name: string): Observable<User> {
    return new Observable(observer => {
      setTimeout(() => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          role: 'trader',
          name
        };

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticated.set(true);
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
