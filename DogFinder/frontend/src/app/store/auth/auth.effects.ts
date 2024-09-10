import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFinished,
  registration,
  registrationFailure,
  registrationSucces,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private router: Router,
    private actions$: Actions,
    private authService: AuthService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response) => {
            return loginSuccess(response);
          }),
          catchError((error) => {
            return of(loginFailure({ error }));
          })
        )
      )
    )
  );
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => logoutFinished()),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );
  registration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registration),
      switchMap((userData) =>
        this.authService.register(userData.userDto).pipe(
          map((user) => {
            return registrationSucces(user);
          }),
          catchError((error) => of(registrationFailure({ error })))
        )
      )
    )
  );
  loginSucces$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess, registrationSucces),
        map(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );
  logoutSucces$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutFinished),
        map(() => this.router.navigate(['/login']))
      ),
    { dispatch: false }
  );
}
