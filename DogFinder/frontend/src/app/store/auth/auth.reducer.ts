import { HttpErrorResponse } from '@angular/common/http';
import { createReducer, on } from '@ngrx/store';
import {
  loginFailure,
  loginSuccess,
  logout,
  logoutFinished,
  registrationFailure,
  registrationSucces,
} from './auth.actions';

export interface AuthState {
  error: HttpErrorResponse | null;
}

export const initialState: AuthState = {
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user }) => {
    return {
      ...state,
      error: null,
    };
  }),
  on(loginFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(logout, () => initialState),
  on(registrationSucces, (state, { user }) => ({
    ...state,
    error: null,
  })),
  on(registrationFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
  on(logoutFinished, (state) => ({
    ...state,
    error: null,
  }))
);
