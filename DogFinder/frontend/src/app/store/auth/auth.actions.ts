import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { CreateUserDto, IUser } from '@dog-finder/models';

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: IUser }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: HttpErrorResponse }>()
);
export const registration = createAction(
  '[Auth] Register',
  props<{ userDto: CreateUserDto }>()
);
export const registrationSucces = createAction(
  '[Auth] Registration Success',
  props<{ user: IUser }>()
);
export const registrationFailure = createAction(
  '[Auth] Registration Failure',
  props<{ error: HttpErrorResponse }>()
);
export const logout = createAction('[Auth] Logout');
export const logoutFinished = createAction('[Auth] Logout Finished');
export const logoutFailure = createAction(
  '[Auth] Logout',
  props<{ error: HttpErrorResponse }>()
);
