import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  get<T>(endpoint: string): Observable<T> {
    return of({} as T).pipe(delay(500));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return of({} as T).pipe(delay(500));
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return of({} as T).pipe(delay(500));
  }

  delete<T>(endpoint: string): Observable<T> {
    return of({} as T).pipe(delay(500));
  }
}
