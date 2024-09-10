import { createReducer, on } from '@ngrx/store';
import { IUser } from '@dog-finder/models';
import {
  profileLoaded,
  UpdateUserFailure,
  UpdateUserSuccess,
} from './user.actions';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserState {
  profile: IUser | null;
  error: HttpErrorResponse | null;
}
export const initialState: UserState = {
  profile: null,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(profileLoaded, (state, { user }) => {
    return { ...state, profile: user };
  }),
  on(UpdateUserSuccess, (state, { user }) => {
    return { ...state, profile: user };
  }),
  on(UpdateUserFailure, (state, { error }) => {
    return { ...state, error };
  })
);
