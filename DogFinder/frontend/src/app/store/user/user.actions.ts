import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { IUser, UpdateUserDto } from '@dog-finder/models';

export const UpdateUser = createAction(
  '[User] Update User',
  props<{ updateDto: UpdateUserDto }>()
);

export const UpdateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: IUser }>()
);

export const UpdateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: HttpErrorResponse }>()
);
export const profileLoaded = createAction(
  '[Auth] Profile Loaded',
  props<{ user: IUser }>()
);
