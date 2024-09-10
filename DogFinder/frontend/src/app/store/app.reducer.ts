import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import {
  routerReducer,
  RouterReducerState,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { userReducer, UserState } from './user/user.reducer';
export interface AppState {
  auth: AuthState;
  router: RouterReducerState<SerializedRouterStateSnapshot>;

  user: UserState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  router: routerReducer,
  user: userReducer,
};
