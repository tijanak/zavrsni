import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@dog-finder/environment';
import { CreateUserDto } from '@dog-finder/models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  getProfile() {
    return this.httpClient.get<any>(`${environment.API_URL}auth/profile`).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }
  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.API_URL}auth/login`,
      { username: email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  logout() {
    return this.httpClient.post(`${environment.API_URL}auth/logout`, null);
  }
  register(dto: CreateUserDto): Observable<any> {
    return this.httpClient.post(`${environment.API_URL}auth/register`, dto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
